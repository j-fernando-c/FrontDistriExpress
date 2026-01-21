/**
 * Servicio API para Usuarios
 * 
 * Maneja todas las operaciones relacionadas con usuarios y autenticación:
 * - Login y logout
 * - Registro de usuarios
 * - Obtener listado de usuarios
 * - Actualizar perfil de usuario
 * - Cambiar contraseña
 * - Gestión de usuarios
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/usuarios';

/**
 * Inicia sesión de usuario
 * @param {Object} credentials - Credenciales (email, password)
 * @returns {Promise} Datos de autenticación (token, usuario)
 */
export const login = async (credentials) => {
  const response = await axiosInstance.post(`${ENDPOINT}/login`, credentials);
  return response.data;
};

/**
 * Cierra sesión de usuario
 * @returns {Promise} Confirmación de cierre de sesión
 */
export const logout = async () => {
  const response = await axiosInstance.post(`${ENDPOINT}/logout`);
  return response.data;
};

/**
 * Registra un nuevo usuario
 * @param {Object} data - Datos del usuario
 * @returns {Promise} Usuario registrado
 */
export const register = async (data) => {
  const response = await axiosInstance.post(`${ENDPOINT}/register`, data);
  return response.data;
};

/**
 * Obtiene todos los usuarios
 * @returns {Promise} Lista de usuarios
 */
export const getAllUsuarios = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene un usuario por su ID
 * @param {number} id - ID del usuario
 * @returns {Promise} Datos del usuario
 */
export const getUsuarioById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Obtiene el perfil del usuario autenticado
 * @returns {Promise} Datos del usuario autenticado
 */
export const getProfile = async () => {
  const response = await axiosInstance.get(`${ENDPOINT}/profile`);
  return response.data;
};

/**
 * Crea un nuevo usuario
 * @param {Object} data - Datos del usuario
 * @returns {Promise} Usuario creado
 */
export const createUsuario = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Actualiza un usuario existente
 * @param {number} id - ID del usuario
 * @param {Object} data - Datos actualizados
 * @returns {Promise} Usuario actualizado
 */
export const updateUsuario = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Elimina un usuario
 * @param {number} id - ID del usuario
 * @returns {Promise} Confirmación de eliminación
 */
export const deleteUsuario = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Cambia la contraseña del usuario
 * @param {Object} data - Contraseña actual y nueva contraseña
 * @returns {Promise} Confirmación de cambio
 */
export const changePassword = async (data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/change-password`, data);
  return response.data;
};

/**
 * Busca usuarios por nombre o email
 * @param {string} query - Término de búsqueda
 * @returns {Promise} Lista de usuarios encontrados
 */
export const searchUsuarios = async (query) => {
  const response = await axiosInstance.get(`${ENDPOINT}/search`, {
    params: { query }
  });
  return response.data;
};
