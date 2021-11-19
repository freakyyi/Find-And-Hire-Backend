
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const addressSchema = new Schema({
  street: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  country: {
    type: String
  },
  zipcode: {
    type: String
  }
  
})

module.exports = mongoose.model('Address', addressSchema)
