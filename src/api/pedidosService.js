/**
 * Servicio API para Pedidos
 * 
 * Maneja todas las operaciones CRUD relacionadas con pedidos:
 * - Obtener listado de pedidos
 * - Crear nuevo pedido
 * - Actualizar pedido existente
 * - Eliminar pedido
 * - Obtener pedidos por cliente
 * - Obtener pedidos por estado
 * - Obtener pedidos por fecha
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/pedidos';

/**
 * Obtiene todos los pedidos
 * @returns {Promise} Lista de pedidos
 */
export const getAllPedidos = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene un pedido por su ID
 * @param {number} id - ID del pedido
 * @returns {Promise} Datos del pedido
 */
export const getPedidoById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Crea un nuevo pedido
 * @param {Object} data - Datos del pedido
 * @returns {Promise} Pedido creado
 */
export const createPedido = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Actualiza un pedido existente
 * @param {number} id - ID del pedido
 * @param {Object} data - Datos actualizados
 * @returns {Promise} Pedido actualizado
 */
export const updatePedido = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Elimina un pedido
 * @param {number} id - ID del pedido
 * @returns {Promise} Confirmación de eliminación
 */
export const deletePedido = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Obtiene pedidos por cliente
 * @param {number} clienteId - ID del cliente
 * @returns {Promise} Lista de pedidos del cliente
 */
export const getPedidosByCliente = async (clienteId) => {
  const response = await axiosInstance.get(`${ENDPOINT}/cliente/${clienteId}`);
  return response.data;
};

/**
 * Obtiene pedidos por estado
 * @param {string} estado - Estado del pedido
 * @returns {Promise} Lista de pedidos con el estado especificado
 */
export const getPedidosByEstado = async (estado) => {
  const response = await axiosInstance.get(`${ENDPOINT}/estado`, {
    params: { estado }
  });
  return response.data;
};

/**
 * Obtiene pedidos por rango de fechas
 * @param {string} fechaInicio - Fecha inicial
 * @param {string} fechaFin - Fecha final
 * @returns {Promise} Lista de pedidos en el rango
 */
export const getPedidosByFecha = async (fechaInicio, fechaFin) => {
  const response = await axiosInstance.get(`${ENDPOINT}/fecha`, {
    params: { fechaInicio, fechaFin }
  });
  return response.data;
};
