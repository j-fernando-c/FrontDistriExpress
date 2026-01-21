/**
 * Servicio API para Rutas
 * 
 * Maneja todas las operaciones CRUD relacionadas con rutas de distribución:
 * - Obtener listado de rutas
 * - Crear nueva ruta
 * - Actualizar ruta existente
 * - Eliminar ruta
 * - Obtener rutas por zona
 * - Obtener rutas activas
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/rutas';

/**
 * Obtiene todas las rutas
 * @returns {Promise} Lista de rutas
 */
export const getAllRutas = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene una ruta por su ID
 * @param {number} id - ID de la ruta
 * @returns {Promise} Datos de la ruta
 */
export const getRutaById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Crea una nueva ruta
 * @param {Object} data - Datos de la ruta
 * @returns {Promise} Ruta creada
 */
export const createRuta = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Actualiza una ruta existente
 * @param {number} id - ID de la ruta
 * @param {Object} data - Datos actualizados
 * @returns {Promise} Ruta actualizada
 */
export const updateRuta = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Elimina una ruta
 * @param {number} id - ID de la ruta
 * @returns {Promise} Confirmación de eliminación
 */
export const deleteRuta = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Obtiene rutas por zona
 * @param {number} zonaId - ID de la zona
 * @returns {Promise} Lista de rutas de la zona
 */
export const getRutasByZona = async (zonaId) => {
  const response = await axiosInstance.get(`${ENDPOINT}/zona/${zonaId}`);
  return response.data;
};

/**
 * Obtiene rutas activas
 * @returns {Promise} Lista de rutas activas
 */
export const getRutasActivas = async () => {
  const response = await axiosInstance.get(`${ENDPOINT}/activas`);
  return response.data;
};
