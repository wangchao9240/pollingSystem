import React, { useEffect } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  IconButton,
  Button,
  Box,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

/**
 * QuestionBlock Component - Renders a single question with its options
 * 
 * @param {Object} control - React Hook Form control object
 * @param {Function} setValue - Function to set form values
 * @param {Function} watch - Function to watch form values
 * @param {Number} questionIndex - Index of the question in the array
 */
const QuestionBlock = ({ control, setValue, watch, questionIndex }) => {
  // Field array for managing question options
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions[${questionIndex}].options`,
    keyName: "optionFieldId" // Use a custom key name to avoid conflicts
  });

  /**
   * Generate alphabetical option keys (A, B, C, etc.)
   */
  const generateOptionKey = (index) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[index % 26];
  };
  
  // Set default question title if it's empty, but only once on initial render
  useEffect(() => {
    const currentQuestion = watch(`questions[${questionIndex}].question`);
    if (!currentQuestion) {
      setValue(`questions[${questionIndex}].question`, `Question ${questionIndex + 1}`);
    }
    
    // Set default type if not specified
    const currentType = watch(`questions[${questionIndex}].type`);
    if (!currentType) {
      setValue(`questions[${questionIndex}].type`, "Single");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex]); // Only depend on questionIndex, not on watch or setValue to avoid re-running

  /**
   * Add a new option to the question
   */
  const handleAddOption = () => {
    append({
      optionKey: generateOptionKey(fields.length),
      optionValue: "",
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Question Text Field */}
      <Controller
        name={`questions[${questionIndex}].question`}
        control={control}
        rules={{ required: "Question is required" }}
        render={({ field, fieldState: { error } }) => (
          <>
            <InputLabel variant="standard">Question Title</InputLabel>
            <TextField
              {...field}
              margin="dense"
              type="text"
              fullWidth
              error={!!error}
              onChange={(e) => {
                // Update field normally
                field.onChange(e);
              }}
            />
            <FormHelperText error={!!error}>
              {error ? error.message : null}
            </FormHelperText>
          </>
        )}
      />

      {/* Question Type Select */}
      <Controller
        name={`questions[${questionIndex}].type`}
        control={control}
        rules={{ required: "Type is required" }}
        render={({ field, fieldState: { error } }) => (
          <>
            <InputLabel variant="standard">Question Type</InputLabel>
            <Select
              {...field}
              margin="dense"
              fullWidth
              error={!!error}
            >
              <MenuItem value="Single">Single Choice</MenuItem>
              <MenuItem value="Multiple">Multiple Choice</MenuItem>
            </Select>
            <FormHelperText error={!!error}>
              {error ? error.message : null}
            </FormHelperText>
          </>
        )}
      />

      {/* Options Section */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2">Options</Typography>
        
        {/* Render each option */}
        {fields.map((item, index) => (
          <OptionRow
            key={item.optionFieldId}
            control={control}
            questionIndex={questionIndex}
            optionIndex={index}
            onRemove={() => remove(index)}
          />
        ))}
        
        {/* Add Option Button */}
        <Button
          size="small"
          sx={{ mt: 1 }}
          onClick={handleAddOption}
        >
          <AddIcon sx={{ mr: 1 }} />
          Add Option
        </Button>
      </Box>
    </Box>
  );
};

/**
 * Option Row component
 */
const OptionRow = ({ control, questionIndex, optionIndex, onRemove }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Controller
      name={`questions[${questionIndex}].options[${optionIndex}].optionKey`}
      control={control}
      rules={{ required: "Key required" }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          disabled
          {...field}
          margin="dense"
          label="Key"
          type="text"
          sx={{ width: '100px' }}
          error={!!error}
          helperText={error ? error.message : null}
        />
      )}
    />
    <Controller
      name={`questions[${questionIndex}].options[${optionIndex}].optionValue`}
      control={control}
      rules={{ required: "Value required" }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          margin="dense"
          label="Option text"
          type="text"
          fullWidth
          error={!!error}
          helperText={error ? error.message : null}
        />
      )}
    />
    <IconButton 
      color="error" 
      onClick={onRemove}
      sx={{ mt: 1 }}
    >
      <RemoveIcon />
    </IconButton>
  </Box>
);

export default QuestionBlock;