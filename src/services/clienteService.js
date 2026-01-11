import api from '../config/api';

export const clienteService = {
  getAll: async () => {
    const response = await api.get('/cliente');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/cliente/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/cliente', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/cliente/${id}`, data);
    return response.data;
  },

  toggleEstado: async (id) => {
    const response = await api.patch(`/cliente/${id}/toggle-estado`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/cliente/${id}`);
    return response.data;
  },
};
