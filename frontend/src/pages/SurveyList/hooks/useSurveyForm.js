import { useEffect, useState, useCallback, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axiosInstance from "../../../axiosConfig";

export const useSurveyForm = (survey, handleClose, querySurveyList) => {
  // Add update marker reference
  const updateCounter = useRef(0);
  
  const {
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      surveyStatus: 0,
      questions: [],
    },
    mode: "onBlur",
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
    update: updateQuestion,
  } = useFieldArray({
    control,
    name: "questions",
    keyName: "fieldId",
  });

  // Monitor changes to ensure re-rendering
  const watchAllQuestions = watch("questions");
  
  // Track expanded/collapsed questions
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  
  // Add force update state
  const [, setForceUpdate] = useState(0);

  // Toggle question expand state
  const toggleQuestion = useCallback((index) => {
    setExpandedQuestion(prevExpanded => prevExpanded === index ? null : index);
  }, []);

  // Completely rewrite addOption function to ensure correct UI updates
  const addOption = useCallback((questionIndex) => {
    console.log("Adding option to question", questionIndex);
    try {
      // Get a snapshot of the entire form data
      const formValues = getValues();
      
      // Deep copy the questions array to prevent direct state modification
      const questions = JSON.parse(JSON.stringify(formValues.questions || []));
      
      // Ensure the question exists and has an options array
      if (!questions[questionIndex]) {
        console.error("Question index out of bounds");
        return;
      }
      
      // If there is no options array, create one
      if (!questions[questionIndex].options) {
        questions[questionIndex].options = [];
      }
      
      // Get current options
      const currentOptions = questions[questionIndex].options;
      
      // Create new option
      const newOption = {
        optionKey: String.fromCharCode(65 + currentOptions.length),
        optionValue: "",
      };
      
      // Add the new option to the question's options array
      currentOptions.push(newOption);
      
      // Update the entire question object
      updateQuestion(questionIndex, questions[questionIndex]);
      
      // Increment update counter
      updateCounter.current += 1;
      
      // Force component update
      setForceUpdate(prev => prev + 1);
      
      console.log("Option added successfully", questions[questionIndex].options);
    } catch (error) {
      console.error("Error adding option:", error);
    }
  }, [getValues, updateQuestion]);

  // Rewrite removeOption function
  const removeOption = useCallback((questionIndex, optionIndex) => {
    try {
      // Get the entire form data
      const formValues = getValues();
      
      // Deep copy the questions array
      const questions = JSON.parse(JSON.stringify(formValues.questions || []));
      
      // Get the options array
      const options = questions[questionIndex].options;
      
      // Delete the specified option
      options.splice(optionIndex, 1);
      
      // Regenerate option keys
      options.forEach((opt, idx) => {
        opt.optionKey = String.fromCharCode(65 + idx);
      });
      
      // Update the entire question object
      updateQuestion(questionIndex, questions[questionIndex]);
      
      // Increment update counter
      updateCounter.current += 1;
      
      // Force component update
      setForceUpdate(prev => prev + 1);
      
      console.log("Option removed successfully", options);
    } catch (error) {
      console.error("Error removing option:", error);
    }
  }, [getValues, updateQuestion]);

  // Add a new question
  const addNewQuestion = useCallback(() => {
    const newIndex = questionFields.length;
    appendQuestion({
      question: `Question${newIndex + 1}`,
      type: "Single",
      options: [],
    });

    // Expand the newly added question
    setTimeout(() => {
      setExpandedQuestion(newIndex);
    }, 100);
  }, [questionFields.length, appendQuestion]);

  // Validate form data
  const validateSurveyData = useCallback((data) => {
    // Check if title is empty
    if (!data.title || data.title.trim() === "") {
      window.$toast("Survey title is required", "info", 2000);
      return false;
    }

    // Check if there are questions
    if (!data.questions || data.questions.length === 0) {
      window.$toast("At least one question is required", "info", 2000);
      return false;
    }

    // Check each question
    for (let i = 0; i < data.questions.length; i++) {
      const q = data.questions[i];

      // Check question title
      if (!q.question || q.question.trim() === "") {
        window.$toast(`Question ${i + 1} requires a title`, "info", 2000);
        setExpandedQuestion(i);
        return false;
      }

      // Check if there are options
      if (!q.options || q.options.length === 0) {
        window.$toast(`Question ${i + 1} must have at least one option`, "info", 2000);
        setExpandedQuestion(i);
        return false;
      }

      // Check each option
      for (let j = 0; j < q.options.length; j++) {
        const opt = q.options[j];
        if (!opt.optionValue || opt.optionValue.trim() === "") {
          window.$toast(`Question ${i + 1} has an empty option (${opt.optionKey})`, "info", 2000);
          setExpandedQuestion(i);
          return false;
        }
      }
    }

    return true;
  }, []);

  // Submit form
  const onSubmit = useCallback(async (data) => {
    if (validateSurveyData(data) !== true) {
      return;
    }

    try {
      const { code, message } = await axiosInstance.post("/api/survey/addOrUpdateSurvey", data);
      
      if (code !== 200) {
        window.$toast(message, "info", 2000);
        return;
      }

      window.$toast("operate successfully.", "success", 2000);
      handleClose();
      querySurveyList();
    } catch (error) {
      window.$toast(`Server Error: ${error}`, "info", 2000);
    }
  }, [validateSurveyData, handleClose, querySurveyList]);

  // Save button click handler
  const handleSaveClick = useCallback(() => {
    handleSubmit(
      (data) => {
        onSubmit(data);
      },
      (errors) => {
        const fieldNames = Object.keys(errors);
        if (fieldNames.length > 0) {
          const firstFieldName = fieldNames[0];

          if (firstFieldName.startsWith("questions[")) {
            const matches = firstFieldName.match(/questions\[(\d+)\]/);
            if (matches && matches[1]) {
              const questionIndex = parseInt(matches[1]);
              setExpandedQuestion(questionIndex);
            }
          }

          window.$toast("Please fix the highlighted fields", "warning", 2000);
        }
      }
    )();
  }, [handleSubmit, onSubmit]);

  // Reset form
  useEffect(() => {
    if (survey) {
      reset(survey);
      if (survey.questions && survey.questions.length > 0) {
        setExpandedQuestion(null);
      }
    }
  }, [survey, reset]);

  // Return update counter to ensure child components can detect changes
  return {
    control,
    errors,
    questionFields,
    watchAllQuestions,
    expandedQuestion,
    toggleQuestion,
    removeQuestion,
    addNewQuestion,
    addOption,
    removeOption,
    handleSaveClick,
    watch,
    updateCounter: updateCounter.current,
  };
};