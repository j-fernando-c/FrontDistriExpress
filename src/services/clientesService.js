import api from '../config/api';

export const clientesService = {
  getAll: async () => {
    const response = await api.get('/clientes');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/clientes', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/clientes/${id}`, data);
    return response.data;
  },

  toggleEstado: async (id) => {
    const response = await api.patch(`/clientes/${id}/toggle-estado`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
  },
};
