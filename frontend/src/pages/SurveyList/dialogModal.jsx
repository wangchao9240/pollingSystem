import React, { useEffect } from "react"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  IconButton,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import axiosInstance from "../../axiosConfig"
import RemoveIcon from "@mui/icons-material/Remove"
import { useAlert } from "../../context/AlertContext"

const DialogModal = ({ open, handleClose, survey, querySurveyList }) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  })
  const { showAlert } = useAlert()

  const onSubmit = async (data) => {
    if (data.options.length === 0) {
      // setError("options", {
      //   type: "manual",
      //   message: "Options are required",
      // })
      showAlert("Options are required", "info", 2000)
      return
    }
    // const { correctAnswer, type } = data
    // if (type === "Single" && correctAnswer.length === 0) {
    //   setError("correctAnswer", {
    //     type: "manual",
    //     message: "Correct Answer is required for Single type",
    //   })
    //   return
    // }
    // if (
    //   type === "Multiple" &&
    //   (correctAnswer.length === 0 || correctAnswer.length === 1)
    // ) {
    //   setError("correctAnswer", {
    //     type: "manual",
    //     message:
    //       "Correct Answer must contain more than one value for Multiple type",
    //   })
    //   return
    // }
    // clearErrors("correctAnswer")
    try {
      const {
        code,
        message,
      } = await axiosInstance.post("/api/survey/addOrUpdateSurvey", data)
      if (code !== 200) {
        showAlert(message, "info", 2000)
        return
      }
      showAlert("operate successfully.", "success", 2000)
      handleClose()
      querySurveyList()

    } catch (error) {
      showAlert(`Server Error: ${error}`, "info", 2000)
    }
  }

  const generateOptionKey = (length) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    return alphabet[length % 26]
  }

  const options = watch("options", [])
  // const correctAnswer = watch("correctAnswer", [])

  // const handleCheckboxChange = (optionKey) => {
  //   if (type === "Single") {
  //     setValue("correctAnswer", [optionKey])
  //   } else {
  //     const newCorrectAnswer = correctAnswer.includes(optionKey)
  //       ? correctAnswer.filter((key) => key !== optionKey)
  //       : [...correctAnswer, optionKey]
  //     setValue("correctAnswer", newCorrectAnswer)
  //   }
  // }

  useEffect(() => {
    reset(survey)
  }, [survey, reset, open])

  // fix bug
  useEffect(() => {
    if (options && options.length && !options[0].optionKey)
      setValue("options", [])
  }, [options, setValue])

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle>{ survey._id ? 'Edit' : 'Create' } Survey</DialogTitle>
      <DialogContent>
        <Controller
          name={"question"}
          control={control}
          rules={{ required: "Question is required" }}
          render={({ field, fieldState: { error } }) => (
            <>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Question
              </InputLabel>
              <TextField
                {...field}
                margin="dense"
                type={"text"}
                fullWidth
                error={!!error}
              />
              <FormHelperText error={!!error}>
                {error ? error.message : null}
              </FormHelperText>
            </>
          )}
        />
        <Controller
          name={"type"}
          control={control}
          rules={{ required: "Type is required" }}
          render={({ field, fieldState: { error } }) => (
            <>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Type
              </InputLabel>
              <Select
                {...field}
                margin="dense"
                fullWidth
                error={!!error}
                onChange={(e) => {
                  // setValue("correctAnswer", [])
                  setValue("type", e.target.value)
                }}
              >
                <MenuItem value={"Single"}>Single</MenuItem>
                <MenuItem value={"Multiple"}>Multiple</MenuItem>
              </Select>
              <FormHelperText error={!!error}>
                {error ? error.message : null}
              </FormHelperText>
            </>
          )}
        />
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Options
        </InputLabel>
        {fields.map((item, index) => (
          <div key={item.id} style={{ display: "flex", alignItems: "center" }}>
            <Controller
              name={`options[${index}].optionKey`}
              control={control}
              rules={{ required: "Option Key is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  disabled
                  {...field}
                  margin="dense"
                  label="Option Key"
                  type="text"
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Controller
              name={`options[${index}].optionValue`}
              control={control}
              rules={{ required: "Option Value is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Option Value"
                  type="text"
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <IconButton onClick={() => remove(index)}>
              <RemoveIcon />
            </IconButton>
          </div>
        ))}
        <Button
          onClick={() =>
            append({
              optionKey: generateOptionKey(fields.length),
              optionValue: "",
            })
          }
          startIcon={<AddIcon />}
        >
          Add Option
        </Button>
        {/* {options && options.length ? (
          <>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Correct Answer
            </InputLabel>
            {options.map((option, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={correctAnswer.includes(option.optionKey)}
                    onChange={() => handleCheckboxChange(option.optionKey)}
                  />
                }
                label={option.optionKey}
              />
            ))}
            <FormHelperText
              error={
                correctAnswer.length === 0 ||
                (type === "Multiple" &&
                  (correctAnswer.length === 1 || correctAnswer.length === 0))
              }
            >
              {correctAnswer.length === 0
                ? "Correct Answer is required"
                : type === "Multiple" && correctAnswer.length === 1
                ? "Correct Answer must contain more than one value for Multiple type"
                : null}
            </FormHelperText>
          </>
        ) : null} */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogModal
