import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Input } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading } from '../store/authSlice';
import axiosInstance from '../axiosConfig';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email === '' || formData.password === '') {
      window.$toast('Please fill all fields.', 'info', 2000);
      return;
    }

    try {
      dispatch(setLoading(true));
      const { code, data, message } = await axiosInstance.post('/api/auth/login', formData);
      if (code !== 200) {
        window.$toast(message, 'info', 2000);
        return;
      }
      window.$toast('Login successful.', 'success', 2000);
      setTimeout(() => {
        dispatch(setUser(data));
        navigate('/');
      }, 2000);
    } catch (error) {
      window.$toast(`Server Error: ${error}`, 'info', 2000);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Box
      sx={{
        margin: '-20px',
        minHeight: '100vh',
        position: 'relative',
        backgroundImage: 'url(/assets/images/2.png)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 4
      }}
    >
      <Paper
        elevation={6}
        sx={{
          position: 'absolute',
          top: '40%', left: '57.5%',
          transform: 'translateY(-50%)',
          p: 4,
          maxWidth: 500, minHeight: 380, width: 450,
          width: '90%',
          textAlign: 'center',
          borderRadius: 4,
          backgroundColor: '#ffffff'
        }}
      >
        <Typography
          variant="h4"
          style={{
            fontFamily: "'Cooper Black', sans-serif",
            fontWeight: "bold",
            letterSpacing: "-1px",
          }}
        >Welcome Back</Typography>

        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            fullWidth
            sx={{ mb: 2, p: 1, backgroundColor: '#ffffff', borderRadius: 2 }}
          />
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            fullWidth
            sx={{ mb: 3, p: 1, backgroundColor: '#ffffff', borderRadius: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ p: 1.5, fontWeight: 'bold' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <Typography variant="body2" mt={2}>
          Don’t have an account? <a href="/register" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>Register</a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
