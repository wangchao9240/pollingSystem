import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  DialogTitle,
  FormHelperText,
  InputLabel,
  Button,
  Typography,
  Divider,
  IconButton,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axiosInstance from "../../axiosConfig";
import QuestionBlock from "./QuestionBlock";

/**
 * Survey Dialog Modal Component
 * 
 * @param {Boolean} open - Controls dialog visibility
 * @param {Function} handleClose - Function to close the dialog
 * @param {Object} survey - Survey data for editing (empty for new surveys)
 * @param {Function} querySurveyList - Function to refresh survey list after save
 */
const DialogModal = ({ open, handleClose, survey, querySurveyList }) => {
  // Initialize form with react-hook-form
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      title: "",
      surveyStatus: 0,
      questions: []
    }
  });

  // Field array for managing questions
  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: "questions",
    // This is critical to preserve fields when removing items
    keyName: "fieldId" 
  });

  // Watch questions to display dynamic titles - using this approach for real-time updates
  const watchAllQuestions = watch("questions");
  
  // Manage expanded state for accordion items
  const [expandedPanels, setExpandedPanels] = useState({});
  
  // Handle accordion expansion change
  const handleAccordionChange = (index) => (_, isExpanded) => {
    setExpandedPanels({
      ...expandedPanels,
      [index]: isExpanded
    });
  };

  /**
   * Handle form submission
   */
  const onSubmit = async (data) => {
    // Form validation
    if (validateSurveyData(data) !== true) {
      return;
    }
    console.log("Form Data:", data);
    try {
      // Submit data to API
      const { code, message } = await axiosInstance.post(
        "/api/survey/addOrUpdateSurvey",
        data
      );
      
      if (code !== 200) {
        window.$toast(message, "info", 2000);
        return;
      }
      
      // Success handling
      window.$toast("operate successfully.", "success", 2000);
      handleClose();
      querySurveyList();
    } catch (error) {
      window.$toast(`Server Error: ${error}`, "info", 2000);
    }
  };
  
  /**
   * Validate survey data before submission
   */
  const validateSurveyData = (data) => {
    // Check if survey has questions
    if (!data.questions || data.questions.length === 0) {
      window.$toast("At least one question is required", "info", 2000);
      return false;
    }

    // Check if all questions have options
    const invalidQuestion = data.questions.findIndex(q => !q.options || q.options.length === 0);
    if (invalidQuestion >= 0) {
      window.$toast(`Question ${invalidQuestion + 1} must have at least one option`, "info", 2000);
      return false;
    }
    
    return true;
  };

  /**
   * Reset form when survey data changes and set all accordions to expanded
   */
  useEffect(() => {
    if (survey) {
      reset(survey);
      
      // Set all accordion panels to expanded initially
      const initialExpandedState = {};
      if (survey.questions && survey.questions.length > 0) {
        survey.questions.forEach((_, index) => {
          initialExpandedState[index] = true;
        });
      }
      setExpandedPanels(initialExpandedState);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [survey, reset, open]);

  /**
   * Add a new question to the survey
   */
  const addNewQuestion = () => {
    const newIndex = questionFields.length;
    appendQuestion({
      question: `Question ${newIndex + 1}`,
      type: "Single",
      options: []
    });
    
    // Auto-expand the newly added question
    setExpandedPanels({
      ...expandedPanels,
      [newIndex]: true
    });
  };
  
  /**
   * Handle removing a question without triggering accordion click
   */
  const handleRemoveQuestion = (index, event) => {
    // Prevent the accordion from toggling
    event.stopPropagation();
    removeQuestion(index);
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
      <DialogTitle>
        {survey && survey._id ? "Edit" : "Create"} Survey
      </DialogTitle>
      
      <DialogContent>
        {/* Survey Title Field */}
        <Controller
          name="title"
          control={control}
          rules={{ required: "Survey Title is required" }}
          render={({ field, fieldState: { error } }) => (
            <>
              <InputLabel variant="standard">
                Survey Title
              </InputLabel>
              <TextField
                {...field}
                value={field.value || ""}
                margin="dense"
                type="text"
                fullWidth
                error={!!error}
              />
              <FormHelperText error={!!error}>
                {error ? error.message : null}
              </FormHelperText>
            </>
          )}
        />

        {/* Survey Status Field */}
        <Box sx={{ mt: 2 }}>
          <Controller
            name="surveyStatus"
            control={control}
            render={({ field }) => (
              <FormControl component="fieldset">
                <FormLabel component="legend">Survey Status</FormLabel>
                <RadioGroup
                  row
                  value={field.value !== undefined ? field.value.toString() : "0"}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                >
                  <FormControlLabel 
                    value="0" 
                    control={<Radio />} 
                    label="Inactive" 
                  />
                  <FormControlLabel 
                    value="1" 
                    control={<Radio />} 
                    label="Active" 
                  />
                </RadioGroup>
              </FormControl>
            )}
          />
        </Box>

        {/* Questions Section */}
        <Box sx={{ mt: 3, mb: 1 }}>
          <Typography variant="h6">Questions</Typography>
          <Divider />
        </Box>

        {/* Question List with Accordions */}
        {questionFields.map((field, index) => (
          <Accordion 
            key={field.fieldId}
            expanded={!!expandedPanels[index]}
            onChange={handleAccordionChange(index)}
            sx={{ 
              mt: 2,
              '&:before': {
                display: 'none',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                minHeight: '48px',
                '&.Mui-expanded': {
                  minHeight: '48px',
                },
              }}
            >
              <Typography sx={{ flex: 1 }}>
                {watchAllQuestions[index]?.question || `Question ${index + 1}`}
              </Typography>
              <IconButton 
                size="small"
                color="error"
                onClick={(e) => handleRemoveQuestion(index, e)}
                sx={{ ml: 1 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </AccordionSummary>
            
            <AccordionDetails sx={{ pt: 2 }}>
              {/* Question Form Fields */}
              <QuestionBlock 
                control={control} 
                setValue={setValue} 
                watch={watch}
                questionIndex={index} 
              />
            </AccordionDetails>
          </Accordion>
        ))}

        {/* Add Question Button */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="outlined" 
            onClick={addNewQuestion}
          >
            <AddIcon sx={{ mr: 1 }} />
            Add Question
          </Button>
        </Box>
      </DialogContent>
      
      {/* Dialog Actions */}
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogModal;
