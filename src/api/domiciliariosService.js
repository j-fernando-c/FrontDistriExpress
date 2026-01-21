/**
 * Servicio API para Domiciliarios
 * 
 * Maneja todas las operaciones CRUD relacionadas con domiciliarios:
 * - Obtener listado de domiciliarios
 * - Crear nuevo domiciliario
 * - Actualizar domiciliario existente
 * - Eliminar domiciliario
 * - Buscar domiciliarios disponibles
 * - Obtener domiciliarios por zona
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/domiciliarios';

/**
 * Obtiene todos los domiciliarios
 * @returns {Promise} Lista de domiciliarios
 */
export const getAllDomiciliarios = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene un domiciliario por su ID
 * @param {number} id - ID del domiciliario
 * @returns {Promise} Datos del domiciliario
 */
export const getDomiciliarioById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Crea un nuevo domiciliario
 * @param {Object} data - Datos del domiciliario
 * @returns {Promise} Domiciliario creado
 */
export const createDomiciliario = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Actualiza un domiciliario existente
 * @param {number} id - ID del domiciliario
 * @param {Object} data - Datos actualizados
 * @returns {Promise} Domiciliario actualizado
 */
export const updateDomiciliario = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Elimina un domiciliario
 * @param {number} id - ID del domiciliario
 * @returns {Promise} Confirmación de eliminación
 */
export const deleteDomiciliario = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Obtiene domiciliarios disponibles
 * @returns {Promise} Lista de domiciliarios disponibles
 */
export const getDomiciliariosDisponibles = async () => {
  const response = await axiosInstance.get(`${ENDPOINT}/disponibles`);
  return response.data;
};

/**
 * Obtiene domiciliarios por zona
 * @param {number} zonaId - ID de la zona
 * @returns {Promise} Lista de domiciliarios en la zona
 */
export const getDomiciliariosByZona = async (zonaId) => {
  const response = await axiosInstance.get(`${ENDPOINT}/zona/${zonaId}`);
  return response.data;
};
