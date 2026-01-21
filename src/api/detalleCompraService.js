/**
 * Servicio API para Detalle de Compras
 * 
 * Maneja todas las operaciones relacionadas con los detalles de compras:
 * - Obtener detalles de una compra
 * - Crear detalle de compra
 * - Actualizar detalle de compra
 * - Eliminar detalle de compra
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/detalle-compra';

/**
 * Obtiene todos los detalles de compra
 * @returns {Promise} Lista de detalles
 */
export const getAllDetalleCompra = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene detalles de una compra específica
 * @param {number} compraId - ID de la compra
 * @returns {Promise} Detalles de la compra
 */
export const getDetalleByCompraId = async (compraId) => {
  const response = await axiosInstance.get(`${ENDPOINT}/compra/${compraId}`);
  return response.data;
};

/**
 * Obtiene un detalle por su ID
 * @param {number} id - ID del detalle
 * @returns {Promise} Datos del detalle
 */
export const getDetalleCompraById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Crea un nuevo detalle de compra
 * @param {Object} data - Datos del detalle
 * @returns {Promise} Detalle creado
 */
export const createDetalleCompra = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Actualiza un detalle de compra
 * @param {number} id - ID del detalle
 * @param {Object} data - Datos actualizados
 * @returns {Promise} Detalle actualizado
 */
export const updateDetalleCompra = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Elimina un detalle de compra
 * @param {number} id - ID del detalle
 * @returns {Promise} Confirmación de eliminación
 */
export const deleteDetalleCompra = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};
