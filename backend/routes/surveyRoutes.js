const express = require("express")
const {
  addOrUpdateSurvey,
  querySurvey,
  deleteSurveyItemById,
  querySurveyItemById,
  completeSurvey,
  querySurveyResultByQuestionId,
  getSurveyStats, // Import new function to get survey statistics
} = require("../controllers/surveyController")
const { protect } = require("../middleware/authMiddleware")
const router = express.Router()

// Route to add or update a survey
router.post("/addOrUpdateSurvey", protect, addOrUpdateSurvey)
router.get("/surveyList", protect, querySurvey)
router.post("/deleteSurvey", protect, deleteSurveyItemById)
router.get("/querySurveyResultByQuestionId/:id", protect, querySurveyResultByQuestionId)
router.get("/stats", protect, getSurveyStats); // Add the new survey stats route
router.get("/querySurveyItem/:id", querySurveyItemById)
router.post("/completeSurvey", completeSurvey)

module.exports = router
