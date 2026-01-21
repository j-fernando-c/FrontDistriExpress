/**
 * Servicio API para Estados de Venta
 * 
 * Maneja todas las operaciones CRUD relacionadas con estados de venta:
 * - Obtener listado de estados
 * - Crear nuevo estado
 * - Actualizar estado existente
 * - Eliminar estado
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/estado-venta';

/**
 * Obtiene todos los estados de venta
 * @returns {Promise} Lista de estados
 */
export const getAllEstadosVenta = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene un estado por su ID
 * @param {number} id - ID del estado
 * @returns {Promise} Datos del estado
 */
export const getEstadoVentaById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Crea un nuevo estado de venta
 * @param {Object} data - Datos del estado
 * @returns {Promise} Estado creado
 */
export const createEstadoVenta = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Actualiza un estado de venta existente
 * @param {number} id - ID del estado
 * @param {Object} data - Datos actualizados
 * @returns {Promise} Estado actualizado
 */
export const updateEstadoVenta = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Elimina un estado de venta
 * @param {number} id - ID del estado
 * @returns {Promise} Confirmación de eliminación
 */
export const deleteEstadoVenta = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};
