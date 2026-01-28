// src/services/rutasService.js
import api from "../config/api";

export const rutasService = {
  getAll: async () => {
    const response = await api.get("/rutas");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/rutas/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/rutas", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/rutas/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/rutas/${id}`);
    return response.data;
  },

  toggleEstado: async (id, estado) => {
    const response = await api.patch(`/rutas/${id}/estado`, { estado });
    return response.data;
  },
};
