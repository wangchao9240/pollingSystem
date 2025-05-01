const Survey = require("../models/Survey");
const Question = require("../models/Question");
const SurveyResult = require("../models/SurveyResult");

/**
 * Get survey details for voting page
 * @param {Object} req - Request object containing survey ID
 * @param {Object} res - Response object
 */
const getSurveyForVoting = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find survey
    const survey = await Survey.findById(id);
    
    // Check if survey exists
    if (!survey) {
      return res.json({ 
        code: 404, 
        data: null, 
        message: "Survey not found" 
      });
    }
    
    // Check if survey is active
    if (survey.surveyStatus !== 1) {
      return res.json({ 
        code: 400, 
        data: null, 
        message: "This survey is currently unavailable" 
      });
    }
    
    // Get all questions related to this survey
    const questions = await Question.find({
      _id: { $in: survey.questions }
    });
    
    res.json({
      code: 200,
      data: {
        survey,
        questions
      },
      message: "Survey retrieved successfully"
    });
  } catch (error) {
    res.json({ 
      code: 500, 
      data: null, 
      message: `Server error: ${error.message}` 
    });
  }
};

/**
 * Submit voting answers
 * @param {Object} req - Request object containing survey ID and selected answers
 * @param {Object} res - Response object
 */
const submitVoting = async (req, res) => {
  try {
    const { id, answers } = req.body;
    
    // Validate request data
    if (!id || !answers || !Array.isArray(answers) || answers.length === 0) {
      return res.json({ 
        code: 400, 
        data: null, 
        message: "Invalid submission data format" 
      });
    }
    
    // Check if survey exists and is active
    const survey = await Survey.findById(id);
    if (!survey) {
      return res.json({ 
        code: 404, 
        data: null, 
        message: "Survey not found" 
      });
    }
    
    if (survey.surveyStatus !== 1) {
      return res.json({ 
        code: 400, 
        data: null, 
        message: "This survey is currently unavailable" 
      });
    }
    
    // Save answers for each question
    const savedResults = [];
    for (const answer of answers) {
      const { questionId, chooseAnswer } = answer;
      
      // Validate answer format
      if (!questionId || !chooseAnswer || !Array.isArray(chooseAnswer)) {
        continue;
      }
      
      // Find question to validate its type and answer
      const question = await Question.findById(questionId);
      if (!question) {
        continue;
      }
      
      // Validate multiple choice questions have at least two selections
      if (question.type === 'multiple' && chooseAnswer.length < 2) {
        return res.json({
          code: 400,
          data: null,
          message: "Multiple choice questions require at least two selections"
        });
      }
      
      // Save result - Using existing SurveyResult schema
      // Note: In your model, questionId references the Survey model, not Question
      const result = new SurveyResult({
        questionId: id, // Using survey ID as questionId to match your schema
        chooseAnswer
      });
      
      await result.save();
      savedResults.push(result);
    }
    
    // Update survey completion count
    await Survey.findByIdAndUpdate(id, {
      $inc: { completeCount: 1 }
    });
    
    res.json({
      code: 200,
      data: {
        surveyId: id,
        resultsCount: savedResults.length
      },
      message: "Survey submitted successfully"
    });
    
  } catch (error) {
    res.json({ 
      code: 500, 
      data: null, 
      message: `Server error: ${error.message}` 
    });
  }
};

/**
 * Check if user has already completed a specific survey
 * Note: This implementation assumes client-side localStorage for tracking completed surveys
 * In a real project, you might need more sophisticated user tracking mechanisms
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const checkVotingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Here you could implement more complex logic to check if a user has voted
    // For example, if you have a user authentication system, you could check for user ID and survey ID combinations
    
    res.json({
      code: 200,
      data: {
        surveyId: id
      },
      message: "Please check local voting status using localStorage"
    });
  } catch (error) {
    res.json({ 
      code: 500, 
      data: null, 
      message: `Server error: ${error.message}` 
    });
  }
};

module.exports = {
  getSurveyForVoting,
  submitVoting,
  checkVotingStatus
};