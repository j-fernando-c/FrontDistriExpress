import api from "../config/api";

export const categoriasService = {
  getAll: async () => {
    const response = await api.get("/categoria_productos");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/categoria_productos/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/categoria_productos", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/categoria_productos/${id}`, data);
    return response.data;
  },

  toggleEstado: async (id) => {
    const response = await api.patch(
      `/categoria_productos/${id}/toggle-estado`,
    );
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/categoria_productos/${id}`);
    return response.data;
  },
};
