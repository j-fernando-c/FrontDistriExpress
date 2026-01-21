/**
 * Servicio API para Compras
 * 
 * Maneja todas las operaciones CRUD relacionadas con compras:
 * - Obtener listado de compras
 * - Crear nueva compra
 * - Actualizar compra existente
 * - Eliminar compra
 * - Obtener compras por proveedor
 * - Obtener compras por rango de fechas
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/compras';

/**
 * Obtiene todas las compras
 * @returns {Promise} Lista de compras
 */
export const getAllCompras = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene una compra por su ID
 * @param {number} id - ID de la compra
 * @returns {Promise} Datos de la compra
 */
export const getCompraById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Crea una nueva compra
 * @param {Object} data - Datos de la compra
 * @returns {Promise} Compra creada
 */
export const createCompra = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Actualiza una compra existente
 * @param {number} id - ID de la compra
 * @param {Object} data - Datos actualizados
 * @returns {Promise} Compra actualizada
 */
export const updateCompra = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Elimina una compra
 * @param {number} id - ID de la compra
 * @returns {Promise} Confirmación de eliminación
 */
export const deleteCompra = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Obtiene compras por proveedor
 * @param {number} proveedorId - ID del proveedor
 * @returns {Promise} Lista de compras del proveedor
 */
export const getComprasByProveedor = async (proveedorId) => {
  const response = await axiosInstance.get(`${ENDPOINT}/proveedor/${proveedorId}`);
  return response.data;
};

/**
 * Obtiene compras por rango de fechas
 * @param {string} fechaInicio - Fecha inicial
 * @param {string} fechaFin - Fecha final
 * @returns {Promise} Lista de compras en el rango
 */
export const getComprasByFecha = async (fechaInicio, fechaFin) => {
  const response = await axiosInstance.get(`${ENDPOINT}/fecha`, {
    params: { fechaInicio, fechaFin }
  });
  return response.data;
};
