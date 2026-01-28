// src/services/entradas_salidas.js
import api from "../config/api";

export const entradas_salidas = {
  // Obtener todas las entradas_salidas
  getAll: async () => {
    const response = await api.get("/entradas_salidas");
    return response.data;
  },

  // Obtener una entradas_salidas por ID
  getById: async (id) => {
    const response = await api.get(`/entradas_salidas/${id}`);
    return response.data;
  },

  // Crear una nueva entradas_salidas
  create: async (data) => {
    const response = await api.post("/entradas_salidas", data);
    return response.data;
  },

  // Actualizar una entradas_salidas
  update: async (id, data) => {
    const response = await api.put(`/entradas_salidas/${id}`, data);
    return response.data;
  },

  // Eliminar una entradas_salidas
  delete: async (id) => {
    const response = await api.delete(`/entradas_salidas/${id}`);
    return response.data;
  },

  // Cambiar estado de entradas_salidas
  toggleEstado: async (id, estado) => {
    const response = await api.patch(`/entradas_salidas/${id}/toggle-estado`, {
      estado,
    });
    return response.data;
  },

  // Obtener detalles de entradas_salidas (productos)
  getDetalles: async (id) => {
    const response = await api.get(`/entradas_salidas/${id}/detalles`);
    return response.data;
  },
};
