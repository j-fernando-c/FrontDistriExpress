import api from '../config/api';

export const productoService = {
  getAll: async () => {
    const response = await api.get('/producto');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/producto/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/producto', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/producto/${id}`, data);
    return response.data;
  },

  toggleEstado: async (id) => {
    const response = await api.patch(`/producto/${id}/toggle-estado`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/producto/${id}`);
    return response.data;
  },
};
