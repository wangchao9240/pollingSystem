import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
Container, 
Typography, 
Box, 
Button, 
Grid, 
Card, 
CardContent,
} from '@mui/material';

const WelcomePage = () => {
const navigate = useNavigate();

const handleGetStarted = () => {
  navigate('/surveyList'); // Navigate to login page or dashboard
};

return (
  <Container maxWidth="lg">
    <Box sx={{ my: 4, textAlign: 'center' }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to Online Polling System
      </Typography>
      <Button 
        variant="contained" 
        size="large" 
        color="primary" 
        sx={{ mt: 2 }}
        onClick={handleGetStarted}
      >
        To Survey List
      </Button>
    </Box>

    {/* Features Section */}
    <Box sx={{ my: 8 }}>
      <Typography variant="h4" component="h2" textAlign="center" mb={4}>
        Key Features
      </Typography>
      <Grid container spacing={4}>
        {[
          { title: 'Polling Management', description: 'CURD operations for polling' },
          { title: 'Result Analysis', description: 'visualise your polling result' }
        ].map((feature, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Container>
);
};

export default WelcomePage;