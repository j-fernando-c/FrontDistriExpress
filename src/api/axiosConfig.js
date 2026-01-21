/**
 * Configuración de Axios
 * 
 * Este archivo configura la instancia de Axios con interceptores para:
 * - Agregar el token de autenticación a todas las solicitudes
 * - Manejar errores de autenticación y redireccionar al login
 * - Gestionar errores globales de la API
 */

import axios from 'axios';

// Crear instancia de axios con configuración base
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de solicitud - Agregar token de autenticación
axiosInstance.interceptors.request.use(
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

// Interceptor de respuesta - Manejar errores globales
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      switch (error.response.status) {
        case 401:
          // Token inválido o expirado
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          console.error('No tienes permisos para realizar esta acción');
          break;
        case 404:
          console.error('Recurso no encontrado');
          break;
        case 500:
          console.error('Error interno del servidor');
          break;
        default:
          console.error('Error en la solicitud:', error.response.data.message);
      }
    } else if (error.request) {
      // La solicitud fue hecha pero no hubo respuesta
      console.error('No se pudo conectar con el servidor');
    } else {
      // Algo sucedió al configurar la solicitud
      console.error('Error al configurar la solicitud:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
