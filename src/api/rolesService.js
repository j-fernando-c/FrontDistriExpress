/**
 * Servicio API para Roles
 * 
 * Maneja todas las operaciones CRUD relacionadas con roles:
 * - Obtener listado de roles
 * - Crear nuevo rol
 * - Actualizar rol existente
 * - Eliminar rol
 * - Obtener permisos de un rol
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/roles';

/**
 * Obtiene todos los roles
 * @returns {Promise} Lista de roles
 */
export const getAllRoles = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene un rol por su ID
 * @param {number} id - ID del rol
 * @returns {Promise} Datos del rol
 */
export const getRolById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Crea un nuevo rol
 * @param {Object} data - Datos del rol
 * @returns {Promise} Rol creado
 */
export const createRol = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Actualiza un rol existente
 * @param {number} id - ID del rol
 * @param {Object} data - Datos actualizados
 * @returns {Promise} Rol actualizado
 */
export const updateRol = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Elimina un rol
 * @param {number} id - ID del rol
 * @returns {Promise} Confirmación de eliminación
 */
export const deleteRol = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Obtiene los permisos asignados a un rol
 * @param {number} id - ID del rol
 * @returns {Promise} Lista de permisos del rol
 */
export const getRolPermisos = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}/permisos`);
  return response.data;
};
