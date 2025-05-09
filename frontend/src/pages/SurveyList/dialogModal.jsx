import React from "react";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { StyledDialog, ActionButton } from "./components/SurveyDialogStyles";
import { SearchButton } from "../../components/CustomizeComponent";
import SurveyForm from "./components/SurveyForm";
import { useSurveyForm } from "./hooks/useSurveyForm";

const DialogModal = ({ open, handleClose, survey, querySurveyList }) => {
  // Use custom hook to manage form logic
  const {
    control,
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
    updateCounter // Get from custom hook
  } = useSurveyForm(survey, handleClose, querySurveyList);

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
        <SurveyForm
          control={control}
          questionFields={questionFields}
          watchAllQuestions={watchAllQuestions}
          expandedQuestion={expandedQuestion}
          toggleQuestion={toggleQuestion}
          removeQuestion={removeQuestion}
          addNewQuestion={addNewQuestion}
          addOption={addOption}
          removeOption={removeOption}
          watch={watch}
          updateCounter={updateCounter} // Pass updateCounter
        />
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
  );
};

export default DialogModal;
