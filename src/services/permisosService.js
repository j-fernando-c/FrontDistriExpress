import api from '../config/api';

export const permisosService = {
  getAll: async () => {
    const response = await api.get('/permisos');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/permisos/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/permisos', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/permisos/${id}`, data);
    return response.data;
  },

  toggleEstado: async (id) => {
    const response = await api.patch(`/permisos/${id}/toggle-estado`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/permisos/${id}`);
    return response.data;
  },
};
