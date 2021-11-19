const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workHistory = require('./workHistory')
const education = require('./education')

const CVSchema = new Schema({
    seeker : {
        type : Schema.Types.ObjectId,
        ref : 'Seeker',
        required : true
    },
    experience : {
        type : String,
        required : true
    },
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },

    profession : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    state : {
        type : String,
        required : true
    },
    zipcode : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },

    workHistory : {
        type : [workHistory.schema],
        required : true
    },
    
    education : {
        type : [education.schema],
        required : true
    },
    skills : {
        type : [],
        required : true
    },
    summary : {
        type : String,
        required : true
    }
    

},
{
  timestamps: true,
})

module.exports = mongoose.model("CV",CVSchema);