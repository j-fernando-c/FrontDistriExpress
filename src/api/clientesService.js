/**
 * Servicio API para Clientes
 * 
 * Maneja todas las operaciones CRUD relacionadas con clientes:
 * - Obtener listado de clientes
 * - Crear nuevo cliente
 * - Actualizar cliente existente
 * - Eliminar cliente
 * - Buscar clientes
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/clientes';

/**
 * Obtiene todos los clientes
 * @returns {Promise} Lista de clientes
 */
export const getAllClientes = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene un cliente por su ID
 * @param {number} id - ID del cliente
 * @returns {Promise} Datos del cliente
 */
export const getClienteById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Crea un nuevo cliente
 * @param {Object} data - Datos del cliente
 * @returns {Promise} Cliente creado
 */
export const createCliente = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Actualiza un cliente existente
 * @param {number} id - ID del cliente
 * @param {Object} data - Datos actualizados
 * @returns {Promise} Cliente actualizado
 */
export const updateCliente = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Elimina un cliente
 * @param {number} id - ID del cliente
 * @returns {Promise} Confirmación de eliminación
 */
export const deleteCliente = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Busca clientes por nombre o documento
 * @param {string} query - Término de búsqueda
 * @returns {Promise} Lista de clientes encontrados
 */
export const searchClientes = async (query) => {
  const response = await axiosInstance.get(`${ENDPOINT}/search`, {
    params: { query }
  });
  return response.data;
};
