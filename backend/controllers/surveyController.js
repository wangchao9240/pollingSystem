const Survey = require("../models/Survey")
const SurveyResult = require("../models/SurveyResult")
const Question = require("../models/Question");

const querySurveyItemById = async (req, res) => {
  try {
    const { id } = req.params
    const survey = await Survey.findById(id)
    if (!survey) {
      return res.json({ code: 404, data: null, message: "Survey not found" })
    } else {
      res.json({
        code: 200,
        data: survey,
        message: "Survey fetched successfully",
      })
    }
  } catch (error) {
    res.json({ code: 500, data: null, message: error.message })
  }
}

const querySurvey = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, title, status, date } = req.query
    const skip = (page - 1) * pageSize
    
    // Build query conditions
    const queryCondition = {}
    
    // If there's a title filter condition, add fuzzy query
    if (title) {
      queryCondition.title = { $regex: title, $options: 'i' } // Case insensitive
    }
    
    // If there's a status filter condition
    if (status !== undefined && status !== '') {
      queryCondition.surveyStatus = parseInt(status)
    }
    
    // If there's a date filter condition
    if (date) {
      // Convert date string to Date object, and set to the beginning of the day
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      
      // End of the day
      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)
      
      // Query data modified on that day
      queryCondition.modifyAt = { 
        $gte: startDate, 
        $lte: endDate
      }
    }
    
    // Query and sort by modification time in descending order
    const surveys = await Survey.find(queryCondition)
      .sort({ modifyAt: -1 }) // -1 means descending order
      .skip(skip)
      .limit(parseInt(pageSize))
      .populate({
        path: "questions"
      })
    
    // Get the total count that meets the conditions
    const total = await Survey.countDocuments(queryCondition)

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
    
    // First find the survey to get its question IDs
    const survey = await Survey.findById(_id)
    if (!survey) {
      return res.json({ code: 404, data: null, message: "Survey not found" })
    }
    
    // Delete all associated questions
    if (survey.questions && survey.questions.length > 0) {
      await Question.deleteMany({ _id: { $in: survey.questions } })
    }
    
    // Delete the survey itself
    await Survey.findByIdAndDelete(_id)

    res.json({ 
      code: 200, 
      data: survey, 
      message: "Survey and its associated questions have been deleted" 
    })
  } catch (error) {
    res.json({ code: 500, data: null, message: error.message })
  }
}

const addOrUpdateSurvey = async (req, res) => {
  try {
    const { _id, title, questions, surveyStatus } = req.body
    // Validate the request body
    if (
      !title ||
      !(questions && questions.length) ||
      surveyStatus === undefined
    ) {
      return res.json({ code: 400, data: null, message: "Invalid survey data" })
    }
    // Validate each question
    for (const question of questions) {
      const { question: questionText, type, options } = question
      if (!questionText || !type || !(options && options.length)) {
        return res.json({
          code: 400,
          data: null,
          message: "Invalid question data",
        })
      }
      // Validate each option within the question
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
    }
    
    const questionIds = [];
    
    // Create or update Question entities for each question
    for (const questionData of questions) {
      let questionEntity;
      if (questionData._id) {
        // Update existing question if it has an ID
        questionEntity = await Question.findByIdAndUpdate(
          questionData._id,
          questionData,
          { new: true }
        );
      } else {
        // Create new question entity
        questionEntity = new Question(questionData);
        await questionEntity.save();
      }
      questionIds.push(questionEntity._id);
    }

    let survey
    if (_id) {
      // Update existing survey with question IDs
      survey = await Survey.findByIdAndUpdate(
        _id,
        { 
          title, 
          questions: questionIds, 
          surveyStatus, 
          modifyAt: new Date() 
        },
        { new: true }
      )
      if (!survey) {
        return res.json({ code: 404, data: null, message: "Survey not found" })
      }
    } else {
      // Create a new survey with question IDs
      survey = new Survey({ 
        title, 
        questions: questionIds, 
        surveyStatus,
        completeCount: 0 
      })
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

const completeSurvey = async (req, res) => {
  try {
    const { id, chooseAnswer } = req.body
    const surverResult = new SurveyResult({ questionId: id, chooseAnswer })
    await surverResult.save()
    res.json({ code: 200, data: surverResult, message: "Survey completed" })
  } catch (error) {
    res.json({ code: 500, data: null, message: error.message })
  }
}

const querySurveyResultByQuestionId = async (req, res) => {
  try {
    const { id } = req.params
    const survey = await Survey.findById(id)
    if (!survey) {
      return res.json({ code: 404, data: null, message: "Survey not found" })
    }
    const surveyResults = await SurveyResult.find({ questionId: id })
    const resultCount = surveyResults.reduce((acc, result) => {
      result.chooseAnswer.forEach((answer) => {
        acc[answer] = (acc[answer] || 0) + 1
      })
      return acc
    }, {})

    const formattedResults = Object.keys(resultCount).map((key) => ({
      name: key,
      value: resultCount[key],
    }))

    res.json({
      code: 200,
      data: formattedResults,
      message: "Survey results fetched successfully",
    })
  } catch (error) {
    res.json({ code: 500, data: null, message: error.message })
  }
}

// Function to get survey statistics: retrieve number of total surveys, active surveys, and total responses
const getSurveyStats = async (req, res) => {
  try {
    const totalSurveys = await Survey.countDocuments();
    const activeSurveys = await Survey.countDocuments({ surveyStatus: 1 });
    const totalResponses = await SurveyResult.countDocuments(); 

    res.json({
      code: 200,
      data: {
        totalSurveys,
        activeSurveys,
        totalResponses,
      },
      message: "Stats fetched successfully",
    });
  } catch (error) {
    res.json({ code: 500, data: null, message: error.message });
  }
};

module.exports = {
  querySurveyItemById,
  querySurvey,
  deleteSurveyItemById,
  addOrUpdateSurvey,
  completeSurvey,
  querySurveyResultByQuestionId,
  getSurveyStats,
}
