/**
 * Servicio API para Detalle de Pedidos
 * 
 * Maneja todas las operaciones relacionadas con los detalles de pedidos:
 * - Obtener detalles de un pedido
 * - Crear detalle de pedido
 * - Actualizar detalle de pedido
 * - Eliminar detalle de pedido
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/detalle-pedidos';

/**
 * Obtiene todos los detalles de pedidos
 * @returns {Promise} Lista de detalles
 */
export const getAllDetallePedidos = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene detalles de un pedido específico
 * @param {number} pedidoId - ID del pedido
 * @returns {Promise} Detalles del pedido
 */
export const getDetalleByPedidoId = async (pedidoId) => {
  const response = await axiosInstance.get(`${ENDPOINT}/pedido/${pedidoId}`);
  return response.data;
};

/**
 * Obtiene un detalle por su ID
 * @param {number} id - ID del detalle
 * @returns {Promise} Datos del detalle
 */
export const getDetallePedidoById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Crea un nuevo detalle de pedido
 * @param {Object} data - Datos del detalle
 * @returns {Promise} Detalle creado
 */
export const createDetallePedido = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Actualiza un detalle de pedido
 * @param {number} id - ID del detalle
 * @param {Object} data - Datos actualizados
 * @returns {Promise} Detalle actualizado
 */
export const updateDetallePedido = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Elimina un detalle de pedido
 * @param {number} id - ID del detalle
 * @returns {Promise} Confirmación de eliminación
 */
export const deleteDetallePedido = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};
