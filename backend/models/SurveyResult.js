const mongoose = require("mongoose")

const surveyResultSchema = new mongoose.Schema({
  surveyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Survey', 
    required: true 
  },
  questionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Question',
    required: true 
  },
  chooseAnswer: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
  modifyAt: { type: Date, default: Date.now },
})

surveyResultSchema.pre("save", async function (next) {
  if (!this.createdAt) this.createdAt = new Date()
  this.modifyAt = new Date()
  next()
})

module.exports = mongoose.model("SurveyResult", surveyResultSchema)
