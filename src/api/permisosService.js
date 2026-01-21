/**
 * Servicio API para Permisos
 * 
 * Maneja todas las operaciones CRUD relacionadas con permisos:
 * - Obtener listado de permisos
 * - Crear nuevo permiso
 * - Actualizar permiso existente
 * - Eliminar permiso
 * - Obtener permisos por módulo
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/permisos';

/**
 * Obtiene todos los permisos
 * @returns {Promise} Lista de permisos
 */
export const getAllPermisos = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene un permiso por su ID
 * @param {number} id - ID del permiso
 * @returns {Promise} Datos del permiso
 */
export const getPermisoById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Crea un nuevo permiso
 * @param {Object} data - Datos del permiso
 * @returns {Promise} Permiso creado
 */
export const createPermiso = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Actualiza un permiso existente
 * @param {number} id - ID del permiso
 * @param {Object} data - Datos actualizados
 * @returns {Promise} Permiso actualizado
 */
export const updatePermiso = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Elimina un permiso
 * @param {number} id - ID del permiso
 * @returns {Promise} Confirmación de eliminación
 */
export const deletePermiso = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Obtiene permisos por módulo
 * @param {string} modulo - Nombre del módulo
 * @returns {Promise} Lista de permisos del módulo
 */
export const getPermisosByModulo = async (modulo) => {
  const response = await axiosInstance.get(`${ENDPOINT}/modulo`, {
    params: { modulo }
  });
  return response.data;
};
