// src/services/usuariosService.js
import api from "../config/api";

export const usuariosService = {
  getAll: async () => {
    const response = await api.get("/usuarios");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/usuarios", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  toggleEstado: async (id, estado) => {
    const response = await api.patch(`/usuarios/${id}/estado`, { estado });
    return response.data;
  },
};
