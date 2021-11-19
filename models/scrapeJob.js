

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const scrapeJobSchema = new Schema({

  jobTitle: {
    type: String,
  },
  companyName: {
    type: String,
  },
  summary: {
    type: String,
  },
  linkToJob : {
      type: String
  },

  location : {
      type : String
  },
  salary : {
      type : String
  },

  date : {
    type : String
  },
    
}, {
  timestamps: true
})




module.exports = mongoose.model('scrapeJob',scrapeJobSchema);