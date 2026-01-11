import api from '../config/api';

export const ventaService = {
  getAll: async () => {
    const response = await api.get('/ventas');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/ventas/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/ventas', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/ventas/${id}`, data);
    return response.data;
  },

  toggleEstado: async (id) => {
    const response = await api.patch(`/ventas/${id}/toggle-estado`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/ventas/${id}`);
    return response.data;
  },
};
