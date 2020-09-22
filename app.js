const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const fs = require('fs')
const key = fs.readFileSync('selfsigned.key', 'utf8')
const cert = fs.readFileSync('selfsigned.crt', 'utf8')
const option = { key, cert }
const app = express()
const https = require('https').createServer(option, app)
const io = require('socket.io')(https)

const route = require('./router')

app.use(cors())
app.use(express.static('public'))

process.env !== 'production'
  ? dotenv.config()
  : null

app.use(route)


const { hostname } = process.env
const { port } = process.env

https.listen(port, hostname, () => console.log(`Server is running on https://${hostname}:${port}`))