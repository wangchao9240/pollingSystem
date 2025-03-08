const mongoose = require("mongoose")
const { create } = require("./User")

const surveySchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, required: true },
  options: [
    {
      optionKey: { type: String, required: true },
      optionValue: { type: String, required: true },
    },
  ],
  correctAnswer: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
  modifyAt: { type: Date, default: Date.now },
})

surveySchema.pre("save", async function (next) {
  if (!this.createdAt) this.createdAt = new Date()
  this.modifyAt = new Date()
  next()
})

module.exports = mongoose.model("Survey", surveySchema)
