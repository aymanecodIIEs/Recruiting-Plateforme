const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const ENV = require('./config/env')
const { errorHandler } = require('./middlewares/errorHandler')
const cvRoutes = require('./routes/cv')

const app = express()

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use(morgan(ENV.LOG_LEVEL))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/cv', cvRoutes)

app.use(errorHandler)

app.listen(ENV.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[backend] listening on http://localhost:${ENV.PORT}`)
})


