import React, { useEffect, useState, useCallback, useMemo } from "react"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import {
  DialogActions,
  DialogContent,
  TextField,
  DialogTitle,
  Typography,
  IconButton,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  MenuItem,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import CloseIcon from "@mui/icons-material/Close"
import axiosInstance from "../../axiosConfig"

// Import styled components
import {
  StyledDialog,
  QuestionCard,
  QuestionHeader,
  QuestionContent,
  FormSection,
  SectionLabel,
  OptionInput,
  OptionLabel,
  AddButton,
  ActionButton,
  QuestionButton,
  InlineFormSection,
  InlineSectionLabel,
  InlineFieldContainer,
} from "./components/SurveyDialogStyles"
import { SearchButton } from "../../components/CustomizeComponent"

// Option input component - improve reusability
const OptionInputField = React.memo(({ 
  questionIndex, 
  optionIndex, 
  option, 
  control, 
  removeOption 
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      mb={1}
    >
      <OptionLabel>{option.optionKey}</OptionLabel>
      <Controller
        name={`questions[${questionIndex}].options[${optionIndex}].optionValue`}
        control={control}
        rules={{ required: "Option text is required" }}
        render={({ field, fieldState: { error } }) => (
          <OptionInput
            {...field}
            fullWidth
            placeholder="Please input option text"
            variant="outlined"
            error={!!error}
            helperText={error ? error.message : null}
          />
        )}
      />
      <IconButton
        size="small"
        onClick={() => removeOption(questionIndex, optionIndex)}
        sx={{ color: "#666", ml: 1 }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  )
})

// Question component - separate complex logic
const QuestionItem = React.memo(({
  field,
  questionIndex,
  watchQuestion,
  control,
  expanded,
  toggleQuestion,
  removeQuestion,
  addOption,
  removeOption,
  watch
}) => {
  return (
    <QuestionCard key={field.fieldId}>
      <QuestionHeader
        expanded={expanded}
        onClick={() => toggleQuestion(questionIndex)}
      >
        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
          {watchQuestion?.question || `Question${questionIndex + 1}`}
        </Typography>
        <Box display="flex" alignItems="center">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              removeQuestion(questionIndex)
            }}
            sx={{ color: "#666" }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          {expanded ? (
            <KeyboardArrowUpIcon sx={{ color: "#666" }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ color: "#666" }} />
          )}
        </Box>
      </QuestionHeader>

      {expanded && (
        <QuestionContent>
          {/* Question Title - inline layout */}
          <InlineFormSection>
            <InlineSectionLabel>title</InlineSectionLabel>
            <InlineFieldContainer>
              <Controller
                name={`questions[${questionIndex}].question`}
                control={control}
                rules={{ required: "Question title is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="Please input question title"
                    variant="outlined"
                    error={!!error}
                    helperText={error ? error.message : null}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "4px",
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "10px 14px",
                      },
                    }}
                  />
                )}
              />
            </InlineFieldContainer>
          </InlineFormSection>

          {/* Question Type - inline layout */}
          <InlineFormSection>
            <InlineSectionLabel>type</InlineSectionLabel>
            <InlineFieldContainer>
              <Controller
                name={`questions[${questionIndex}].type`}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "4px",
                      },
                      "& .MuiSelect-select": {
                        padding: "10px 14px",
                      },
                    }}
                  >
                    <MenuItem value="Single">Single Choice</MenuItem>
                    <MenuItem value="Multiple">
                      Multiple Choice
                    </MenuItem>
                  </TextField>
                )}
              />
            </InlineFieldContainer>
          </InlineFormSection>

          {/* Options Section - fix layout issues */}
            <InlineSectionLabel><div style={{ paddingBottom: '20px' }}>options</div></InlineSectionLabel>
            <InlineFieldContainer>
              {/* Option Inputs */}
              {(watch(`questions[${questionIndex}].options`) || []).map(
                (option, optionIndex) => (
                  <OptionInputField
                    key={`${questionIndex}-${optionIndex}`}
                    questionIndex={questionIndex}
                    optionIndex={optionIndex}
                    option={option}
                    control={control}
                    removeOption={removeOption}
                  />
                )
              )}

              {/* Add Option Button */}
              <AddButton
                startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                onClick={() => {
                  console.log("Add option clicked for question", questionIndex);
                  addOption(questionIndex);
                }}
                sx={{ mt: 1 }}
              >
                Add Option
              </AddButton>
            </InlineFieldContainer>
        </QuestionContent>
      )}
    </QuestionCard>
  )
})

