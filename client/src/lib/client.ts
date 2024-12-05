import axios from 'axios';

// Create an axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default apiClient;
