// src/pages/Categories.jsx
import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { categoria_productosService } from "../services/categoria_productosService";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoriesResponse] = await Promise.all([
        categoria_productosService.getAll(),
      ]);

      const categoriesData = (categoriesResponse.data || []).map((c) => ({
        id: c.id,
        name: c.nombre_categoria,
        description: c.descripcion,
        products: c.cantidad_productos || 0,
        estado: c.estado === "ACTIVO" ? "Activo" : "Inactivo",
      }));

      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || "Error al cargar datos");
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    name: "",
    description: "",
    estado: "Activo", // siempre se crea en Activo, pero ya no se edita en el formulario
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // ===== Modal helpers =====
  const openCreate = () => {
    setIsViewMode(false);
    setEditingId(null);
    setFormData(emptyForm);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEdit = (cat) => {
    setIsViewMode(false);
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      description: cat.description,
      estado: cat.estado, // se mantiene internamente, pero no se muestra en el formulario
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openView = (cat) => {
    setIsViewMode(true);
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      description: cat.description,
      estado: cat.estado,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsViewMode(false);
    setEditingId(null);
    setErrors({});
  };

  // ===== Form =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre de la categoría es obligatorio";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return;

    if (!validate()) return;

    const data = {
      nombre_categoria: formData.name.trim(),
      descripcion: formData.description.trim(),
    };

    try {
      if (editingId) {
        await categoria_productosService.update(editingId, data);
      } else {
        await categoria_productosService.create(data);
      }
      await loadData();
      closeModal();
    } catch (err) {
      alert(err.message || "Error al guardar categoría");
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    try {
      await categoria_productosService.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message || "Error al eliminar categoría");
    }
  };

  const toggleEstado = async (id) => {
    try {
      await categoria_productosService.toggleEstado(id);
      setCategories((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                estado: c.estado === "Activo" ? "Inactivo" : "Activo",
              }
            : c
        )
      );
    } catch (err) {
      alert(err.message || "Error al cambiar estado");
    }
  };

  const inputBase =
    "w-full mt-1 p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500";
  const textareaBase =
    "w-full mt-1 p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500 min-h-[120px]";
  const disabledInput = "opacity-70 cursor-not-allowed";

  return (
    <div className="p-6">
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-wide">
            Gestión de Categorías
          </h2>
          <p className="text-neutral-400 text-sm">
            Organiza y administra las categorías de productos.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="mt-3 md:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-5 py-3 rounded-xl shadow-md transition"
        >
          <FiPlus />
          Nueva Categoría
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-neutral-900/70 border border-neutral-700 rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex items-center bg-neutral-800/70 border border-neutral-600 rounded-xl px-4 py-3 shadow-md">
          <FiSearch className="text-neutral-400 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Buscar categorías por nombre o descripción..."
            className="w-full bg-transparent outline-none text-neutral-200 placeholder-neutral-500"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto bg-neutral-900/70 border border-neutral-700 rounded-2xl shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-neutral-800/80 text-neutral-300 text-sm uppercase">
            <tr>
              <th className="p-3 font-semibold">Categoría</th>
              <th className="p-3 font-semibold">Descripción</th>
              <th className="p-3 font-semibold">Productos</th>
              <th className="p-3 font-semibold">Estado</th>
              <th className="p-3 font-semibold text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-sm text-neutral-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-neutral-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                    Cargando categorías...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-red-400">
                  {error}
                  <button
                    onClick={loadData}
                    className="ml-2 text-green-400 hover:underline"
                  >
                    Reintentar
                  </button>
                </td>
              </tr>
            ) : paginatedCategories.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-neutral-400">
                  No se encontraron categorías.
                </td>
              </tr>
            ) : (
              paginatedCategories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-t border-neutral-700 hover:bg-neutral-800/50 transition"
                >
                  {/* SIN ICONO, SOLO EL NOMBRE */}
                  <td className="p-3">
                    <span className="font-medium text-white">{cat.name}</span>
                  </td>

                  <td className="p-3 text-neutral-300">{cat.description}</td>

                  <td className="p-3 text-neutral-300">
                    {cat.products} productos
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => toggleEstado(cat.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow cursor-pointer transition
                        ${
                          cat.estado === "Activo"
                            ? "bg-green-600 text-black hover:bg-green-500"
                            : "bg-red-600 text-black hover:bg-red-500"
                        }`}
                    >
                      {cat.estado}
                    </button>
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      <button
                        className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg shadow text-white"
                        onClick={() => openView(cat)}
                      >
                        <FiEye className="text-lg" />
                      </button>

                      <button
                        className="bg-green-600 hover:bg-green-500 text-black p-2 rounded-lg shadow"
                        onClick={() => openEdit(cat)}
                      >
                        <FiEdit2 className="text-lg" />
                      </button>

                      <button
                        className="bg-red-600 hover:bg-red-500 text-black p-2 rounded-lg shadow"
                        onClick={() => deleteCategory(cat.id)}
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINACIÓN */}
        <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 border-t border-neutral-800 gap-3 text-sm text-neutral-300">
          <span>
            Mostrando{" "}
            {filteredCategories.length === 0
              ? "0"
              : `${startIndex + 1}–${Math.min(
                  startIndex + itemsPerPage,
                  filteredCategories.length
                )}`}{" "}
            de {filteredCategories.length} categorías
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-neutral-700 bg-neutral-800 disabled:opacity-40 hover:bg-neutral-700"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded-lg border border-neutral-700 ${
                  page === currentPage
                    ? "bg-green-600 text-black"
                    : "bg-neutral-800 hover:bg-neutral-700"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-neutral-700 bg-neutral-800 disabled:opacity-40 hover:bg-neutral-700"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* MODAL FORMULARIO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto text-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                {isViewMode
                  ? "Ver Categoría"
                  : editingId
                  ? "Editar Categoría"
                  : "Nueva Categoría"}
              </h3>
              <button
                onClick={closeModal}
                className="text-neutral-400 hover:text-neutral-200"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-neutral-300">
                  Nombre de la Categoría <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`${inputBase} ${
                    errors.name ? "border-red-500" : ""
                  } ${isViewMode ? disabledInput : ""}`}
                  placeholder="Ej: Granos y Cereales, Aceites y Vinagres, etc."
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isViewMode}
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-neutral-300">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  className={`${textareaBase} ${
                    errors.description ? "border-red-500" : ""
                  } ${isViewMode ? disabledInput : ""}`}
                  placeholder="Describe brevemente esta categoría y qué tipos de productos incluye..."
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isViewMode}
                />
                {errors.description && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* NOTA: ya no hay campo de Estado en el formulario */}

              {/* Botones */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-5 py-2 bg-neutral-700 text-neutral-200 hover:bg-neutral-600 rounded-xl transition"
                  onClick={closeModal}
                >
                  {isViewMode ? "Cerrar" : "Cancelar"}
                </button>

                {!isViewMode && (
                  <button
                    type="submit"
                    className="px-5 py-2 bg-green-600 hover:bg-green-500 text-black font-semibold rounded-xl transition"
                  >
                    {editingId ? "Guardar cambios" : "Crear Categoría"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
