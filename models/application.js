'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const statuses =  ['pending','rejected','accepted']

const applicationSchema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  seekerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recruiterId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cvId : {
    type : Schema.Types.ObjectId,
    ref : 'CV',
    required :true
  },
  status : {
    type: String,
    default: "pending",
    enum: statuses,
  }

}, {
  timestamps: true
})


module.exports = mongoose.model('Application', applicationSchema)
