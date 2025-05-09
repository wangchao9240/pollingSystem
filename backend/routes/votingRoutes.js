const express = require("express");
const router = express.Router();
const votingController = require("../controllers/votingController");

/**
 * Get survey data for voting
 * @route GET /api/voting/survey/:id
 */
router.get("/survey/:id", votingController.getSurveyForVoting);

/**
 * Submit voting answers
 * @route POST /api/voting/submit
 */
router.post("/submit", votingController.submitVoting);

/**
 * Check if user has already completed a specific survey
 * @route GET /api/voting/status/:id
 */
router.get("/status/:id", votingController.checkVotingStatus);

/**
 * Get results for a survey
 * @route GET /api/voting/results/:id
 */
router.get("/results/:id", votingController.getSurveyResults);

module.exports = router;