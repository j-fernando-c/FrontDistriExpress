/**
 * Servicio API para Cronogramas
 * 
 * Maneja todas las operaciones CRUD relacionadas con cronogramas de rutas:
 * - Obtener listado de cronogramas
 * - Crear nuevo cronograma
 * - Actualizar cronograma existente
 * - Eliminar cronograma
 * - Obtener cronogramas por ruta
 * - Obtener cronogramas por fecha
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/cronogramas';

/**
 * Obtiene todos los cronogramas
 * @returns {Promise} Lista de cronogramas
 */
export const getAllCronogramas = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene un cronograma por su ID
 * @param {number} id - ID del cronograma
 * @returns {Promise} Datos del cronograma
 */
export const getCronogramaById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Crea un nuevo cronograma
 * @param {Object} data - Datos del cronograma
 * @returns {Promise} Cronograma creado
 */
export const createCronograma = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Actualiza un cronograma existente
 * @param {number} id - ID del cronograma
 * @param {Object} data - Datos actualizados
 * @returns {Promise} Cronograma actualizado
 */
export const updateCronograma = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Elimina un cronograma
 * @param {number} id - ID del cronograma
 * @returns {Promise} Confirmación de eliminación
 */
export const deleteCronograma = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Obtiene cronogramas por ruta
 * @param {number} rutaId - ID de la ruta
 * @returns {Promise} Lista de cronogramas de la ruta
 */
export const getCronogramasByRuta = async (rutaId) => {
  const response = await axiosInstance.get(`${ENDPOINT}/ruta/${rutaId}`);
  return response.data;
};

/**
 * Obtiene cronogramas por fecha
 * @param {string} fecha - Fecha a consultar
 * @returns {Promise} Lista de cronogramas en la fecha
 */
export const getCronogramasByFecha = async (fecha) => {
  const response = await axiosInstance.get(`${ENDPOINT}/fecha`, {
    params: { fecha }
  });
  return response.data;
};
