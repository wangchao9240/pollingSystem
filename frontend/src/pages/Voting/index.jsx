import { 
    Paper, 
    Typography, 
    FormControl, 
    FormControlLabel, 
    RadioGroup, 
    Radio, 
    Checkbox, 
    FormGroup, 
    Button, 
    Box, 
    CircularProgress, 
    Container,
    Alert,
    Snackbar
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useSearchParams, useNavigate } from "react-router-dom";
  import axiosInstance from "../../axiosConfig";
  
  /**
   * Voting component for the client-side survey page
   * Displays questions and options, collects answers and submits them
   */
  const Voting = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const surveyId = searchParams.get("id");
    
    const [loading, setLoading] = useState(true);
    const [survey, setSurvey] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [error, setError] = useState("");
    const [hasVoted, setHasVoted] = useState(false);
    const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "info"
    });
  
    useEffect(() => {
      // Check if user already voted for this survey
      const votedSurveys = JSON.parse(localStorage.getItem("votedSurveys") || "[]");
      if (votedSurveys.includes(surveyId)) {
        setHasVoted(true);
        setError("You have already completed this survey.");
      }
      
      fetchSurvey();
    }, [surveyId]);
  
    /**
     * Fetch survey data from API
     */
    const fetchSurvey = async () => {
      try {
        setLoading(true);
        // Use the voting controller to get survey data
        const { code, data, message } = await axiosInstance.get(`/api/voting/survey/${surveyId}`);
        
        if (code !== 200) {
          setError(message || "Failed to fetch survey");
          setLoading(false);
          return;
        }
  
        // Set survey and questions data
        setSurvey(data.survey);
        setQuestions(data.questions);
        
        // Initialize answers object
        const initialAnswers = {};
        data.questions.forEach(q => {
          initialAnswers[q._id] = q.type === "Multiple" ? [] : "";
        });
        setAnswers(initialAnswers);
        
        setLoading(false);
      } catch (error) {
        setError(`Server error: ${error.message}`);
        setLoading(false);
      }
    };
  
    /**
     * Handle change for single choice questions
     * @param {string} questionId - ID of the question
     * @param {string} value - Selected option value
     */
    const handleSingleChoiceChange = (questionId, value) => {
      setAnswers(prev => ({
        ...prev,
        [questionId]: value
      }));
    };
  
    /**
     * Handle change for multiple choice questions
     * @param {string} questionId - ID of the question
     * @param {string} value - Option value to toggle
     */
    const handleMultipleChoiceChange = (questionId, value) => {
      setAnswers(prev => {
        const currentAnswers = [...(prev[questionId] || [])];
        
        if (currentAnswers.includes(value)) {
          // Remove if already selected
          return {
            ...prev,
            [questionId]: currentAnswers.filter(item => item !== value)
          };
        } else {
          // Add if not selected
          return {
            ...prev,
            [questionId]: [...currentAnswers, value]
          };
        }
      });
    };
  
    /**
     * Handle form submission
     * Validates answers and sends them to the server
     */
    const handleSubmit = async () => {
      // Validate answers
      const unansweredQuestions = questions.filter(q => {
        if (q.type === "Single" && !answers[q._id]) {
          return true;
        }
        if (q.type === "Multiple" && (!answers[q._id] || answers[q._id].length === 0)) {
          return true;
        }
        return false;
      });
  
      if (unansweredQuestions.length > 0) {
        const message = "Please select at least one option for each question";
          
        setSnackbar({
          open: true, 
          message, 
          severity: "warning"
        });
        return;
      }
  
      try {
        setLoading(true);
        
        // Format answers for API
        const formattedAnswers = Object.keys(answers).map(questionId => ({
          questionId,
          chooseAnswer: Array.isArray(answers[questionId]) 
            ? answers[questionId] 
            : [answers[questionId]]
        }));
        
        // Submit using the voting controller
        const { code, message } = await axiosInstance.post("/api/voting/submit", {
          id: surveyId,
          answers: formattedAnswers
        });
        
        if (code !== 200) {
          setSnackbar({
            open: true,
            message: message || "Failed to submit survey",
            severity: "error"
          });
          setLoading(false);
          return;
        }
  
        // Save to localStorage that user has voted
        const votedSurveys = JSON.parse(localStorage.getItem("votedSurveys") || "[]");
        localStorage.setItem("votedSurveys", JSON.stringify([...votedSurveys, surveyId]));
        
        // Navigate to completion page
        navigate(`/voting-complete?id=${surveyId}`);
        
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Server error: ${error.message}`,
          severity: "error"
        });
        setLoading(false);
      }
    };
  
    /**
     * Close snackbar notification
     */
    const handleCloseSnackbar = () => {
      setSnackbar(prev => ({...prev, open: false}));
    };
  
    // Show loading indicator while fetching data
    if (loading) {
      return (
        <Container maxWidth="md" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
          <CircularProgress />
        </Container>
      );
    }
  
    // Show error message if survey not found or already voted
    if (error || hasVoted) {
      return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Alert severity="info">{error || "You've already completed this survey."}</Alert>
          </Paper>
        </Container>
      );
    }
  
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {survey && survey.title}
          </Typography>
          
          {questions.map((question, index) => (
            <Box key={question._id} sx={{ mb: 4, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                {index + 1}. {question.question}
              </Typography>
              
              {question.type === "Single" ? (
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={answers[question._id] || ""}
                    onChange={(e) => handleSingleChoiceChange(question._id, e.target.value)}
                  >
                    {question.options.map(option => (
                      <FormControlLabel
                        key={option.optionKey}
                        value={option.optionKey}
                        control={<Radio />}
                        label={option.optionValue}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              ) : (
                <FormControl component="fieldset" fullWidth>
                  <FormGroup>
                    {question.options.map(option => (
                      <FormControlLabel
                        key={option.optionKey}
                        control={
                          <Checkbox
                            checked={answers[question._id]?.includes(option.optionKey) || false}
                            onChange={() => handleMultipleChoiceChange(question._id, option.optionKey)}
                          />
                        }
                        label={option.optionValue}
                      />
                    ))}
                  </FormGroup>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Please select at least two options
                  </Typography>
                </FormControl>
              )}
            </Box>
          ))}
          
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            fullWidth 
            onClick={handleSubmit}
            disabled={loading || hasVoted}
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Paper>
        
        <Snackbar 
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    );
  };
  
  export default Voting;