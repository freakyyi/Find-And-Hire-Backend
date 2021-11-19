const mongoose = require("mongoose");
const address = require("./address");
const Schema = mongoose.Schema;
const experience = require("./experience");
const education = require("./education");

const seekerSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    address: {
      type: address.schema,
    },
    // experience: {
    //   type: [experience.schema],
    // },
    // education: {
    //   type: [education.schema],
    // },
    skills: {
      type: [String],
    },
    phone_number: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Seeker", seekerSchema);
