// src/pages/EntradasSalidas.jsx
import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { entradas_salidas } from "../services/entradas_salidasService";
import { productosService } from "../services/productosService";

// Productos (se cargan desde el servicio)
// Estructura usada en este módulo: [{ id, nombre }]

export default function EntradasSalidas() {
  // ===== DATA =====
  const [movs, setMovs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(false);

  useEffect(() => {
    fetchMovs();
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    setLoadingProductos(true);
    try {
      const res = await productosService.getAll();
      const list = res?.data ?? res ?? [];
      const mapped = Array.isArray(list)
        ? list.map((p) => ({
            id: p.id,
            nombre:
              p.nombre ?? p.nombre_producto ?? p.producto_nombre ?? p.nombre,
          }))
        : [];
      setProductos(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProductos(false);
    }
  };

  const mapBackendToFrontend = (m) => ({
    id: m.id,
    tipo: (m.tipo || "").charAt(0).toUpperCase() + (m.tipo || "").slice(1),
    producto: m.producto_nombre ?? m.producto ?? "",
    cantidad: Number(m.cantidad) || 0,
    precio: m.precio_producto
      ? Number(parseFloat(m.precio_producto))
      : m.precio
        ? Number(parseFloat(m.precio))
        : 0,
    fecha: m.fecha
      ? String(m.fecha).split("T")[0]
      : m.fecha || new Date().toISOString().slice(0, 10),
    estado: (m.estado || "").toLowerCase(),
    observaciones: m.observaciones ?? "",
  });

  const fetchMovs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await entradas_salidas.getAll();
      const list = res?.data ?? res ?? [];
      const mapped = Array.isArray(list) ? list.map(mapBackendToFrontend) : [];
      setMovs(mapped);
    } catch (err) {
      console.error(err);
      setError("Error cargando registros");
    } finally {
      setLoading(false);
    }
  };

  // ===== UI STATE =====
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // ===== PAGINACIÓN =====
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredMovs = movs.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.tipo.toLowerCase().includes(q) ||
      m.producto.toLowerCase().includes(q) ||
      String(m.precio).toLowerCase().includes(q) ||
      (m.fecha || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredMovs.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMovs = filteredMovs.slice(
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

  // ===== FORM =====
  const emptyForm = {
    tipo: "Entrada",
    producto: "",
    cantidad: "1",
    precio: "0",
    observaciones: "",
    fecha: new Date().toISOString().slice(0, 10),
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Autocomplete producto
  const [productQuery, setProductQuery] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const productOptions = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    if (!q) return productos.slice(0, 6);
    return productos
      .filter((p) => p.nombre.toLowerCase().includes(q))
      .slice(0, 8);
  }, [productQuery, productos]);

  const openCreate = () => {
    setIsViewMode(false);
    setEditingId(null);
    setFormData({
      ...emptyForm,
      fecha: new Date().toISOString().slice(0, 10),
    });
    setProductQuery("");
    setShowProductDropdown(false);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEdit = (mov) => {
    setIsViewMode(false);
    setEditingId(mov.id);
    setFormData({
      tipo: mov.tipo,
      producto: mov.producto,
      cantidad: String(mov.cantidad ?? "1"),
      precio: String(mov.precio ?? "0"),
      fecha: mov.fecha || new Date().toISOString().slice(0, 10),
      observaciones: mov.observaciones || "",
    });
    setProductQuery(mov.producto || "");
    setShowProductDropdown(false);
    setErrors({});
    setIsModalOpen(true);
  };

  const openView = (mov) => {
    setIsViewMode(true);
    setEditingId(mov.id);
    setFormData({
      tipo: mov.tipo,
      producto: mov.producto,
      cantidad: String(mov.cantidad ?? "1"),
      precio: String(mov.precio ?? "0"),
      fecha: mov.fecha || new Date().toISOString().slice(0, 10),
      observaciones: mov.observaciones || "",
    });
    setProductQuery(mov.producto || "");
    setShowProductDropdown(false);
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsViewMode(false);
    setEditingId(null);
    setErrors({});
    setProductQuery("");
    setShowProductDropdown(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.tipo) newErrors.tipo = "El tipo es obligatorio";

    if (!formData.producto.trim())
      newErrors.producto = "El producto es obligatorio";

    if (!String(formData.cantidad).trim()) {
      newErrors.cantidad = "La cantidad es obligatoria";
    } else {
      const n = Number(formData.cantidad);
      if (Number.isNaN(n) || n <= 0)
        newErrors.cantidad = "La cantidad debe ser mayor a 0";
    }

    if (!String(formData.precio).trim()) {
      newErrors.precio = "El precio es obligatorio";
    } else {
      const n = Number(formData.precio);
      if (Number.isNaN(n) || n < 0)
        newErrors.precio = "El precio debe ser 0 o mayor";
    }

    if (!String(formData.observaciones).trim()) {
      newErrors.observaciones = "Las observaciones son obligatorias";
    }

    if (!formData.fecha) newErrors.fecha = "La fecha es obligatoria";

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

    setSaving(true);
    try {
      // try to match producto id from fetched `productos` when possible
      const found = productos.find(
        (p) =>
          p.nombre.toLowerCase() === formData.producto.trim().toLowerCase(),
      );

      const payload = {
        tipo: String(formData.tipo || "").toLowerCase(),
        producto_id: found ? found.id : undefined,
        cantidad: toNumberSafe(formData.cantidad),
        precio: String(toNumberSafe(formData.precio).toFixed(2)),
        estado: "activo",
        observaciones: formData.observaciones || "",
      };

      if (editingId) {
        await entradas_salidas.update(editingId, payload);
      } else {
        await entradas_salidas.create(payload);
      }

      await fetchMovs();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Error guardando registro");
    } finally {
      setSaving(false);
    }
  };

  const deleteMov = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este registro?")) return;
    setSaving(true);
    try {
      await entradas_salidas.delete(id);
      await fetchMovs();
    } catch (err) {
      console.error(err);
      alert("Error eliminando registro");
    } finally {
      setSaving(false);
    }
  };

  const money = (n) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Number(n) || 0);

  // clases base (igual patrón que tus módulos)
  const inputBase =
    "w-full mt-1 p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500";
  const disabledInput = "opacity-70 cursor-not-allowed";

  const tipoBadge = (tipo) =>
    tipo === "Entrada"
      ? "bg-green-600 text-black hover:bg-green-500"
      : "bg-red-600 text-black hover:bg-red-500";

  return (
    <div className="p-6">
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-wide">
            Entradas y Salidas
          </h2>
          <p className="text-neutral-400 text-sm">
            Registro de movimientos de inventario (entradas / salidas).
          </p>
        </div>

        <button
          onClick={openCreate}
          className="mt-3 md:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-5 py-3 rounded-xl shadow-md transition"
        >
          <FiPlus />
          Registrar entrada o salida
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-neutral-900/70 border border-neutral-700 rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex items-center bg-neutral-800/70 border border-neutral-600 rounded-xl px-4 py-3 shadow-md">
          <FiSearch className="text-neutral-400 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Buscar por tipo, producto, fecha o precio..."
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
              <th className="p-3 font-semibold">Tipo</th>
              <th className="p-3 font-semibold">Producto</th>
              <th className="p-3 font-semibold">Cantidad</th>
              <th className="p-3 font-semibold">Precio</th>
              <th className="p-3 font-semibold">Fecha</th>
              <th className="p-3 font-semibold text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-sm text-neutral-200">
            {paginatedMovs.map((m) => (
              <tr
                key={m.id}
                className="border-t border-neutral-700 hover:bg-neutral-800/50 transition"
              >
                <td className="p-3">
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow cursor-default transition ${tipoBadge(
                      m.tipo,
                    )}`}
                  >
                    {m.tipo}
                  </span>
                </td>
                <td className="p-3 font-medium text-white">{m.producto}</td>
                <td className="p-3 text-neutral-300">{m.cantidad}</td>
                <td className="p-3 font-semibold text-green-400">
                  {money(m.precio)}
                </td>
                <td className="p-3 text-neutral-300">{m.fecha}</td>

                <td className="p-3">
                  <div className="flex justify-center gap-3">
                    <button
                      className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg shadow text-white"
                      onClick={() => openView(m)}
                    >
                      <FiEye className="text-lg" />
                    </button>

                    <button
                      className="bg-green-600 hover:bg-green-500 text-black p-2 rounded-lg shadow"
                      onClick={() => openEdit(m)}
                    >
                      <FiEdit2 className="text-lg" />
                    </button>

                    <button
                      className="bg-red-600 hover:bg-red-500 text-black p-2 rounded-lg shadow"
                      onClick={() => deleteMov(m.id)}
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginatedMovs.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-neutral-400">
                  No se encontraron registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINACIÓN */}
        <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 border-t border-neutral-800 gap-3 text-sm text-neutral-300">
          <span>
            Mostrando{" "}
            {filteredMovs.length === 0
              ? "0"
              : `${startIndex + 1}–${Math.min(
                  startIndex + itemsPerPage,
                  filteredMovs.length,
                )}`}{" "}
            de {filteredMovs.length} registros
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

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto text-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                {isViewMode
                  ? "Ver Entrada o Salida"
                  : editingId
                    ? "Editar Entrada o Salida"
                    : "Registrar Entrada o Salida"}
              </h3>
              <button
                onClick={closeModal}
                className="text-neutral-400 hover:text-neutral-200"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Tipo + Fecha */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Tipo <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`${inputBase} ${
                      errors.tipo ? "border-red-500" : ""
                    } ${isViewMode ? disabledInput : ""}`}
                    value={formData.tipo}
                    disabled={isViewMode}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, tipo: e.target.value }))
                    }
                  >
                    <option value="Entrada">Entrada</option>
                    <option value="Salida">Salida</option>
                  </select>
                  {errors.tipo && (
                    <p className="text-xs text-red-400 mt-1">{errors.tipo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Fecha <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className={`${inputBase} ${
                      errors.fecha ? "border-red-500" : ""
                    } ${isViewMode ? disabledInput : ""}`}
                    value={formData.fecha}
                    disabled={isViewMode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fecha: e.target.value,
                      }))
                    }
                  />
                  {errors.fecha && (
                    <p className="text-xs text-red-400 mt-1">{errors.fecha}</p>
                  )}
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-medium text-neutral-300">
                  Observaciones{" "}
                  <span className="text-neutral-400 text-xs">(opcional)</span>
                </label>
                <textarea
                  rows={3}
                  className={`${inputBase} ${isViewMode ? disabledInput : ""}`}
                  value={formData.observaciones}
                  disabled={isViewMode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      observaciones: e.target.value,
                    }))
                  }
                />
                {errors.observaciones && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.observaciones}
                  </p>
                )}
              </div>

              {/* Producto (buscador) */}
              <div className="relative">
                <label className="block text-sm font-medium text-neutral-300">
                  Producto <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  className={`${inputBase} ${
                    errors.producto ? "border-red-500" : ""
                  } ${isViewMode ? disabledInput : ""}`}
                  placeholder="Buscar producto..."
                  value={productQuery}
                  disabled={isViewMode}
                  onChange={(e) => {
                    const v = e.target.value;
                    setProductQuery(v);
                    setFormData((prev) => ({ ...prev, producto: v }));
                    setShowProductDropdown(true);
                  }}
                  onFocus={() => {
                    if (!isViewMode) setShowProductDropdown(true);
                  }}
                  onBlur={() => {
                    // pequeño delay para permitir click
                    setTimeout(() => setShowProductDropdown(false), 150);
                  }}
                />

                {errors.producto && (
                  <p className="text-xs text-red-400 mt-1">{errors.producto}</p>
                )}

                {!isViewMode && showProductDropdown && (
                  <div className="absolute z-50 mt-2 w-full bg-neutral-900 border border-neutral-700 rounded-xl shadow-xl overflow-hidden">
                    {productOptions.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-neutral-400">
                        No hay coincidencias
                      </div>
                    ) : (
                      productOptions.map((p) => (
                        <button
                          type="button"
                          key={p.id}
                          className="w-full text-left px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800 transition"
                          onClick={() => {
                            setProductQuery(p.nombre);
                            setFormData((prev) => ({
                              ...prev,
                              producto: p.nombre,
                            }));
                            setShowProductDropdown(false);
                          }}
                        >
                          {p.nombre}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Cantidad + Precio */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Cantidad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className={`${inputBase} ${
                      errors.cantidad ? "border-red-500" : ""
                    } ${isViewMode ? disabledInput : ""}`}
                    value={formData.cantidad}
                    disabled={isViewMode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cantidad: e.target.value,
                      }))
                    }
                  />
                  {errors.cantidad && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.cantidad}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Precio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className={`${inputBase} ${
                      errors.precio ? "border-red-500" : ""
                    } ${isViewMode ? disabledInput : ""}`}
                    value={formData.precio}
                    disabled={isViewMode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        precio: e.target.value,
                      }))
                    }
                    onFocus={() => {
                      if (isViewMode) return;
                      if (String(formData.precio) === "0") {
                        setFormData((prev) => ({ ...prev, precio: "" }));
                      }
                    }}
                  />
                  {errors.precio && (
                    <p className="text-xs text-red-400 mt-1">{errors.precio}</p>
                  )}
                </div>
              </div>

              {/* BOTONES */}
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
                    {editingId ? "Guardar cambios" : "Registrar"}
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
