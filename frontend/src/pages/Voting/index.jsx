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
  // import "./voting.css"
  import Divider from '@mui/material/Divider';
  import image from './img/image.png';
  
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
        if (q.type === "Multiple" && (!answers[q._id] || answers[q._id].length < 2)) {
          return true;
        }
        return false;
      });
  
      if (unansweredQuestions.length > 0) {
        const message = unansweredQuestions[0].type === "Multiple" 
          ? "Please select at least two options for multiple choice questions"
          : "Please answer all questions before submitting";
          
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
      <Box sx={{ 
        display: 'flex', 
        height: '100vh', 
        overflow: 'hidden', 
        bgcolor: '#f5f7fb', 
        width: '100%'
      }}>
        {/* Left side - Image */}
        <Box sx={{ 
          flex: '0 0 40%', 
          display: { xs: 'none', md: 'flex' }, 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 0
        }}>
          <img 
            src={image} 
            alt="survey illustration" 
            style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#fff' }} 
          />
        </Box>
        
        {/* Right side - All questions with scrolling */}
        <Box sx={{ 
          flex: '0 0 60%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
          paddingLeft: { xs: 0, md: 0 },
          backgroundColor: '#fff'
        }}>
          <Paper elevation={1} sx={{ 
            width: '100%', 
            // maxWidth: '800px',
            maxHeight: '100vh',
            overflow: 'auto',
            borderRadius: 0,
            p: 4,
            backgroundColor: '#ececed'
          }}>
            {/* Survey Title */}
            {survey && (
              <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 500 }}>
                {survey.title}
              </Typography>
            )}
            
            {/* Survey questions */}
            {questions.map((question, index) => (
              <Box key={question._id} sx={{ mb: 5 }}>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                  Question {index + 1} / {questions.length}
                </Typography>
                
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
                  {question.question}
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
                          sx={{ mb: 1 }}
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
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </FormGroup>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Please select at least two options
                    </Typography>
                  </FormControl>
                )}
                
                {index < questions.length - 1 && <Divider sx={{ mt: 4 }} />}
              </Box>
            ))}
            
            {/* Navigation buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
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
            </Box>
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
        </Box>
      </Box>
    );
  };
  
  export default Voting;