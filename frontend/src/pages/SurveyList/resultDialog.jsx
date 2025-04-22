import React, { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material"
import * as echarts from "echarts"
import axiosInstance from "../../axiosConfig"

const ResultDialog = ({ open, handleClose, survey }) => {
  const chartRef = useRef(null)
  const [result, setResult] = useState([])

  const fetchResuleByQuestionId = async (questionId) => {
    try {
      const { code, data, message } = await axiosInstance.get(
        `/api/survey/querySurveyResultByQuestionId/${questionId}`
      )
      if (code !== 200) {
        window.$toast(message, "info", 2000)
        return
      }
      setResult(data)
    } catch (error) {
      window.$toast(`Server Error: ${error}`, "info", 2000)
    }
  }

  useEffect(() => {
    if (open && survey._id) {
      fetchResuleByQuestionId(survey._id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, survey])

  useEffect(() => {
    if (open && chartRef.current && result.length > 0) {
      const chart = echarts.init(chartRef.current)
      const option = {
        title: {
          text: survey.question,
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "horizontal",
          bottom: 10,
        },
        series: [
          {
            name: "Results",
            type: "pie",
            radius: "50%",
            label: {
              show: true,
              formatter: "{b}: {d}%",
            },
            labelLine: {
              show: true,
            },
            data: result,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      }
      chart.setOption(option)
    }
  }, [open, result, survey])

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Result</DialogTitle>
      <DialogContent>
        {result.length === 0 && (
          <Typography variant="h6" align="center" color="textSecondary">
            No results found
          </Typography>
        )}
        {result.length > 0 && (
          <div ref={chartRef} style={{ width: "100%", height: "350px" }}></div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ResultDialog
