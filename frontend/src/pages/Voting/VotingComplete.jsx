import { 
    Paper, 
    Typography, 
    Container, 
    Box, 
    Button,
    CircularProgress
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useSearchParams, useNavigate } from "react-router-dom";
  import axiosInstance from "../../axiosConfig";
  import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
  
  /**
   * VotingComplete component
   * Displays confirmation screen after user submits survey
   */
  const VotingComplete = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const surveyId = searchParams.get("id");
    
    const [loading, setLoading] = useState(true);
    const [survey, setSurvey] = useState(null);
  
    useEffect(() => {
      // Fetch survey basic info to show title
      const fetchSurvey = async () => {
        try {
          if (!surveyId) {
            navigate('/');
            return;
          }
  
          setLoading(true);
          const { code, data } = await axiosInstance.get(`/api/voting/survey/${surveyId}`);
          
          if (code === 200 && data && data.survey) {
            setSurvey(data.survey);
          } else {
            navigate('/');
          }
          
          setLoading(false);
        } catch (error) {
          setLoading(false);
          navigate('/');
        }
      };
  
      fetchSurvey();
    }, [surveyId, navigate]);
  
    // Show loading spinner while fetching data
    if (loading) {
      return (
        <Container maxWidth="md" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
          <CircularProgress />
        </Container>
      );
    }
  
    return (
      <Container maxWidth="sm" sx={{ mt: 8, mb: 6 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 6, 
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
          
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Thank You!
          </Typography>
          
          <Typography variant="h6" gutterBottom>
            Your response has been submitted successfully.
          </Typography>
          
          {survey && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Survey: {survey.title}
            </Typography>
          )}
          
          {/* <Box sx={{ mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
            >
              Back to Home
            </Button>
            
            <Button 
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              Take Another Survey
            </Button>
          </Box> */}
        </Paper>
      </Container>
    );
  };
  
  export default VotingComplete;