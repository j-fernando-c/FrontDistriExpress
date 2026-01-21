/**
 * Servicio API para Pérdidas
 * 
 * Maneja todas las operaciones CRUD relacionadas con pérdidas de productos:
 * - Obtener listado de pérdidas
 * - Registrar nueva pérdida
 * - Actualizar pérdida existente
 * - Eliminar pérdida
 * - Obtener pérdidas por producto
 * - Obtener pérdidas por fecha
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/perdidas';

/**
 * Obtiene todas las pérdidas
 * @returns {Promise} Lista de pérdidas
 */
export const getAllPerdidas = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene una pérdida por su ID
 * @param {number} id - ID de la pérdida
 * @returns {Promise} Datos de la pérdida
 */
export const getPerdidaById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Registra una nueva pérdida
 * @param {Object} data - Datos de la pérdida
 * @returns {Promise} Pérdida registrada
 */
export const createPerdida = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Actualiza una pérdida existente
 * @param {number} id - ID de la pérdida
 * @param {Object} data - Datos actualizados
 * @returns {Promise} Pérdida actualizada
 */
export const updatePerdida = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Elimina una pérdida
 * @param {number} id - ID de la pérdida
 * @returns {Promise} Confirmación de eliminación
 */
export const deletePerdida = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Obtiene pérdidas por producto
 * @param {number} productoId - ID del producto
 * @returns {Promise} Lista de pérdidas del producto
 */
export const getPerdidasByProducto = async (productoId) => {
  const response = await axiosInstance.get(`${ENDPOINT}/producto/${productoId}`);
  return response.data;
};

/**
 * Obtiene pérdidas por rango de fechas
 * @param {string} fechaInicio - Fecha inicial
 * @param {string} fechaFin - Fecha final
 * @returns {Promise} Lista de pérdidas en el rango
 */
export const getPerdidasByFecha = async (fechaInicio, fechaFin) => {
  const response = await axiosInstance.get(`${ENDPOINT}/fecha`, {
    params: { fechaInicio, fechaFin }
  });
  return response.data;
};
