import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import axiosInstance from '../axiosConfig';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) {
        setAlertMessage('User data not available.');
        setAlertType('warning');
        return;
      }
      setLoading(true);
      setAlertMessage('');
      try {
        const { code, data, message } = await axiosInstance.get('/api/auth/profile');
        if (code !== 200) {
          setAlertMessage(message || 'Failed to fetch profile.');
          setAlertType('warning');
          return;
        }
        setFormData((prev) => ({
          ...prev,
          name: data.name,
          email: data.email,
        }));
      } catch (error) {
        setAlertMessage(`Server Error: ${error.message || error}`);
        setAlertType('error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token) return;
    setLoading(true);
    setAlertMessage('');

    const payload = {
      name: formData.name,
      email: formData.email,
    };
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setAlertMessage('Current password is required to set a new password.');
        setAlertType('warning');
        setLoading(false);
        return;
      }
      payload.currentPassword = formData.currentPassword;
      payload.newPassword = formData.newPassword;
    } else if (formData.currentPassword) {
      setAlertMessage('New password is required if current password is provided.');
      setAlertType('warning');
      setLoading(false);
      return;
    }

    try {
      const { code, data, message } = await axiosInstance.put('/api/auth/profile', payload);

      if (code !== 200) {
        setAlertMessage(message || 'Failed to update profile.');
        setAlertType(code === 401 ? 'warning' : 'error');
      } else {
        setAlertMessage(message || 'Profile updated successfully.');
        setAlertType('success');

        if (data && (data.name !== user.name || data.email !== user.email || data.token)) {
          dispatch(setUser({ ...user, name: data.name, email: data.email, token: data.token || user.token }));
        }

        setFormData((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
        }));
      }
    } catch (error) {
      setAlertMessage(`Server Error: ${error.message || error}`);
      setAlertType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlertMessage('');
  };

  if (loading && !alertMessage) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 500,
          mx: 'auto',
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Profile
        </Typography>

        {alertMessage && (
          <Alert
            severity={alertType}
            sx={{ width: '100%', mb: 3 }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleCloseAlert}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {alertMessage}
          </Alert>
        )}

        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          variant="outlined"
          required
          disabled={!user}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          variant="outlined"
          required
          disabled={!user}
        />
        <TextField
          label="Current password"
          name="currentPassword"
          type="password"
          placeholder="Enter your current password"
          value={formData.currentPassword}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#f59e0b',
            },
          }}
          disabled={!user}
        />
        <TextField
          label="New password"
          name="newPassword"
          type="password"
          placeholder="Enter your new password"
          value={formData.newPassword}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          variant="outlined"
          disabled={!user}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading || !user}
          sx={{
            mt: 3,
            py: 1.5,
            px: 5,
            borderRadius: '20px',
            textTransform: 'none',
            fontSize: '1rem',
            backgroundColor: '#3b82f6',
            '&:hover': {
              backgroundColor: '#2563eb',
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Update'}
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;
