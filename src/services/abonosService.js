// src/services/abonosService.js
import api from "../config/api";

export const abonosService = {
  // Obtener todos los abonos
  getAll: async () => {
    const response = await api.get("/abonos");
    return response.data;
  },

  // Obtener un abono por ID
  getById: async (id) => {
    const response = await api.get(`/abonos/${id}`);
    return response.data;
  },

  // Crear un nuevo abono
  create: async (data) => {
    const response = await api.post("/abonos", data);
    return response.data;
  },

  // Actualizar un abono
  update: async (id, data) => {
    const response = await api.put(`/abonos/${id}`, data);
    return response.data;
  },

  // Eliminar un abono
  delete: async (id) => {
    const response = await api.delete(`/abonos/${id}`);
    return response.data;
  },

  // Obtener abonos de una venta específica
  getByVenta: async (ventaId) => {
    const response = await api.get(`/abonos/venta/${ventaId}/abonos`);
    return response.data;
  },

  // Obtener total abonado de una venta
  getTotalAbonado: async (ventaId) => {
    const response = await api.get(`/abonos/venta/${ventaId}/total`);
    return response.data;
  },

  // Obtener resumen con deuda de una venta
  getResumen: async (ventaId) => {
    const response = await api.get(`/abonos/venta/${ventaId}/resumen`);
    return response.data;
  },
};
