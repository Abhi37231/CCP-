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

export default api;
