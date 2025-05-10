/**
 * Question Validation Strategy Pattern
 * A lightweight implementation of the Strategy Pattern for question validation
 */

/**
 * Validation strategies for different question types
 */
const validationStrategies = {
  /**
   * Single choice validation strategy
   * @param {Array} chooseAnswer - User's selected answers
   * @returns {boolean} - Whether the answer is valid
   */
  single: function(chooseAnswer) {
    return Array.isArray(chooseAnswer) && chooseAnswer.length === 1;
  },
  
  /**
   * Multiple choice validation strategy
   * @param {Array} chooseAnswer - User's selected answers
   * @returns {boolean} - Whether the answer is valid
   */
  multiple: function(chooseAnswer) {
    return Array.isArray(chooseAnswer) && chooseAnswer.length >= 2;
  }
};

/**
 * Error messages for different question types
 */
const errorMessages = {
  single: "Single choice questions require exactly one selection",
  multiple: "Multiple choice questions require at least two selections",
  default: "Invalid answer format"
};

/**
 * Validate an answer based on question type
 * @param {string} questionType - Type of question ('single', 'multiple')
 * @param {Array} chooseAnswer - The answer to validate
 * @returns {boolean} - Whether the answer is valid
 */
function validateAnswer(questionType, chooseAnswer) {
  // Get the appropriate validation strategy or use a default
  const validationStrategy = validationStrategies[questionType] || 
    function(answer) { return Array.isArray(answer) && answer.length > 0; };
  
  // Execute the strategy
  return validationStrategy(chooseAnswer);
}

/**
 * Get error message for invalid answer
 * @param {string} questionType - Type of question ('single', 'multiple')
 * @returns {string} - Error message
 */
function getErrorMessage(questionType) {
  return errorMessages[questionType] || errorMessages.default;
}

module.exports = {
  validateAnswer,
  getErrorMessage
};