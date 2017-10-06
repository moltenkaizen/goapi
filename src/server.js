const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const serveStatic = require('serve-static')
const path = require('path')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(morgan('combined'))
app.use(cors())

// move this to config.js
const port = process.env.PORT || 8081

// Serve album cover images
app.use(serveStatic(path.join(__dirname, '../media')))
// http://localhost:8081/images/4772779.jpg

require('./router/index')(app)

app.listen(port)
console.log('Magic happens on port ' + port)
