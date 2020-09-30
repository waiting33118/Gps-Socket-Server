const dotenv = require('dotenv')
const express = require('express')
const app = express()
// const cors = require('cors')
const fs = require('fs')
const key = fs.readFileSync('selfsigned.key', 'utf8')
const cert = fs.readFileSync('selfsigned.crt', 'utf8')
const option = { key, cert }
const https = require('https').createServer(option, app)
const hdbs = require('express-handlebars')

const useSocketIO = require('./config/socketIO')
const route = require('./router')

if (process.env !== 'production') dotenv.config()
const { hostname, port } = process.env

app.engine('handlebars', hdbs())
app.set('view engine', 'handlebars')
useSocketIO(https)
app.use(route)
// app.use(cors())

https.listen(port, hostname, () => console.log(`Server is running on https://${hostname}:${port}`))
