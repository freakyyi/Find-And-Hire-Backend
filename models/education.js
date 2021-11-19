
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const date = require('./date')

const educationSchema = new Schema({
  institution: {
    type: String,
  },
  degree: {
    type: String,
  },
  
  startDate: {
    type: String,
  },
  endDate: {
    type: String,
  }
})

module.exports = mongoose.model('Education', educationSchema)
