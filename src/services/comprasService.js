// src/services/comprasService.js
import api from "../config/api";

export const comprasService = {
  // Obtener todos los compras
  getAll: async () => {
    const response = await api.get("/compras");
    return response.data;
  },

  // Obtener un abono por ID
  getById: async (id) => {
    const response = await api.get(`/compras/${id}`);
    return response.data;
  },

  // Crear un nuevo abono
  create: async (data) => {
    const response = await api.post("/compras", data);
    return response.data;
  },

  // Actualizar un abono
  update: async (id, data) => {
    const response = await api.put(`/compras/${id}`, data);
    return response.data;
  },

  // Eliminar un abono
  delete: async (id) => {
    const response = await api.delete(`/compras/${id}`);
    return response.data;
  },

  // Obtener compras de una venta específica
  getByVenta: async (ventaId) => {
    const response = await api.get(`/compras/venta/${ventaId}/compras`);
    return response.data;
  },

  // Obtener total abonado de una venta
  getTotalAbonado: async (ventaId) => {
    const response = await api.get(`/compras/venta/${ventaId}/total`);
    return response.data;
  },

  // Obtener resumen con deuda de una venta
  getResumen: async (ventaId) => {
    const response = await api.get(`/compras/venta/${ventaId}/resumen`);
    return response.data;
  },
};
