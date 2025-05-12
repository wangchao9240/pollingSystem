const Survey = require("../models/Survey")
const SurveyResult = require("../models/SurveyResult")
const Question = require("../models/Question");

const queryResult = async (req, res) => {
    const { id } = req.params
    if (id) {
        res.json({
            code: 200,
            data: { id: id, name: `Item ${id}`, description: `Description for item ${id}` },
            message: "Item retrieved successfully"
        });
    } else {
        res.status(400).json({
            code: 400,
            data: null,
            message: "Invalid ID"
        });
    }
}


// Controller function to get survey results by Survey ID and Question ID
getSurveyResultsByQuestion = async (req, res) => {
    const { surveyId, questionId } = req.params;

    try {
        console.log("Survey ID:", surveyId);
        console.log("Question ID:", questionId);

        // Query all results for the specific survey and question
        const results = await SurveyResult.find({ surveyId: surveyId, questionId: questionId });
        console.log("All Survey Results for this Question:", results);

        if (!results.length) {
            return res.json({
                code: 200,
                data: [],
                message: "No results found for this question in this survey."
            });
        }

        res.json({
            code: 200,
            data: results,
            message: "Survey results for this question retrieved successfully"
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            code: 500,
            data: null,
            message: "Server error"
        });
    }
};

getCompleteSurveyById = async (req, res) => {
    const { id } = req.params;

    try {
        // Query the survey by ID and populate its questions
        const survey = await Survey.findById(id).populate('questions');
        console.log("Complete Survey Data:", survey);

        if (!survey) {
            return res.json({
                code: 404,
                data: null,
                message: "Survey not found"
            });
        }

        res.json({
            code: 200,
            data: survey,
            message: "Complete survey data retrieved successfully"
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            code: 500,
            data: null,
            message: "Server error"
        });
    }
};
module.exports = {
    queryResult,
    getCompleteSurveyById,
    getSurveyResultsByQuestion
}
