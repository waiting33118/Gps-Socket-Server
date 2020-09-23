const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const key = fs.readFileSync('selfsigned.key', 'utf8')
const cert = fs.readFileSync('selfsigned.crt', 'utf8')
const option = { key, cert }
const app = express()
const https = require('https').createServer(option, app)
const useSocketIO = require('./config/socketIO')

if (process.env !== 'production') dotenv.config()
const { hostname, port } = process.env

app.use(cors())
useSocketIO(https)

https.listen(port, hostname, () => console.log(`Server is running on https://${hostname}:${port}`))
