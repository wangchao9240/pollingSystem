const Survey = require("../models/Survey")

const querySurver = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query
    const skip = (page - 1) * pageSize
    const surveys = await Survey.find().skip(skip).limit(parseInt(pageSize))
    const total = await Survey.countDocuments()

    res.json({
      code: 200,
      data: {
        surveyList: surveys,
        total,
      },
      message: "Surveys fetched successfully",
    })
  } catch (error) {
    res.json({ code: 500, data: null, message: error.message })
  }
}

const deleteSurveyItemById = async (req, res) => {
  try {
    const { _id } = req.body
    const survey = await Survey.findByIdAndDelete(_id)
    if (!survey) {
      return res.json({ code: 404, data: null, message: "Survey not found" })
    }

    res.json({ code: 200, data: survey, message: "Survey has been deleted" })
  } catch (error) {
    res.json({ code: 500, data: null, message: error.message })
  }
}

const addOrUpdateSurvey = async (req, res) => {
  try {
    const { _id, question, type, options, correctAnswer } = req.body

    // Validate the request body
    if (
      !question ||
      !type ||
      !options ||
      !Array.isArray(options) ||
      !Array.isArray(correctAnswer)
    ) {
      return res.json({ code: 400, data: null, message: "Invalid survey data" })
    }

    // Validate each option
    for (const option of options) {
      const { optionKey, optionValue } = option
      if (!optionKey || !optionValue) {
        return res.json({
          code: 400,
          data: null,
          message: "Invalid option data",
        })
      }
    }

    let survey
    if (_id) {
      // Update existing survey
      survey = await Survey.findByIdAndUpdate(
        _id,
        { question, type, options, correctAnswer, modifyAt: new Date() },
        { new: true }
      )
      if (!survey) {
        return res.json({ code: 404, data: null, message: "Survey not found" })
      }
    } else {
      // Create a new survey
      survey = new Survey({ question, type, options, correctAnswer })
      await survey.save()
    }

    res.json({
      code: 200,
      data: survey,
      message: _id ? "Survey has been updated" : "New survey has been created",
    })
  } catch (error) {
    res.json({ code: 500, data: null, message: error.message })
  }
}

module.exports = {
  querySurver,
  deleteSurveyItemById,
  addOrUpdateSurvey,
}
