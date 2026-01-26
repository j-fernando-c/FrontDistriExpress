// src/services/domiciliariosService.js
import api from "../config/api";

export const domiciliariosService = {
  // Obtener todos los domiciliarios
  getAll: async () => {
    const response = await api.get("/domiciliarios");
    return response.data;
  },

  // Obtener un domiciliario por ID
  getById: async (id) => {
    const response = await api.get(`/domiciliarios/${id}`);
    return response.data;
  },

  // Crear un nuevo domiciliario
  create: async (data) => {
    const response = await api.post("/domiciliarios", data);
    return response.data;
  },

  // Actualizar un domiciliario
  update: async (id, data) => {
    const response = await api.put(`/domiciliarios/${id}`, data);
    return response.data;
  },

  // Eliminar un domiciliario
  delete: async (id) => {
    const response = await api.delete(`/domiciliarios/${id}`);
    return response.data;
  },

  // Cambiar estado de domiciliario
  toggleEstado: async (id) => {
    const response = await api.patch(`/domiciliarios/${id}/estado`);
    return response.data;
  },
};
