import api from '../config/api';

export const compraService = {
  getAll: async () => {
    const response = await api.get('/compras');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/compras/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/compras', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/compras/${id}`, data);
    return response.data;
  },

  toggleEstado: async (id) => {
    const response = await api.patch(`/compras/${id}/toggle-estado`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/compras/${id}`);
    return response.data;
  },
};
