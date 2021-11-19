const mongoose = require("mongoose");

const roles = ["recruiter", "seeker","admin"];
// const CV = ["hasCV","NoCV"]
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    max : 255,
    min : 5
  },
  lastname: {
    type: String,
    required: true,
    max: 255,
    min : 3
  },

  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },

  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  
  role: {
    type: String,
    default: "seeker",
    enum: roles,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
