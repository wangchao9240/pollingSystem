import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setError, setLoading } from '../store/authSlice';
import axiosInstance from '../axiosConfig';
import { Button, Input } from '@mui/material';
import { useAlert } from '../components/Alert';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((state) => state.auth);
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email === '' || formData.password === '') {
      showAlert('Please fill all fields.', 'info', 2000);
      return;
    }

    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.post('/api/auth/login', formData);
      showAlert('Login successful.', 'success', 2000);
      setTimeout(() => {
        dispatch(setUser(response.data));
        navigate('/surverList');
      }, 2000);
    } catch (error) {
      dispatch(setError(error.message));
      showAlert('Invalid email or password. Please try again.', 'info', 2000);
    } finally {
      dispatch(setLoading(false));
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
        <Button loading={loading} type="submit" variant='contained' className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
