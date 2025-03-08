const express = require('express');
const { addOrUpdateSurvey, querySurver, deleteSurveyItemById } = require("../controllers/surveyController");
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to add or update a survey
router.post("/addOrUpdateSurvey", protect, addOrUpdateSurvey);
router.get("/surveyList", protect, querySurver);
router.post("/deleteSurvey", protect, deleteSurveyItemById);

module.exports = router;