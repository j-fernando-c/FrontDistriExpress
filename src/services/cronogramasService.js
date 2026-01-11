import api from '../config/api';

export const cronogramasService = {
  getAll: async () => {
    const response = await api.get('/cronogramas');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/cronogramas/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/cronogramas', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/cronogramas/${id}`, data);
    return response.data;
  },

  toggleEstado: async (id) => {
    const response = await api.patch(`/cronogramas/${id}/toggle-estado`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/cronogramas/${id}`);
    return response.data;
  },
};
