const path = require('path')
const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const postRoutes = require('./routes/posts')
const app = express()

mongoose.connect('mongodb+srv://Victor666:Aranda666@web.uwwogsg.mongodb.net/node-angulars?retryWrites=true&w=majority')
.then(() => {
  console.log('Base de datos conectada :)')
})
.catch(() => {
  console.log('Conexion Fallida :(')
})

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false}))
app.use("/image", express.static(path.join("backend/images")))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT')
  next()
})

app.use('/api.posts', postRoutes)

module.exports = app
