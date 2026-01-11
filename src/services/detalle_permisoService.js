import api from '../config/api';

export const detalle_permisoService = {
  getAll: async () => {
    const response = await api.get('/detalle_permiso');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/detalle_permiso/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/detalle_permiso', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/detalle_permiso/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/detalle_permiso/${id}`);
    return response.data;
  },
};
