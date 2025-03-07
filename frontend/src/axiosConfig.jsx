import axios from 'axios';
import utils from './utils';
import { useAlert } from './context/AlertContext';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // local
  //baseURL: 'http://3.26.96.188:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
