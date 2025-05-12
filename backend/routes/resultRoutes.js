const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController")

router.get("/surveys/:surveyId/question/:questionId/results", resultController.getSurveyResultsByQuestion);
router.get("/surveys/:id", resultController.getCompleteSurveyById);



module.exports = router;