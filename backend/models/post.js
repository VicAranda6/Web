const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  nombre: {type: String, required: true},
  apellido: {type: String, required: true},
  fecha: {type: String, required: true},
  address: {type: String, required: true},
  number: {type: String, required: true},
  area: {type: String, required: true},
  nivel: {type: String, required: true},
  social: {type: String, required: true},
  estado: {type: String, required: true},
  imagePath: {type: String, required: true}
})

module.exports = mongoose.model('Post', postSchema)
