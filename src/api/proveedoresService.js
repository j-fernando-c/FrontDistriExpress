/**
 * Servicio API para Proveedores
 * 
 * Maneja todas las operaciones CRUD relacionadas con proveedores:
 * - Obtener listado de proveedores
 * - Crear nuevo proveedor
 * - Actualizar proveedor existente
 * - Eliminar proveedor
 * - Buscar proveedores
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/proveedores';

/**
 * Obtiene todos los proveedores
 * @returns {Promise} Lista de proveedores
 */
export const getAllProveedores = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene un proveedor por su ID
 * @param {number} id - ID del proveedor
 * @returns {Promise} Datos del proveedor
 */
export const getProveedorById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Crea un nuevo proveedor
 * @param {Object} data - Datos del proveedor
 * @returns {Promise} Proveedor creado
 */
export const createProveedor = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Actualiza un proveedor existente
 * @param {number} id - ID del proveedor
 * @param {Object} data - Datos actualizados
 * @returns {Promise} Proveedor actualizado
 */
export const updateProveedor = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Elimina un proveedor
 * @param {number} id - ID del proveedor
 * @returns {Promise} Confirmación de eliminación
 */
export const deleteProveedor = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Busca proveedores por nombre o NIT
 * @param {string} query - Término de búsqueda
 * @returns {Promise} Lista de proveedores encontrados
 */
export const searchProveedores = async (query) => {
  const response = await axiosInstance.get(`${ENDPOINT}/search`, {
    params: { query }
  });
  return response.data;
};
