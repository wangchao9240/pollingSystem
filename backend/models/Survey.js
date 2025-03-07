const mongoose = require("mongoose")
const { create } = require("./User")

const surveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      type: { type: String, required: true },
      options: [
        {
          optionKey: { type: String, required: true },
          optionValue: { type: String, required: true },
        },
      ],
      correctAnswer: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      modifyAt: { type: Date, default: Date.now },
    },
  ],
})

surveySchema.pre("save", async function (next) {
  this.questions.forEach((question) => {
    if (!question.createdAt) question.createdAt = new Date()
    question.modifyAt = new Date()
  })
  next()
})

module.exports = mongoose.model("Survey", surveySchema)