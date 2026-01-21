/**
 * Servicio API para Ventas
 * 
 * Maneja todas las operaciones CRUD relacionadas con ventas:
 * - Obtener listado de ventas
 * - Crear nueva venta
 * - Actualizar venta existente
 * - Eliminar venta
 * - Obtener ventas por cliente
 * - Obtener ventas por fecha
 * - Obtener ventas por estado
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/ventas';

/**
 * Obtiene todas las ventas
 * @returns {Promise} Lista de ventas
 */
export const getAllVentas = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene una venta por su ID
 * @param {number} id - ID de la venta
 * @returns {Promise} Datos de la venta
 */
export const getVentaById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Crea una nueva venta
 * @param {Object} data - Datos de la venta
 * @returns {Promise} Venta creada
 */
export const createVenta = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Actualiza una venta existente
 * @param {number} id - ID de la venta
 * @param {Object} data - Datos actualizados
 * @returns {Promise} Venta actualizada
 */
export const updateVenta = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Elimina una venta
 * @param {number} id - ID de la venta
 * @returns {Promise} Confirmación de eliminación
 */
export const deleteVenta = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Obtiene ventas por cliente
 * @param {number} clienteId - ID del cliente
 * @returns {Promise} Lista de ventas del cliente
 */
export const getVentasByCliente = async (clienteId) => {
  const response = await axiosInstance.get(`${ENDPOINT}/cliente/${clienteId}`);
  return response.data;
};

/**
 * Obtiene ventas por rango de fechas
 * @param {string} fechaInicio - Fecha inicial
 * @param {string} fechaFin - Fecha final
 * @returns {Promise} Lista de ventas en el rango
 */
export const getVentasByFecha = async (fechaInicio, fechaFin) => {
  const response = await axiosInstance.get(`${ENDPOINT}/fecha`, {
    params: { fechaInicio, fechaFin }
  });
  return response.data;
};

/**
 * Obtiene ventas por estado
 * @param {number} estadoId - ID del estado
 * @returns {Promise} Lista de ventas con el estado especificado
 */
export const getVentasByEstado = async (estadoId) => {
  const response = await axiosInstance.get(`${ENDPOINT}/estado/${estadoId}`);
  return response.data;
};
