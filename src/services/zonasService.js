// src/services/zonasService.js
import api from "../config/api";

export const zonasService = {
  getAll: async () => {
    const response = await api.get("/zonas");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/zonas/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/zonas", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/zonas/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/zonas/${id}`);
    return response.data;
  },

  toggleEstado: async (id, estado) => {
    const response = await api.patch(`/zonas/${id}/estado`, { estado });
    return response.data;
  },
};
