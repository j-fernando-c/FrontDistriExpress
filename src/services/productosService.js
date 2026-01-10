import api from '../config/api';

export const productosService = {
  getAll: async () => {
    const response = await api.get('/productos');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/productos', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/productos/${id}`, data);
    return response.data;
  },

  toggleEstado: async (id) => {
    const response = await api.patch(`/productos/${id}/toggle-estado`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  },
};
