const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    seekerId: {
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
        Answer: { type: String },
    }, ],
});
module.exports = mongoose.model("Answer", answerSchema);