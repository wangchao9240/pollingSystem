import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { Button, Input } from '@mui/material';
import { useAlert } from '../components/Alert';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email === '' || formData.password === '') {
      showAlert('Please fill all fields.', 'info', 2000);
      return;
    }
    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      showAlert('Login successful.', 'success', 2000);
      setTimeout(() => {
        login(response.data);
        navigate('/surverList');
      }, 2000);
    } catch (error) {
      showAlert('Invalid email or password. Please try again.', 'info', 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <Button type="submit" variant='contained' className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
