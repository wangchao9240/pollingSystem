import React from "react";
import { Controller } from "react-hook-form";
import { Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { OptionInput, OptionLabel } from "./SurveyDialogStyles";

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
  );
});

export default OptionInputField;