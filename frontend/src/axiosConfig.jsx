import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://54.79.173.237:5001', // local
  //baseURL: 'http://3.26.96.188:5001', // live
  baseURL: 'http://52.62.199.138:5001',
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
