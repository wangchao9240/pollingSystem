import axios from 'axios';
import utils from './utils';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_MODE === 'development' ? 'http://localhost:5001' : 'http://3.26.196.87:5001', // live
  // baseURL: 'http://3.26.196.87:5001', // live
  // baseURL: 'http://localhost:5001', // local
  // baseURL: 'http://localhost:5001',
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const user = utils.getCookie('user') ? { ...JSON.parse(utils.getCookie('user')) } : null
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
