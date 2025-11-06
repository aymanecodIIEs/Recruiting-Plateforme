const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const Application = require('../models/Application')
const Offer = require('../models/Offer')
const { scoreCvAgainstOffer } = require('../services/compatibilityScorer')

const router = express.Router()

// store uploads first in tmp, then move to uploads/candidature/<applicationId>
const tmpDir = path.join(process.cwd(), 'uploads', 'tmp')
fs.mkdirSync(tmpDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, tmpDir)
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_')
    const timestamp = Date.now()
    cb(null, `${timestamp}_${safeName}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
    ]
    if (!allowed.includes(file.mimetype)) return cb(new Error('Unsupported file type'))
    cb(null, true)
  },
})

router.post(
  '/',
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'documents', maxCount: 10 },
  ]),
  async (req, res, next) => {
    try {
      const {
        jobId,
        jobTitle,
        company,
        candidateId,
        message,
      } = req.body || {}

      // Validate offer id if provided
      let offerId = null
      if (jobId && /^[a-f\d]{24}$/i.test(String(jobId))) {
        offerId = jobId
      }

      // Reject duplicate application for same candidate/offer
      if (offerId && candidateId) {
        const existing = await Application.findOne({ offer: offerId, candidateId }).select('_id').lean()
        if (existing) return res.status(409).json({ error: 'already_applied' })
      }

      // Create base application (without file paths first)
      const appDoc = await Application.create({
        offer: offerId || undefined,
        jobTitle: jobTitle || undefined,
        companyName: company || undefined,
        candidateId: candidateId || undefined,
        message: message || undefined,
        status: 'soumis',
        cv: undefined,
        documents: [],
      })

      const appId = appDoc._id.toString()
      const appDir = path.join(process.cwd(), 'uploads', 'candidature', appId)
      fs.mkdirSync(appDir, { recursive: true })

      const moveToAppDir = (file) => {
        const destPath = path.join(appDir, file.filename)
        fs.renameSync(file.path, destPath)
        return {
          filename: file.originalname,
          path: `/uploads/candidature/${appId}/${file.filename}`,
          size: file.size,
          mimetype: file.mimetype,
        }
      }

      const cvFile = req.files?.cv?.[0]
      const docsFiles = Array.isArray(req.files?.documents) ? req.files.documents : []

      const cvStored = cvFile ? moveToAppDir(cvFile) : undefined
      const docsStored = docsFiles.map(moveToAppDir)

      appDoc.cv = cvStored
      appDoc.documents = docsStored
      await appDoc.save()

      // Optionally, attach full offer (with company populated) in response
      let offerSummary = null
      if (offerId) {
        const offer = await Offer.findById(offerId)
          .populate('company')
          .lean()
        offerSummary = offer || null
      }

      // Analyze CV like cvParser: extract text from PDF then parse via Gemini
      let analysis = null
      if (cvStored && cvStored.path && cvFile?.mimetype === 'application/pdf') {
        try {
          const absPath = path.join(process.cwd(), cvStored.path.replace(/^\//, ''))
          console.log('[applications] CV analysis starting for', { absPath, mimetype: cvFile.mimetype })
          const fsLocal = require('fs')
          const exists = fsLocal.existsSync(absPath)
          if (!exists) {
            console.warn('[applications] CV file not found at', absPath)
          }
          const buf = fsLocal.readFileSync(absPath)
          // Create a plain Uint8Array (not Buffer subclass)
          const data = Uint8Array.from(buf)
          console.log('[applications] CV file bytes read:', data?.length, '| isUint8Array:', data instanceof Uint8Array, '| isBuffer:', Buffer.isBuffer(buf))
          // Use same build as CV extract controller
          const pdfjsModule = await import('pdfjs-dist/build/pdf.mjs')
          const pdfjsLib = pdfjsModule.default || pdfjsModule
          const loadingTask = pdfjsLib.getDocument({ data })
          const pdf = await loadingTask.promise
          console.log('[applications] PDF loaded, pages =', pdf.numPages)
          let fullText = ''
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum)
            const textContent = await page.getTextContent()
            const pageText = textContent.items.map((item) => item.str).join(' ')
            fullText += `\n--- Page ${pageNum} ---\n` + pageText + '\n'
          }
          console.log('[applications] Extracted text length:', fullText.length)
          const { extractCvData } = require('../services/cvParser')
          let parsed = null
          try {
            parsed = await extractCvData(fullText)
            console.log('[applications] Parsed CV keys:', parsed ? Object.keys(parsed) : null)
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('CV analysis failed:', e?.message || e)
          }
          // Run compatibility score using parsed CV (fallback to raw text) and full offer
          let compatibility = null
          let statusOverride = null
          try {
            if (offerSummary) {
              const inputCv = parsed || fullText
              compatibility = await scoreCvAgainstOffer(inputCv, offerSummary)
              if (compatibility && typeof compatibility.score_percent === 'number') {
                appDoc.compatibilityScore = compatibility.score_percent
              }
              if (compatibility && typeof compatibility.score_percent === 'number') {
                if (compatibility.score_percent >= 50) {
                  statusOverride = 'cv_traite'
                } else {
                  statusOverride = 'rejete'
                  if (!compatibility.reason) compatibility.reason = 'not compatible'
                  appDoc.rejectionReason = compatibility.reason
                }
              }
            }
          } catch (e) {
            console.warn('[applications] Compatibility scoring failed:', e?.message || e)
          }
          analysis = {
            preview: fullText.slice(0, 1200),
            parsed,
            compatibility,
          }
          // Apply status based on compatibility if available
          if (statusOverride) {
            appDoc.status = statusOverride
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Failed to analyze uploaded CV:', e?.message || e)
        }
      }

      // Persist analysis on the candidature and update status to cv_traite
      try {
        if (analysis) appDoc.analysis = analysis
        if (!appDoc.status || appDoc.status === 'soumis') {
          appDoc.status = 'cv_traite'
        }
        await appDoc.save()
      } catch (_e) {}

      const json = appDoc.toJSON()
      const payload = { ...json, offer: offerSummary || json.offer, analysis }
      try {
        console.log('[applications] Returning payload summary:', {
          id: payload.id,
          offerId: payload.offer ? (payload.offer._id || payload.offer.id || payload.offer) : null,
          status: payload.status,
          hasAnalysis: !!payload.analysis,
        })
        console.log('[applications] Offer info:', payload.offer)
        if (payload.analysis) {
          console.log('[applications] Analysis preview length:', payload.analysis.preview?.length || 0)
          console.log('[applications] Analysis parsed keys:', payload.analysis.parsed ? Object.keys(payload.analysis.parsed) : null)
          if (payload.analysis.compatibility) {
            console.log('[applications] Compatibility score:', payload.analysis.compatibility.score_percent)
          }
        }
      } catch (_e) {}
      return res.status(201).json(payload)
    } catch (err) {
      return next(err)
    }
  }
)

// List applications (filter by candidateId and/or offerId)
router.get('/', async (req, res, next) => {
  try {
    const { candidateId, offerId } = req.query || {}
    const criteria = {}
    if (candidateId) criteria.candidateId = candidateId
    if (offerId && /^[a-f\d]{24}$/i.test(String(offerId))) criteria.offer = offerId
    const list = await Application.find(criteria).sort({ createdAt: -1 }).lean()

    // enrich with offer + company
    const offerIds = Array.from(new Set(list.map((a) => (a.offer ? String(a.offer) : null)).filter(Boolean)))
    let enriched = list
    if (offerIds.length > 0) {
      const OfferModel = require('../models/Offer')
      const CompanyModel = require('../models/Company')
      const offers = await OfferModel.find({ _id: { $in: offerIds } })
        .select('title company')
        .lean()
      const offerIdToOffer = offers.reduce((acc, o) => {
        acc[String(o._id)] = o
        return acc
      }, {})
      const companyIds = Array.from(
        new Set(
          offers
            .map((o) => (o.company ? String(o.company) : null))
            .filter(Boolean)
        )
      )
      const companies = await CompanyModel.find({ _id: { $in: companyIds } })
        .select('name imageUrl')
        .lean()
      const companyIdToDoc = companies.reduce((acc, c) => {
        acc[String(c._id)] = { name: c.name, imageUrl: c.imageUrl || '' }
        return acc
      }, {})

      enriched = list.map((a) => {
        const off = a.offer ? offerIdToOffer[String(a.offer)] : null
        const comp = off?.company ? companyIdToDoc[String(off.company)] : null
        return {
          ...a,
          id: String(a._id),
          offerMeta: off
            ? {
                id: String(off._id),
                title: off.title || null,
                company: comp || null,
              }
            : null,
        }
      })
    }
    // ensure id field for all entries
    const withIds = enriched.map((a) => (a.id ? a : { ...a, id: String(a._id) }))
    return res.json(withIds)
  } catch (err) {
    return next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const doc = await Application.findById(id).lean()
    if (!doc) return res.status(404).json({ error: 'not found' })
    return res.json({ ...doc, id: String(doc._id) })
  } catch (err) {
    return next(err)
  }
})

module.exports = router

// Delete an application and its uploaded files directory
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const doc = await Application.findById(id)
    if (!doc) return res.status(404).json({ error: 'not_found' })

    // Remove files folder uploads/candidature/<id>
    const dir = path.join(process.cwd(), 'uploads', 'candidature', id)
    try {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true })
      }
    } catch (_e) {}

    await doc.deleteOne()
    return res.json({ ok: true })
  } catch (err) {
    return next(err)
  }
})


