const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, required: true },
  options: [
    {
      optionKey: { type: String, required: true },
      optionValue: { type: String, required: true },
    },
  ],
})

module.exports = mongoose.model("Question", questionSchema)
