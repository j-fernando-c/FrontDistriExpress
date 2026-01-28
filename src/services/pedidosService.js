// src/services/pedidosService.js
import api from "../config/api";

export const pedidosService = {
  getAll: async () => {
    const response = await api.get("/pedidos");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/pedidos", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/pedidos/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/pedidos/${id}`);
    return response.data;
  },

  toggleEstado: async (id, estado) => {
    const response = await api.patch(`/pedidos/${id}/estado`, { estado });
    return response.data;
  },
};
