const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

const router = express.Router()

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' })
    const user = await User.findOne({ email }).lean()
    if (!user) return res.status(401).json({ error: 'invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'invalid credentials' })
    return res.json({ id: user._id.toString(), email: user.email })
  } catch (err) {
    return next(err)
  }
})

module.exports = router


