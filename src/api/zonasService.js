/**
 * Servicio API para Zonas
 * 
 * Maneja todas las operaciones CRUD relacionadas con zonas de distribución:
 * - Obtener listado de zonas
 * - Crear nueva zona
 * - Actualizar zona existente
 * - Eliminar zona
 * - Buscar zonas
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/zonas';

/**
 * Obtiene todas las zonas
 * @returns {Promise} Lista de zonas
 */
export const getAllZonas = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene una zona por su ID
 * @param {number} id - ID de la zona
 * @returns {Promise} Datos de la zona
 */
export const getZonaById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Crea una nueva zona
 * @param {Object} data - Datos de la zona
 * @returns {Promise} Zona creada
 */
export const createZona = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Actualiza una zona existente
 * @param {number} id - ID de la zona
 * @param {Object} data - Datos actualizados
 * @returns {Promise} Zona actualizada
 */
export const updateZona = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Elimina una zona
 * @param {number} id - ID de la zona
 * @returns {Promise} Confirmación de eliminación
 */
export const deleteZona = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Busca zonas por nombre
 * @param {string} nombre - Nombre a buscar
 * @returns {Promise} Lista de zonas encontradas
 */
export const searchZonas = async (nombre) => {
  const response = await axiosInstance.get(`${ENDPOINT}/search`, {
    params: { nombre }
  });
  return response.data;
};
