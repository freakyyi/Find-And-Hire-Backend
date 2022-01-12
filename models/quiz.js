const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    recruiterId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    jobId: {
        type: Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    questions: [{
        Qs: { type: String },
        option1: { type: String },
        option2: { type: String },
        option3: { type: String },
        option4: { type: String },
    }, ],
});
module.exports = mongoose.model("Quiz", quizSchema);