/**
 * Servicio API para Entradas y Salidas de Inventario
 * 
 * Maneja todas las operaciones relacionadas con movimientos de inventario:
 * - Registrar entrada de productos
 * - Registrar salida de productos
 * - Obtener historial de movimientos
 * - Consultar movimientos por producto
 * - Consultar movimientos por fecha
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/entradas-salidas';

/**
 * Obtiene todos los movimientos de inventario
 * @returns {Promise} Lista de movimientos
 */
export const getAllMovimientos = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene un movimiento por su ID
 * @param {number} id - ID del movimiento
 * @returns {Promise} Datos del movimiento
 */
export const getMovimientoById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Registra un nuevo movimiento de inventario
 * @param {Object} data - Datos del movimiento
 * @returns {Promise} Movimiento registrado
 */
export const createMovimiento = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Obtiene movimientos por producto
 * @param {number} productoId - ID del producto
 * @returns {Promise} Lista de movimientos del producto
 */
export const getMovimientosByProducto = async (productoId) => {
  const response = await axiosInstance.get(`${ENDPOINT}/producto/${productoId}`);
  return response.data;
};

/**
 * Obtiene movimientos por rango de fechas
 * @param {string} fechaInicio - Fecha inicial
 * @param {string} fechaFin - Fecha final
 * @returns {Promise} Lista de movimientos en el rango
 */
export const getMovimientosByFecha = async (fechaInicio, fechaFin) => {
  const response = await axiosInstance.get(`${ENDPOINT}/fecha`, {
    params: { fechaInicio, fechaFin }
  });
  return response.data;
};

/**
 * Obtiene movimientos por tipo (entrada/salida)
 * @param {string} tipo - Tipo de movimiento ('entrada' o 'salida')
 * @returns {Promise} Lista de movimientos del tipo especificado
 */
export const getMovimientosByTipo = async (tipo) => {
  const response = await axiosInstance.get(`${ENDPOINT}/tipo`, {
    params: { tipo }
  });
  return response.data;
};
