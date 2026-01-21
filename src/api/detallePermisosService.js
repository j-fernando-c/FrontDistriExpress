/**
 * Servicio API para Detalle de Permisos
 * 
 * Maneja todas las operaciones relacionadas con los detalles de permisos:
 * - Obtener detalles de permisos por rol
 * - Asignar permisos a rol
 * - Revocar permisos de rol
 */

import axiosInstance from './axiosConfig';

const ENDPOINT = '/detalle-permisos';

/**
 * Obtiene todos los detalles de permisos
 * @returns {Promise} Lista de detalles
 */
export const getAllDetallePermisos = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

/**
 * Obtiene permisos de un rol específico
 * @param {number} rolId - ID del rol
 * @returns {Promise} Permisos del rol
 */
export const getPermisosByRolId = async (rolId) => {
  const response = await axiosInstance.get(`${ENDPOINT}/rol/${rolId}`);
  return response.data;
};

/**
 * Obtiene un detalle de permiso por su ID
 * @param {number} id - ID del detalle
 * @returns {Promise} Datos del detalle
 */
export const getDetallePermisoById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Asigna un permiso a un rol
 * @param {Object} data - Datos del permiso (rolId, permisoId)
 * @returns {Promise} Permiso asignado
 */
export const assignPermiso = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return response.data;
};

/**
 * Revoca un permiso de un rol
 * @param {number} id - ID del detalle de permiso
 * @returns {Promise} Confirmación de revocación
 */
export const revokePermiso = async (id) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Actualiza múltiples permisos de un rol
 * @param {number} rolId - ID del rol
 * @param {Array} permisos - Array de IDs de permisos
 * @returns {Promise} Permisos actualizados
 */
export const updateRolPermisos = async (rolId, permisos) => {
  const response = await axiosInstance.put(`${ENDPOINT}/rol/${rolId}`, { permisos });
  return response.data;
};
