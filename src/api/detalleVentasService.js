/**
 * Servicio API para Detalle de Ventas
 * 
 * Maneja todas las operaciones relacionadas con los detalles de ventas:
 * - Obtener detalles de una venta
 * - Crear detalle de venta
 * - Actualizar detalle de venta
 * - Eliminar detalle de venta
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/detalle-ventas';

/**
 * Obtiene todos los detalles de ventas
 * @returns {Promise} Lista de detalles
 */
export const getAllDetalleVentas = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene detalles de una venta específica
 * @param {number} ventaId - ID de la venta
 * @returns {Promise} Detalles de la venta
 */
export const getDetalleByVentaId = async (ventaId) => {
  const response = await axiosInstance.get(`${ENDPOINT}/venta/${ventaId}`);
  return response.data;
};

/**
 * Obtiene un detalle por su ID
 * @param {number} id - ID del detalle
 * @returns {Promise} Datos del detalle
 */
export const getDetalleVentaById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Crea un nuevo detalle de venta
 * @param {Object} data - Datos del detalle
 * @returns {Promise} Detalle creado
 */
export const createDetalleVenta = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Actualiza un detalle de venta
 * @param {number} id - ID del detalle
 * @param {Object} data - Datos actualizados
 * @returns {Promise} Detalle actualizado
 */
export const updateDetalleVenta = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Elimina un detalle de venta
 * @param {number} id - ID del detalle
 * @returns {Promise} Confirmación de eliminación
 */
export const deleteDetalleVenta = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};
