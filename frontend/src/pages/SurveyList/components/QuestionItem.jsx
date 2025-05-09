import React from "react"
import { Controller } from "react-hook-form"
import { Typography, IconButton, Box, TextField, MenuItem } from "@mui/material"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import AddIcon from "@mui/icons-material/Add"
import {
  QuestionCard,
  QuestionHeader,
  QuestionContent,
  AddButton,
  InlineFormSection,
  InlineSectionLabel,
  InlineFieldContainer,
} from "./SurveyDialogStyles"
import OptionInputField from "./OptionInputField"

const QuestionItem = React.memo(
  ({
    field,
    questionIndex,
    watchQuestion,
    control,
    expanded,
    toggleQuestion,
    removeQuestion,
    addOption,
    removeOption,
    watch,
    updateCounter, // 添加 updateCounter prop
  }) => {
    // 获取选项并确保它们始终是最新的
    // 使用 useEffect 来响应 updateCounter 变化
    const [options, setOptions] = React.useState([])

    React.useEffect(() => {
      const currentOptions = watch(`questions[${questionIndex}].options`) || []
      setOptions(currentOptions)
    }, [watch, questionIndex, updateCounter]) // 依赖 updateCounter 变化

    return (
      <QuestionCard>
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
            {/* Question Title */}
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

            {/* Question Type */}
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
                      <MenuItem value="Multiple">Multiple Choice</MenuItem>
                    </TextField>
                  )}
                />
              </InlineFieldContainer>
            </InlineFormSection>

            {/* Options */}
            <InlineSectionLabel>
              <div style={{ paddingBottom: "20px" }}>options</div>
            </InlineSectionLabel>
            <InlineFieldContainer>
              <InlineFieldContainer>
                {/* Option Inputs - use local state instead of watch */}
                {options.map((option, optionIndex) => (
                  <OptionInputField
                    key={`${questionIndex}-${optionIndex}-${updateCounter}`} // 添加 updateCounter 到 key
                    questionIndex={questionIndex}
                    optionIndex={optionIndex}
                    option={option}
                    control={control}
                    removeOption={removeOption}
                  />
                ))}

                {/* Add Option Button */}
                <AddButton
                  startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log(
                      "Add option button clicked for question",
                      questionIndex
                    )
                    addOption(questionIndex)
                  }}
                  sx={{ mt: 1 }}
                >
                  Add Option
                </AddButton>
              </InlineFieldContainer>
            </InlineFieldContainer>
          </QuestionContent>
        )}
      </QuestionCard>
    )
  }
)

export default QuestionItem
