import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Input } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name === '' || formData.email === '' || formData.password === '') {
      window.$toast('Please fill all fields.', 'info', 2000);
      return;
    }

    try {
      const { code, message } = await axiosInstance.post('/api/auth/register', formData);
      if (code !== 200) {
        window.$toast(message, 'info', 2000);
        return;
      }
      window.$toast('Registration successful. Please log in.', 'success', 2000);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      window.$toast(`Server Error: ${error}`, 'info', 2000);
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
          top: '38%', left: '57%',
          transform: 'translateY(-50%)',
          p: 4,
          maxWidth: 500, minHeight: 450, width: 450,
          width: '90%',
          textAlign: 'center',
          borderRadius: 4,
          backgroundColor: '#ffffff'
        }}
      >
        {/* <Typography variant="h4" fontWeight="bold" mb={2}>Create Your Account</Typography> */}
        <Typography
          variant="h4"
          style={{
            fontFamily: "'Cooper Black', sans-serif",
            fontWeight: "bold",
            letterSpacing: "-1px",
          }}
        >Create your account</Typography>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Name"
            fullWidth
            sx={{ mb: 2, p: 1, backgroundColor: '#ffffff', borderRadius: 2 }}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            type="email"
            placeholder="Email"
            fullWidth
            sx={{ mb: 2, p: 1, backgroundColor: '#ffffff', borderRadius: 2 }}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Password"
            fullWidth
            sx={{ mb: 3, p: 1, backgroundColor: '#ffffff', borderRadius: 2 }}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ p: 1.5, fontWeight: 'bold' }}>
            Register
          </Button>
        </form>
        <Typography variant="body2" mt={2}>
          Already have an account? <a href="/login" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>Login</a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
