import React from "react";
import { Controller } from "react-hook-form";
import { 
  TextField, 
  Box, 
  Radio, 
  RadioGroup, 
  FormControlLabel 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { 
  FormSection, 
  SectionLabel, 
  QuestionButton,
  InlineFormSection,
  InlineSectionLabel,
  InlineFieldContainer
} from "./SurveyDialogStyles";
import QuestionItem from "./QuestionItem";

const SurveyForm = ({
  control,
  questionFields,
  watchAllQuestions,
  expandedQuestion,
  toggleQuestion,
  removeQuestion,
  addNewQuestion,
  addOption,
  removeOption,
  watch,
  updateCounter // Add this prop
}) => {
  return (
    <>
      {/* Survey Title */}
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

      {/* Survey Status */}
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
        <SectionLabel>{questionFields && questionFields.length ? 'Questions' : ''}</SectionLabel>

        {/* Question Cards */}
        {questionFields.map((field, questionIndex) => (
          <QuestionItem
            key={`${field.fieldId}-${updateCounter}`} // Ensure key includes updateCounter
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
            updateCounter={updateCounter} // Pass updateCounter
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
    </>
  );
};

export default React.memo(SurveyForm);