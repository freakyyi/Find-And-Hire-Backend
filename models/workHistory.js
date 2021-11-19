const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workHistorySchema = new Schema({
 
   jobTitle : {
    type : String,
   },

   employer : {
    type : String,
   },
   cityW : {
    type : String,
   },
   stateW : {
    type : String,
   },
   startDateW : {
    type : String
   },
   endDateW : {
    type : String,
   },
})

module.exports = mongoose.model("workHistory",workHistorySchema)