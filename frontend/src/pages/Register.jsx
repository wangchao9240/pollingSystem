import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { Button, Input } from '@mui/material';
import { useAlert } from '../context/AlertContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name === '' || formData.email === '' || formData.password === '') {
      showAlert('Please fill all fields.', 'info', 2000);
      return;
    }
    try {
      const { code, message } = await axiosInstance.post('/api/auth/register', formData);
      if (code !== 200) {
        showAlert(message, 'info', 2000);
        return;
      }
      showAlert('Registration successful. Please log in.', 'success', 2000);
      setTimeout(() => {
        navigate('/login');
      }
      , 2000);
    } catch (error) {
      showAlert(`Server Error: ${error}`, 'info', 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        <Input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
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
        <Button type="submit" variant='contained' className="w-full bg-green-600 text-white p-2 rounded">
          Register
        </Button>
      </form>
    </div>
  );
};

export default Register;
