const express = require('express')
const cors = require('cors')
const serverless = require('serverless-http')
const path = require('path')
const app = express()

app.use('/assets', express.static(path.join(__dirname, '../assets')))
app.use(cors())

module.exports.handler = serverless(app)
