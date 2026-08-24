import axios from 'axios';

let baseURL = 'http://localhost:5000/api';
if (import.meta.env.VITE_API_URL) {
  let url = import.meta.env.VITE_API_URL;
  url = url.replace(/\/+$/, ''); // Remove trailing slashes
  if (!url.endsWith('/api')) {
    url += '/api';
  }
  baseURL = url;
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
