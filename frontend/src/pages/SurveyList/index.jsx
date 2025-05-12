import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Paper, List, ListItem, Button, Box, Divider, CircularProgress } from "@mui/material";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

export const Result = () => {
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for survey
  const [chartData, setChartData] = useState({});
  const [error, setError] = useState(null);
  const { id } = useParams();
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
    "#9966FF", "#FF9F40", "#FFCD56", "#C9CBCF"
  ];

  useEffect(() => {
    const fetchSurvey = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5001/api/result/surveys/${id}`);
        setSurvey(response.data.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching survey data.", error);
        setError("Failed to load survey data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSurvey();
  }, [id]);

  const handleOptionClick = async (questionId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5001/api/result/surveys/${id}/question/${questionId}/results`
      );
      const results = response.data.data;

      const optionCount = {};
      results.forEach((result) => {
        result.chooseAnswer.forEach((answer) => {
          optionCount[answer] = (optionCount[answer] || 0) + 1;
        });
      });

      const formattedData = Object.entries(optionCount).map(([option, count]) => ({
        name: option,
        value: count,
      }));

      setChartData((prev) => ({
        ...prev,
        [questionId]: formattedData,
      }));
    } catch (error) {
      console.error("Error fetching result data.", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography>Loading survey data...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 4, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}>
          {survey.title}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {survey.questions.map((question) => (
          <Box key={question._id} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: "medium", mb: 1 }}>
              {question.question}
            </Typography>
            <List>
              {question.options.map((option) => (
                <ListItem key={option._id} sx={{ p: 0, mb: 1 }}>
                  <Box
                    sx={{
                      padding: "10px",
                      border: "1px solid",
                      borderColor: "gray.400",
                      borderRadius: "4px",
                      textAlign: "center",
                      backgroundColor: "#f0f0f0",
                      width: "100%",
                    }}
                  >
                    {option.optionKey} : {option.optionValue}
                  </Box>
                </ListItem>
              ))}
            </List>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleOptionClick(question._id)}
              sx={{ mt: 2 }}
            >
              View Result
            </Button>

            {chartData[question._id] ? (
              chartData[question._id].length > 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap: 4 }}>
                  {/* Pie Chart */}
                  <ResponsiveContainer width="45%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData[question._id]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                      >
                        {chartData[question._id].map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <ResponsiveContainer width="45%" height={300}>
                    <BarChart data={chartData[question._id]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Typography sx={{ mt: 2, textAlign: "center" }}>No responses yet.</Typography>
              )
            ) : (
              <Typography sx={{ mt: 2, textAlign: "center" }}>Click "View Result" to generate charts.</Typography>
            )}
          </Box>
        ))}
      </Paper>
    </Container>
  );
};

export default Result;
