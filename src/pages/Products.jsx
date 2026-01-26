// src/pages/Products.jsx
import { useMemo, useState, useEffect, useCallback } from "react";
import { FiSearch, FiPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { productosService } from "../services/productosService";
import { categoriasService } from "../services/categoriasService";

export default function Products() {
  // ====== Data ======
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productosService.getAll();
      setProducts(response.data || []);
    } catch (err) {
      setError(err.message || "Error al cargar productos");
      console.error("Error cargando productos:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriasService.getAll();
      setCategories(response.data || []);
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  };

  // ====== UI state ======
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // ====== Form ======
  const emptyForm = {
    name: "",
    description: "",
    category: "",
    categoryId: "",
    qty: "0",
    price: "0",
    stockMin: "0",
    stockMax: "0",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // ====== Pagination ======
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(q) ||
      (p.categoria_nombre || "").toLowerCase().includes(q) ||
      (p.precio || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / itemsPerPage),
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
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

  const openEdit = (product) => {
    setIsViewMode(false);
    setEditingId(product.id);
    setFormData({
      name: product.nombre || "",
      description: product.descripcion || "",
      category: product.categoria_nombre || "",
      categoryId: product.categoria_id || "",
      qty: String(product.cantidad ?? 0),
      price: String(product.precio ?? 0),
      stockMin: String(product.stock_min ?? 0),
      stockMax: String(product.stock_max ?? 0),
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openView = (product) => {
    setIsViewMode(true);
    setEditingId(product.id);
    setFormData({
      name: product.nombre || "",
      description: product.descripcion || "",
      category: product.categoria_nombre || "",
      categoryId: product.categoria_id || "",
      qty: String(product.cantidad ?? 0),
      price: String(product.precio ?? 0),
      stockMin: String(product.stock_min ?? 0),
      stockMax: String(product.stock_max ?? 0),
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

  // ===== Form handlers =====
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si cambia la categoría, actualizar también categoryId
    if (name === "category") {
      const selectedCat = categories.find(
        (cat) => cat.nombre_categoria === value,
      );
      setFormData((prev) => ({
        ...prev,
        category: value,
        categoryId: selectedCat ? selectedCat.id : "",
      }));
      return;
    }

    // Mantener strings para permitir sobreescribir el "0"
    if (
      name === "qty" ||
      name === "price" ||
      name === "stockMin" ||
      name === "stockMax"
    ) {
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim())
      newErrors.name = "El nombre del producto es obligatorio";
    if (!formData.category.trim())
      newErrors.category = "La categoría es obligatoria";

    if (!formData.qty.toString().trim()) {
      newErrors.qty = "La cantidad es obligatoria";
    } else {
      const n = Number(formData.qty);
      if (Number.isNaN(n) || n < 0)
        newErrors.qty = "La cantidad debe ser 0 o mayor";
    }

    if (!formData.price.toString().trim()) {
      newErrors.price = "El precio unitario es obligatorio";
    } else {
      const n = Number(formData.price);
      if (Number.isNaN(n) || n < 0)
        newErrors.price = "El precio debe ser 0 o mayor";
    }

    if (!formData.stockMin.toString().trim()) {
      newErrors.stockMin = "El stock mínimo es obligatorio";
    } else {
      const n = Number(formData.stockMin);
      if (Number.isNaN(n) || n < 0)
        newErrors.stockMin = "El stock mínimo debe ser 0 o mayor";
    }

    if (!formData.stockMax.toString().trim()) {
      newErrors.stockMax = "El stock máximo es obligatorio";
    } else {
      const n = Number(formData.stockMax);
      if (Number.isNaN(n) || n < 0)
        newErrors.stockMax = "El stock máximo debe ser 0 o mayor";
      else if (Number(formData.stockMin) > n)
        newErrors.stockMax = "El stock máximo debe ser mayor al mínimo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toNumberSafe = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return;
    if (!validate()) return;

    const data = {
      nombre: formData.name.trim(),
      descripcion: formData.description.trim(),
      categoria_id: formData.categoryId,
      cantidad: toNumberSafe(formData.qty),
      precio: toNumberSafe(formData.price),
      stock_min: toNumberSafe(formData.stockMin),
      stock_max: toNumberSafe(formData.stockMax),
    };

    try {
      if (editingId) {
        await productosService.update(editingId, data);
      } else {
        await productosService.create(data);
      }
      await loadProducts();
      closeModal();
    } catch (err) {
      alert(err.message || "Error al guardar producto");
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await productosService.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || "Error al eliminar producto");
    }
  };

  const toggleEstado = async (id) => {
    try {
      await productosService.toggleEstado(id);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, estado: p.estado === "activo" ? "inactivo" : "activo" }
            : p,
        ),
      );
    } catch (err) {
      alert(err.message || "Error al cambiar estado");
    }
  };

  const money = (n) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(n || 0);

  const inputBase =
    "w-full mt-1 p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500";
  const disabledInput = "opacity-70 cursor-not-allowed";

  return (
    <div className="p-6">
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-wide">
            Gestión de Productos
          </h2>
          <p className="text-neutral-400 text-sm">
            Administra tu catálogo de productos.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="mt-3 md:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-5 py-3 rounded-xl shadow-md transition"
        >
          <FiPlus />
          Agregar producto
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-neutral-900/70 border border-neutral-700 rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex items-center bg-neutral-800/70 border border-neutral-600 rounded-xl px-4 py-3 shadow-md">
          <FiSearch className="text-neutral-400 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Buscar productos por nombre, categoría o unidad..."
            className="w-full bg-transparent outline-none text-neutral-200 placeholder-neutral-500"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* TABLA (sin ID) */}
      <div className="overflow-x-auto bg-neutral-900/70 border border-neutral-700 rounded-2xl shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-neutral-800/80 text-neutral-300 text-sm uppercase">
            <tr>
              <th className="p-3 font-semibold">Producto</th>
              <th className="p-3 font-semibold">Categoría</th>
              <th className="p-3 font-semibold">Stock</th>
              <th className="p-3 font-semibold">Stock Min/Max</th>
              <th className="p-3 font-semibold">Precio</th>
              <th className="p-3 font-semibold">Estado</th>
              <th className="p-3 font-semibold text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-sm text-neutral-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-neutral-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                    Cargando productos...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-red-400">
                  {error}
                  <button
                    onClick={loadProducts}
                    className="ml-2 text-green-400 hover:underline"
                  >
                    Reintentar
                  </button>
                </td>
              </tr>
            ) : paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-neutral-400">
                  No se encontraron productos.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-neutral-700 hover:bg-neutral-800/50 transition"
                >
                  <td className="p-3 font-medium text-white">{p.nombre}</td>
                  <td className="p-3 text-neutral-300">{p.categoria_nombre}</td>
                  <td className="p-3 text-neutral-300">
                    <span
                      className={
                        p.cantidad <= p.stock_min
                          ? "text-red-400 font-semibold"
                          : ""
                      }
                    >
                      {p.cantidad}
                    </span>
                  </td>
                  <td className="p-3 text-neutral-300 text-sm">
                    {p.stock_min} / {p.stock_max}
                  </td>
                  <td className="p-3 text-green-400 font-semibold">
                    {money(p.precio)}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => toggleEstado(p.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow cursor-pointer transition
                      ${
                        p.estado === "activo"
                          ? "bg-green-600 text-black hover:bg-green-500"
                          : "bg-red-600 text-black hover:bg-red-500"
                      }`}
                    >
                      {p.estado === "activo" ? "Activo" : "Inactivo"}
                    </button>
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      <button
                        className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg shadow text-white"
                        onClick={() => openView(p)}
                      >
                        <FiEye className="text-lg" />
                      </button>

                      <button
                        className="bg-green-600 hover:bg-green-500 text-black p-2 rounded-lg shadow"
                        onClick={() => openEdit(p)}
                      >
                        <FiEdit2 className="text-lg" />
                      </button>

                      <button
                        className="bg-red-600 hover:bg-red-500 text-black p-2 rounded-lg shadow"
                        onClick={() => deleteProduct(p.id)}
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
            {filteredProducts.length === 0
              ? "0"
              : `${startIndex + 1}–${Math.min(
                  startIndex + itemsPerPage,
                  filteredProducts.length,
                )}`}{" "}
            de {filteredProducts.length} productos
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
                  ? "Ver Producto"
                  : editingId
                    ? "Editar Producto"
                    : "Registrar Nuevo Producto"}
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
                  Nombre del Producto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`${inputBase} ${
                    errors.name ? "border-red-500" : ""
                  } ${isViewMode ? disabledInput : ""}`}
                  placeholder="Nombre del producto"
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
                  Descripción
                </label>
                <textarea
                  name="description"
                  rows="3"
                  className={`${inputBase} ${
                    errors.description ? "border-red-500" : ""
                  } ${isViewMode ? disabledInput : ""}`}
                  placeholder="Descripción del producto"
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

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-neutral-300">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  className={`${inputBase} ${
                    errors.category ? "border-red-500" : ""
                  } ${isViewMode ? disabledInput : ""}`}
                  value={formData.category}
                  onChange={handleChange}
                  disabled={isViewMode}
                >
                  <option value="">Seleccionar categoría...</option>
                  {categories
                    .filter((cat) => cat.estado === "activo")
                    .map((cat) => (
                      <option key={cat.id} value={cat.nombre_categoria}>
                        {cat.nombre_categoria}
                      </option>
                    ))}
                </select>
                {errors.category && (
                  <p className="text-xs text-red-400 mt-1">{errors.category}</p>
                )}
              </div>

              {/* Precio y Cantidad */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Precio Unitario <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    className={`${inputBase} ${
                      errors.price ? "border-red-500" : ""
                    } ${isViewMode ? disabledInput : ""}`}
                    value={formData.price}
                    onChange={handleChange}
                    disabled={isViewMode}
                    min="0"
                    step="0.01"
                  />
                  {errors.price && (
                    <p className="text-xs text-red-400 mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Cantidad Actual <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="qty"
                    className={`${inputBase} ${
                      errors.qty ? "border-red-500" : ""
                    } ${isViewMode ? disabledInput : ""}`}
                    value={formData.qty}
                    onChange={handleChange}
                    disabled={isViewMode}
                    min="0"
                  />
                  {errors.qty && (
                    <p className="text-xs text-red-400 mt-1">{errors.qty}</p>
                  )}
                </div>
              </div>

              {/* Stock Mínimo y Máximo */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Stock Mínimo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stockMin"
                    className={`${inputBase} ${
                      errors.stockMin ? "border-red-500" : ""
                    } ${isViewMode ? disabledInput : ""}`}
                    value={formData.stockMin}
                    onChange={handleChange}
                    disabled={isViewMode}
                    min="0"
                  />
                  {errors.stockMin && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.stockMin}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Stock Máximo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stockMax"
                    className={`${inputBase} ${
                      errors.stockMax ? "border-red-500" : ""
                    } ${isViewMode ? disabledInput : ""}`}
                    value={formData.stockMax}
                    onChange={handleChange}
                    disabled={isViewMode}
                    min="0"
                  />
                  {errors.stockMax && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.stockMax}
                    </p>
                  )}
                </div>
              </div>

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
                    {editingId ? "Guardar cambios" : "Registrar producto"}
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
