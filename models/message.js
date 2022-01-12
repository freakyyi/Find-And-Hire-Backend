const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    messages: {
        Name: { type: String },
        email: { type: String },
        subject: { type: String },
        message: { type: String },
    },
});
module.exports = mongoose.model("Messages", messageSchema);