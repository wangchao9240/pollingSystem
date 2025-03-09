import React, { useEffect, useState } from "react"
import {
  Container,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
  Paper,
} from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import "./Survey.css"
import { useAlert } from "../../context/AlertContext"
import axiosInstance from "../../axiosConfig"

const Survey = () => {
  const [selectedOption, setSelectedOption] = useState([])
  const [survey, setSurvey] = useState({})
  const { showAlert } = useAlert()
  const location = useLocation()
  const navigate = useNavigate()

  const querySurveyById = async (id) => {
    try {
      const { code, data, message } = await axiosInstance.get(
        `/api/survey/querySurveyItem/${id}`
      )
      if (code !== 200) {
        showAlert(message, "info", 2000)
        return
      }
      if (data) setSurvey(data)
    } catch (error) {
      showAlert(`Server Error: ${error}`, "info", 2000)
    }
  }

  const handleOptionChange = (event) => {
    const value = event.target.value
    if (survey?.type === "Single") {
      setSelectedOption([value])
    } else {
      setSelectedOption((prev) =>
        prev.includes(value)
          ? prev.filter((option) => option !== value)
          : [...prev, value]
      )
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (survey.type === "Single" && selectedOption.length === 0) {
      showAlert("Please select an option", "info", 2000)
      return
    } else if (survey.type === "Multiple" && selectedOption.length < 2) {
      showAlert("Please select at least two options", "info", 2000)
      return
    }
    try {
      const { code, message } = await axiosInstance.post(
        "/api/survey/completeSurvey",
        {
          id: survey._id,
          chooseAnswer: selectedOption,
        }
      )
      if (code !== 200) {
        showAlert(message, "info", 2000)
        return
      }
      showAlert("Survey completed successfully", "success", 2000)
      navigate("/surveySuccess")
    } catch (error) {
      showAlert(`Server Error: ${error}`, "info", 2000)
    }
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const surveyId = queryParams.get("id")
    if (surveyId) querySurveyById(surveyId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  const getOptionLabel = (index, optionValue) => {
    const prefix = String.fromCharCode(65 + index) // 65 is the ASCII code for 'A'
    return `${prefix}. ${optionValue}`
  }

  return (
    <Container maxWidth="sm" className="survey-container">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Survey
        </Typography>
        {survey._id && (
          <form onSubmit={handleSubmit} className="survey-form">
            <FormControl component="fieldset">
              <FormLabel component="legend">{survey?.question}</FormLabel>
              {survey?.type === "Single" ? (
                <RadioGroup
                  value={selectedOption[0] || ""}
                  onChange={handleOptionChange}
                >
                  {survey?.options.map((option, index) => (
                    <FormControlLabel
                      key={option.optionKey}
                      value={option.optionKey}
                      control={<Radio />}
                      label={getOptionLabel(index, option.optionValue)}
                    />
                  ))}
                </RadioGroup>
              ) : (
                <>
                  {survey?.options.map((option, index) => (
                    <FormControlLabel
                      key={option.optionKey}
                      control={
                        <Checkbox
                          checked={selectedOption.includes(option.optionKey)}
                          onChange={handleOptionChange}
                          value={option.optionKey}
                        />
                      }
                      label={getOptionLabel(index, option.optionValue)}
                    />
                  ))}
                </>
              )}
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="survey-submit"
            >
              Submit
            </Button>
          </form>
        )}
      </Paper>
    </Container>
  )
}

export default Survey
