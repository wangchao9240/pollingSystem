const mongoose = require("mongoose")

const surveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Question' 
  }],
  completeCount: { type: Number, default: 0 },
  surveyStatus: { type: Number, default: 0 }, // 0: inactive, 1: active
  createdAt: { type: Date, default: Date.now },
  modifyAt: { type: Date, default: Date.now },
})

surveySchema.pre("save", async function (next) {
  if (!this.createdAt) this.createdAt = new Date()
  this.modifyAt = new Date()
  next()
})

module.exports = mongoose.model("Survey", surveySchema)
