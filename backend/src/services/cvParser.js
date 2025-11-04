const dotenv = require('dotenv')
dotenv.config()

const INSTRUCTION = `
You are a resume parser that reads unstructured CV text and returns JSON only.
The JSON must follow exactly this schema:

{
  "civilite": "Monsieur" | "Madame" | "Non précisé",
  "nom": "",
  "prenom": "",
  "ville": "",
  "code_postal": "",
  "telephone": "",
  "liens": {
    "github": "",
    "linkedin": "",
    "autres": ["", ""]
  },
  "projets_professionnels": [
    {
      "nom": "",
      "niveau": "",
      "organisme": "",
      "date": "",
      "description": "",
      "competences": ["", ""]
    }
  ],
  "documents": [
    {
      "nom": "",
      "lien": ""
    }
  ]
}

Rules:
- If some data is missing, fill it with an empty string or "Non précisé".
- Detect civilité (Monsieur, Madame, or Non précisé) from text.
- Extract only URLs in github/linkedin fields if available.
- Keep other links under "autres".
- "projets_professionnels" and "documents" can each have multiple entries.
- Return valid JSON and nothing else.
- Do NOT include any markdown, explanations, or prose. NO code fences. JSON only.
`

// Retry helper for Gemini REST calls with exponential backoff on 503
async function generateContentWithRetry(endpointUrl, data, retries = 5) {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms))
  for (let i = 0; i < retries; i++) {
    const res = await fetch(endpointUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      return await res.json()
    }
    if (res.status === 503) {
      const jitter = Math.floor(Math.random() * 250)
      const wait = 1000 * Math.pow(2, i) + jitter
      // eslint-disable-next-line no-console
      console.warn(`503 received. Retrying in ${wait / 1000}s...`)
      await delay(wait)
      continue
    }
    throw new Error(`Request failed: ${res.status}`)
  }
  throw new Error('All retries failed due to service unavailability.')
}

 async function extractCvData(cvText) {
  // Use Google Generative Language REST API with CV_KEY
  if (!process.env.CV_KEY) {
    // eslint-disable-next-line no-console
    console.warn('CV_KEY not set; skipping Gemini parsing.')
    return null
  }
  // Model configuration: only Gemini 2.5 per request
  const model = 'gemini-2.5-flash'
  const url = `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.CV_KEY)}`

   const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${INSTRUCTION}\n\nCV TEXT:\n${cvText}` }],
      },
    ],
     generationConfig: {
       temperature: 0.2,
       maxOutputTokens: 1024,
     },
   }

  // First attempt with retry/backoff
  try {
    const json = await generateContentWithRetry(url, body, 5)
    const parts = json?.candidates?.[0]?.content?.parts
    const combined = Array.isArray(parts) ? parts.map((p) => p.text || '').join('') : ''
    let text = (combined || '').trim()
    if (!text && json.candidates && json.candidates[0] && json.candidates[0].output) {
      text = String(json.candidates[0].output || '').trim()
    }

   if (!text) {
    console.log(text)
     if (process.env.OPENAI) {
       try {
        console.log("here")
         const { default: OpenAI } = await import('openai')
         const client = new OpenAI({ apiKey: process.env.OPENAI })
         const resp = await client.chat.completions.create({
           model: 'gpt-3.5-turbo',
           messages: [{ role: 'user', content: `${INSTRUCTION}\n\nCV TEXT:\n${cvText}` }],
           max_tokens: 1024,
           temperature: 0.2,
         })
         let oaiText = ''
         if (resp && resp.choices && resp.choices[0] && resp.choices[0].message) {
           oaiText = String(resp.choices[0].message.content || '').trim()
         }
         console.log("oaiText");
         if (oaiText) {
           try {
             return JSON.parse(oaiText)
           } catch (_e) {
             const s = oaiText.indexOf('{')
             const e = oaiText.lastIndexOf('}')
             if (s >= 0 && e > s) {
               const fixed = oaiText.slice(s, e + 1)
               try { return JSON.parse(fixed) } catch (_e2) {}
             }
           }
         }
       } catch (_) {}
     }
     return null
   }

    try {
      return JSON.parse(text)
    } catch (_e) {
      const start = text.indexOf('{')
      const end = text.lastIndexOf('}')
      if (start >= 0 && end > start) {
        const fixed = text.slice(start, end + 1)
        try {
          return JSON.parse(fixed)
        } catch (_e2) {}
      }
     // eslint-disable-next-line no-console
     console.error('Invalid JSON from Gemini REST (after retry):', text)
     if (process.env.OPENAI) {
       try {
         const { default: OpenAI } = await import('openai')
         const client = new OpenAI({ apiKey: process.env.OPENAI })
         const resp = await client.chat.completions.create({
           model: 'gpt-3.5-turbo',
           messages: [{ role: 'user', content: `${INSTRUCTION}\n\nCV TEXT:\n${cvText}` }],
           max_tokens: 1024,
           temperature: 0.2,
         })
         let oaiText = ''
         if (resp && resp.choices && resp.choices[0] && resp.choices[0].message) {
           oaiText = String(resp.choices[0].message.content || '').trim()
         }
         if (oaiText) {
           try {
             return JSON.parse(oaiText)
           } catch (_e) {
             const s = oaiText.indexOf('{')
             const e = oaiText.lastIndexOf('}')
             if (s >= 0 && e > s) {
               const fixed = oaiText.slice(s, e + 1)
               try { return JSON.parse(fixed) } catch (_e2) {}
             }
           }
         }
       } catch (_) {}
     }
     return null
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Gemini 2.5 REST attempt failed:', e && e.message)
    
    // Try OpenAI as fallback if available
    if (process.env.OPENAI) {
      try {
        // eslint-disable-next-line no-console
        console.log('Attempting OpenAI fallback...')
        const { default: OpenAI } = await import('openai')
        const client = new OpenAI({ apiKey: process.env.OPENAI })

        const resp = await client.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `${INSTRUCTION}\n\nCV TEXT:\n${cvText}` }],
          max_tokens: 1024,
          temperature: 0.2,
        })

        let text = ''
        if (resp && resp.choices && resp.choices[0] && resp.choices[0].message) {
          text = String(resp.choices[0].message.content || '').trim()
        }

        if (!text) return null

        try {
          return JSON.parse(text)
        } catch (_e) {
          const start = text.indexOf('{')
          const end = text.lastIndexOf('}')
          if (start >= 0 && end > start) {
            const fixed = text.slice(start, end + 1)
            try {
              return JSON.parse(fixed)
            } catch (_e2) {}
          }
          // eslint-disable-next-line no-console
          console.error('Invalid JSON from OpenAI fallback:', text)
        }
      } catch (oaiErr) {
        // eslint-disable-next-line no-console
        console.warn('OpenAI fallback also failed:', oaiErr && oaiErr.message)
      }
    }
    return null
  }
}

module.exports = { extractCvData }


