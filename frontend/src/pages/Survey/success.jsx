import React from "react"
import { Container, Typography, Paper } from "@mui/material"
import "./Survey.css"

const Success = () => {

  return (
    <Container maxWidth="sm" className="survey-container">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Survey Completed
        </Typography>
        <Typography variant="body1" gutterBottom>
          Thank you for completing the survey. Your responses have been recorded.
        </Typography>
      </Paper>
    </Container>
  )
}

export default Success
