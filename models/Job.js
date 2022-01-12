const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const address = require("./address");
// const recruiter = require('./recruiter.model')
const payment = ["basic", "standard", "premium", "none"];

const jobSchema = new Schema({
    recruiter: {
        type: Schema.Types.ObjectId,
        ref: "Recruiter",
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    selectedLocation: {
        type: String,
        required: true,
    },

    jobPrimer: {
        type: String,
        required: true,
    },
    selectedHires: {
        type: String,
        required: true,
    },
    contractType: {
        type: String,
        required: true,
    },
    upperSalary: {
        type: String,
        required: true,
    },
    lowerSalary: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        required: true,
    },
    featured: {
        type: String,
    },
    package: { type: String, default: "none" },
    // flag: { type: Number, default: 0 },
    flagged: {
        userId: { type: String },
        flag: { type: Number, default: 0 },
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Job", jobSchema);