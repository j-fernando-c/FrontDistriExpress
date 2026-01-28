// src/services/ventasService.js
import api from "../config/api";

export const ventasService = {
  // Obtener todas las ventas
  getAll: async () => {
    const response = await api.get("/ventas");
    return response.data;
  },

  // Obtener una venta por ID
  getById: async (id) => {
    const response = await api.get(`/ventas/${id}`);
    return response.data;
  },

  // Crear una nueva venta
  create: async (data) => {
    const response = await api.post("/ventas", data);
    return response.data;
  },

  // Actualizar una venta
  update: async (id, data) => {
    const response = await api.put(`/ventas/${id}`, data);
    return response.data;
  },

  // Eliminar una venta
  delete: async (id) => {
    const response = await api.delete(`/ventas/${id}`);
    return response.data;
  },

  // Cambiar estado de venta
  toggleEstado: async (id, estado) => {
    const response = await api.patch(`/ventas/${id}/toggle-estado`, {
      estado,
    });
    return response.data;
  },

  // Obtener detalles de venta (productos)
  getDetalles: async (id) => {
    const response = await api.get(`/ventas/${id}/detalles`);
    return response.data;
  },
};
