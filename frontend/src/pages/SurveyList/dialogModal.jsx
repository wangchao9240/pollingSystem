import React, { useEffect, useState } from "react"
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
import RemoveIcon from "@mui/icons-material/Remove"

const DialogModal = ({ open, handleClose, survey }) => {
  const { control, handleSubmit, reset } = useForm()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  })

  useEffect(() => {
    reset(survey)
  }, [survey, reset, open])

  const onSubmit = (data) => {
    console.log(data)
    // handleClose()
  }

  const generateOptionKey = (length) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    return alphabet[length % 26]
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Edit Survey</DialogTitle>
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
              <Select {...field} margin="dense" fullWidth error={!!error}>
                <MenuItem value={"Single"}>Single</MenuItem>
                <MenuItem value={"Multi"}>Multi</MenuItem>
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
          onClick={() => append({ optionKey: generateOptionKey(fields.length), optionValue: "" })}
          startIcon={<AddIcon />}
        >
          Add Option
        </Button>
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