const DialogModal = ({ open, handleClose, survey, querySurveyList }) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      surveyStatus: 0,
      questions: [],
    },
    mode: "onBlur",
  })

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
    keyName: "fieldId",
  })

  // Watch for form changes
  const watchAllQuestions = watch("questions")

  // Track expanded/collapsed state of questions
  const [expandedQuestion, setExpandedQuestion] = useState(null)

  // Toggle question expansion
  const toggleQuestion = useCallback((index) => {
    setExpandedQuestion(prevExpanded => prevExpanded === index ? null : index)
  }, [])

  // Generate option label (A, B, C, etc)
  const generateOptionLabel = useCallback((index) => {
    return String.fromCharCode(65 + index) // 65 is ASCII for 'A'
  }, [])

  // Add an option to a question - optimize with useCallback
  const addOption = useCallback((questionIndex) => {
    console.log("Adding option to question", questionIndex);
    try {
      // 获取当前选项
      const currentOptions = watch(`questions[${questionIndex}].options`) || [];
      console.log("Current options:", currentOptions);
      
      // 创建新选项
      const newOption = {
        optionKey: String.fromCharCode(65 + currentOptions.length),
        optionValue: "",
      };
      console.log("New option:", newOption);
      
      // 更新选项列表
      setValue(`questions[${questionIndex}].options`, [
        ...currentOptions,
        newOption
      ]);
      
      // 强制触发表单值更新
      setValue(`questions[${questionIndex}]`, {
        ...watch(`questions[${questionIndex}`),
        options: [...currentOptions, newOption]
      }, { shouldDirty: true });
      
      // 触发重新渲染
      setTimeout(() => {
        setValue('forceUpdate', Date.now());
      }, 0);
      
      console.log("Options updated");
    } catch (error) {
      console.error("Error adding option:", error);
    }
  }, [watch, setValue]);

  // Remove an option - optimize with useCallback
  const removeOption = useCallback((questionIndex, optionIndex) => {
    const currentOptions = [...watch(`questions[${questionIndex}].options`)]
    currentOptions.splice(optionIndex, 1)

    // Regenerate option keys to maintain sequence
    const updatedOptions = currentOptions.map((opt, idx) => ({
      ...opt,
      optionKey: String.fromCharCode(65 + idx),
    }))

    setValue(`questions[${questionIndex}].options`, updatedOptions)
  }, [watch, setValue])

  // Add a new question - optimize with useCallback
  const addNewQuestion = useCallback(() => {
    const newIndex = questionFields.length
    appendQuestion({
      question: `Question${newIndex + 1}`,
      type: "Single",
      options: [],
    })

    // Expand the newly added question
    setTimeout(() => {
      setExpandedQuestion(newIndex)
    }, 100)
  }, [questionFields, appendQuestion])

  // Validate survey data - optimize with useCallback
  const validateSurveyData = useCallback((data) => {
    // Check if title is empty
    if (!data.title || data.title.trim() === "") {
      window.$toast("Survey title is required", "info", 2000)
      return false
    }

    // Check if there are questions
    if (!data.questions || data.questions.length === 0) {
      window.$toast("At least one question is required", "info", 2000)
      return false
    }

    // Check each question
    for (let i = 0; i < data.questions.length; i++) {
      const q = data.questions[i]

      // Check question title
      if (!q.question || q.question.trim() === "") {
        window.$toast(`Question ${i + 1} requires a title`, "info", 2000)
        setExpandedQuestion(i)
        return false
      }

      // Check if options exist
      if (!q.options || q.options.length === 0) {
        window.$toast(
          `Question ${i + 1} must have at least one option`,
          "info",
          2000
        )
        setExpandedQuestion(i)
        return false
      }

      // Check each option
      for (let j = 0; j < q.options.length; j++) {
        const opt = q.options[j]
        if (!opt.optionValue || opt.optionValue.trim() === "") {
          window.$toast(
            `Question ${i + 1} has an empty option (${opt.optionKey})`,
            "info",
            2000
          )
          setExpandedQuestion(i)
          return false
        }
      }
    }

    return true
  }, [])

  // Handle form submission - optimize with useCallback
  const onSubmit = useCallback(async (data) => {
    console.log("Form Data: ", data)
    if (validateSurveyData(data) !== true) {
      return
    }

    try {
      const { code, message } = await axiosInstance.post(
        "/api/survey/addOrUpdateSurvey",
        data
      )
      
      if (code !== 200) {
        window.$toast(message, "info", 2000)
        return
      }

      window.$toast("operate successfully.", "success", 2000)
      handleClose()
      querySurveyList()
    } catch (error) {
      window.$toast(`Server Error: ${error}`, "info", 2000)
    }
  }, [validateSurveyData, handleClose, querySurveyList])

  // Handle save button click
  const handleSaveClick = useCallback(() => {
    console.log("Save button clicked")
    handleSubmit(
      (data) => {
        console.log("Form submitted successfully")
        onSubmit(data)
      },
      (errors) => {
        console.error("Form validation failed:", errors)

        // Get the first error field and focus on it
        const fieldNames = Object.keys(errors)
        if (fieldNames.length > 0) {
          const firstFieldName = fieldNames[0]

          // Check if it's a question field error
          if (firstFieldName.startsWith("questions[")) {
            // Extract the question index - matches questions[0].question or questions[0].options[1].optionValue
            const matches = firstFieldName.match(/questions\[(\d+)\]/)
            if (matches && matches[1]) {
              const questionIndex = parseInt(matches[1])
              setExpandedQuestion(questionIndex)
            }
          }

          window.$toast("Please fix the highlighted fields", "warning", 2000)
        }
      }
    )()
  }, [handleSubmit, onSubmit])

  // Reset form when survey data changes
  useEffect(() => {
    if (survey) {
      reset(survey)

      // Expand the first question by default or keep all collapsed
      if (survey.questions && survey.questions.length > 0) {
        setExpandedQuestion(null) // Start with collapsed questions
      }
    }
  }, [survey, reset, open])

  return (
    <StyledDialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { borderRadius: "12px" },
      }}
    >
      <DialogTitle style={{borderBottom: 'none'}}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ fontWeight: 500, fontSize: "20px" }}>
            {survey && survey._id ? "Edit" : "Create"} Survey
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Survey Title - inline layout */}
        <InlineFormSection>
          <InlineSectionLabel>Survey Title</InlineSectionLabel>
          <InlineFieldContainer>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Survey Title is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Please input survey title"
                  variant="outlined"
                  value={field.value || ""}
                  error={!!error}
                  helperText={error ? error.message : null}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "4px",
                      "&.Mui-error": {
                        "& fieldset": {
                          borderColor: "error.main",
                        },
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "10px 14px",
                    },
                  }}
                />
              )}
            />
          </InlineFieldContainer>
        </InlineFormSection>

        {/* Survey Status - inline layout */}
        <InlineFormSection>
          <InlineSectionLabel>Survey Status</InlineSectionLabel>
          <InlineFieldContainer>
            <Controller
              name="surveyStatus"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  row
                  value={field.value !== undefined ? field.value.toString() : "0"}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                >
                  <FormControlLabel
                    value="0"
                    control={<Radio color="primary" size="small" />}
                    label="Inactive"
                    sx={{ mr: 3 }}
                  />
                  <FormControlLabel
                    value="1"
                    control={<Radio color="primary" size="small" />}
                    label="Active"
                  />
                </RadioGroup>
              )}
            />
          </InlineFieldContainer>
        </InlineFormSection>

        {/* Questions Section */}
        <FormSection>
          <SectionLabel>{ questionFields && questionFields.length ? 'Questions' : '' }</SectionLabel>

          {/* Question Cards */}
          {questionFields.map((field, questionIndex) => (
            <QuestionItem
              key={field.fieldId}
              field={field}
              questionIndex={questionIndex}
              watchQuestion={watchAllQuestions[questionIndex]}
              control={control}
              expanded={expandedQuestion === questionIndex}
              toggleQuestion={toggleQuestion}
              removeQuestion={removeQuestion}
              addOption={addOption}
              removeOption={removeOption}
              watch={watch}
            />
          ))}

          {/* Add Question Button */}
          <Box display="flex" justifyContent="center" mt={2}>
            <QuestionButton
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addNewQuestion}
            >
              Add Question
            </QuestionButton>
          </Box>
        </FormSection>
      </DialogContent>

      <DialogActions sx={{ display: "flex", justifyContent: "flex-end" }}>
        <ActionButton
          onClick={handleClose}
          variant="outlined"
          color="inherit"
          sx={{ mr: 1 }}
        >
          Cancel
        </ActionButton>
        <SearchButton onClick={handleSaveClick} variant="contained">
          Save
        </SearchButton>
      </DialogActions>
    </StyledDialog>
  )
}

export default DialogModal
