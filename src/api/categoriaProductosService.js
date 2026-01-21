/**
 * Servicio API para Categorías de Productos
 * 
 * Maneja todas las operaciones CRUD relacionadas con categorías de productos:
 * - Obtener listado de categorías
 * - Crear nueva categoría
 * - Actualizar categoría existente
 * - Eliminar categoría
 * - Buscar categorías
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/categoria-productos';

/**
 * Obtiene todas las categorías de productos
 * @returns {Promise} Lista de categorías
 */
export const getAllCategorias = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene una categoría por su ID
 * @param {number} id - ID de la categoría
 * @returns {Promise} Datos de la categoría
 */
export const getCategoriaById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Crea una nueva categoría
 * @param {Object} data - Datos de la categoría
 * @returns {Promise} Categoría creada
 */
export const createCategoria = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Actualiza una categoría existente
 * @param {number} id - ID de la categoría
 * @param {Object} data - Datos actualizados
 * @returns {Promise} Categoría actualizada
 */
export const updateCategoria = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Elimina una categoría
 * @param {number} id - ID de la categoría
 * @returns {Promise} Confirmación de eliminación
 */
export const deleteCategoria = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Busca categorías por nombre
 * @param {string} nombre - Nombre a buscar
 * @returns {Promise} Lista de categorías encontradas
 */
export const searchCategorias = async (nombre) => {
  const response = await axiosInstance.get(`${ENDPOINT}/search`, {
    params: { nombre }
  });
  return response.data;
};
