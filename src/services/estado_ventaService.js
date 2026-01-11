import api from '../config/api';

export const estado_ventaService = {
  getAll: async () => {
    const response = await api.get('/estado_venta');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/estado_venta/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/estado_venta', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/estado_venta/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/estado_venta/${id}`);
    return response.data;
  },
};
