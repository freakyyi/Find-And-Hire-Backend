const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const packages = ["Basic", "Standard", "Premium"];

const paymentSchema = new Schema({
    package: {
        type: String,
        enum: packages,
    },
});

module.exports = mongoose.model("Payment", paymentSchema);