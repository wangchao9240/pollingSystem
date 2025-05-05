import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Icon,
} from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LayersIcon from '@mui/icons-material/Layers';
import BarChartIcon from '@mui/icons-material/BarChart';
import axiosInstance from '../axiosConfig';

const StatCard = ({ icon, title, value, loading }) => (
  <Card
    sx={{
      height: '100%',
      textAlign: 'center',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    }}
  >
    <CardContent
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Icon component={icon} sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 500 }}>
        {title}
      </Typography>
      <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>
        {loading ? <CircularProgress size={24} /> : value}
      </Typography>
    </CardContent>
  </Card>
);

const WelcomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeSurveys: 0,
    totalSurveys: 0,
    totalResponses: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const { code, data, message } = await axiosInstance.get('/api/survey/stats');
      if (code === 200) {
        setStats(data);
      } else {
        window.$toast(message || 'Failed to fetch stats', 'error', 2000);
      }
    } catch (error) {
      window.$toast(`Server Error: ${error.message || error}`, 'error', 2000);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleCreateSurvey = () => {
    navigate('/surveyList', { state: { openCreateDialog: true } });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome!
        </Typography>
        <Typography variant="h5" component="p" color="text.secondary" sx={{ mb: 1 }}>
          Let's manage your surveys.
        </Typography>
        <Typography variant="body1" component="p" color="text.secondary" sx={{ mb: 4 }}>
          Create, view, and track your surveys with ease.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 8 }}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={handleCreateSurvey}
            sx={{ borderRadius: '20px', px: 3 }}
          >
            Create new survey
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="primary"
            onClick={() => handleNavigate('/surveyList')}
            sx={{ borderRadius: '20px', px: 3 }}
          >
            View all surveys
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={ListAltIcon}
            title="Active surveys"
            value={stats.activeSurveys}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={LayersIcon}
            title="Total surveys"
            value={stats.totalSurveys}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={BarChartIcon}
            title="Total responses"
            value={stats.totalResponses}
            loading={loading}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default WelcomePage;