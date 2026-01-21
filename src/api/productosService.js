/**
 * Servicio API para Productos
 * 
 * Maneja todas las operaciones CRUD relacionadas con productos:
 * - Obtener listado de productos
 * - Crear nuevo producto
 * - Actualizar producto existente
 * - Eliminar producto
 * - Buscar productos
 * - Obtener productos por categoría
 * - Obtener productos con stock bajo
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/productos';

/**
 * Obtiene todos los productos
 * @returns {Promise} Lista de productos
 */
export const getAllProductos = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene un producto por su ID
 * @param {number} id - ID del producto
 * @returns {Promise} Datos del producto
 */
export const getProductoById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Crea un nuevo producto
 * @param {Object} data - Datos del producto
 * @returns {Promise} Producto creado
 */
export const createProducto = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Actualiza un producto existente
 * @param {number} id - ID del producto
 * @param {Object} data - Datos actualizados
 * @returns {Promise} Producto actualizado
 */
export const updateProducto = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Elimina un producto
 * @param {number} id - ID del producto
 * @returns {Promise} Confirmación de eliminación
 */
export const deleteProducto = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Busca productos por nombre o código
 * @param {string} query - Término de búsqueda
 * @returns {Promise} Lista de productos encontrados
 */
export const searchProductos = async (query) => {
  const response = await axiosInstance.get(`${ENDPOINT}/search`, {
    params: { query }
  });
  return response.data;
};

/**
 * Obtiene productos por categoría
 * @param {number} categoriaId - ID de la categoría
 * @returns {Promise} Lista de productos de la categoría
 */
export const getProductosByCategoria = async (categoriaId) => {
  const response = await axiosInstance.get(`${ENDPOINT}/categoria/${categoriaId}`);
  return response.data;
};

/**
 * Obtiene productos con stock bajo
 * @returns {Promise} Lista de productos con stock bajo
 */
export const getProductosStockBajo = async () => {
  const response = await axiosInstance.get(`${ENDPOINT}/stock-bajo`);
  return response.data;
};
