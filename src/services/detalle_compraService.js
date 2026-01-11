import api from '../config/api';

export const detalle_compraService = {
  getAll: async () => {
    const response = await api.get('/detalle_compra');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/detalle_compra/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/detalle_compra', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/detalle_compra/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/detalle_compra/${id}`);
    return response.data;
  },
};
