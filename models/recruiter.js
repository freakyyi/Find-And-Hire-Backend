
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const address = require('./address')


const recruiterSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  

  address: {
    type: address.schema
  },
  phone_number: {
    type: String
  },
  headline: {
    type: String
  },
  company: {
    type: String
  }
 
}, {
  timestamps: true
})


module.exports = mongoose.model("Recruiter", recruiterSchema);
