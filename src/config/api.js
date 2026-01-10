import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      return Promise.reject({
        status,
        message: data.message || 'Error en la solicitud',
        errors: data.errors || null,
      });
    } else if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'No se pudo conectar con el servidor',
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;
