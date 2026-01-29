// src/pages/Purchases.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { comprasService } from "../services/comprasService";
import { proveedoresService } from "../services/proveedoresService";
import { productosService } from "../services/productosService";

export default function Purchases() {
  // ====== Estado para datos del backend ======
  const [purchases, setPurchases] = useState([]);
  const [providers, setProviders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ====== Cargar datos del backend ======
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [comprasResponse, proveedoresResponse, productosResponse] =
        await Promise.all([
          comprasService.getAll(),
          proveedoresService.getAll(),
          productosService.getAll(),
        ]);

      // Manejar diferentes estructuras de respuesta
      const comprasData = Array.isArray(comprasResponse)
        ? comprasResponse
        : comprasResponse?.data || comprasResponse?.compras || [];

      const proveedoresData = Array.isArray(proveedoresResponse)
        ? proveedoresResponse
        : proveedoresResponse?.data || proveedoresResponse?.proveedores || [];

      const productosData = Array.isArray(productosResponse)
        ? productosResponse
        : productosResponse?.data || productosResponse?.productos || [];

      // Mapear compras del backend al formato del componente
      const mappedCompras = comprasData.map((compra) => ({
        id: compra.id,
        providerId: compra.proveedor_id,
        providerName: compra.nombre_o_razon_social,
        providerEmail: compra.email || "",
        providerPhone: compra.telefono,
        date: compra.fecha ? new Date(compra.fecha) : "",
        estado: compra.estado || "pendiente",
        total: Number(compra.total_compra || 0),
        items: compra.items || [],
        notes: compra.comprobante_factura_proveedor || "",
      }));

      setPurchases(mappedCompras);
      setProviders(proveedoresData);
      setProducts(productosData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      console.error(
        "Detalles del error:",
        error.response?.data || error.message,
      );
      alert(
        "Error al cargar datos desde el servidor: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setLoading(false);
    }
  };

  // ====== UI state ======
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // ====== Pagination ======
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = purchases.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.providerName.toLowerCase().includes(q) ||
      (p.providerEmail || "").toLowerCase().includes(q) ||
      (p.providerPhone || "").toLowerCase().includes(q) ||
      (p.date || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // ====== Form ======
  const todayISO = () => new Date().toISOString().slice(0, 10);

  const emptyForm = {
    providerId: "",
    date: todayISO(), // ✅ siempre hoy al crear
    notes: "",
    estado: "",
    items: [
      {
        productId: null,
        productName: "",
        qty: "1",
        unitPrice: "0",
        subtotal: 0,
      },
    ],
    total: 0,
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // ====== Autocomplete state ======
  const [activeSuggestIndex, setActiveSuggestIndex] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const suggestBoxRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (!suggestBoxRef.current) return;
      if (!suggestBoxRef.current.contains(e.target)) {
        setActiveSuggestIndex(null);
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // ====== Helpers ======
  const money = (n) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Number(n || 0));

  const inputBase =
    "w-full mt-1 p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500";
  const disabledInput = "opacity-70 cursor-not-allowed";

  const calcSubtotal = (qty, unitPrice) => {
    const q = Number(qty);
    const p = Number(unitPrice);
    const qq = Number.isFinite(q) ? q : 0;
    const pp = Number.isFinite(p) ? p : 0;
    return Math.max(0, qq) * Math.max(0, pp);
  };

  const recalcTotals = (items) => {
    const total = items.reduce(
      (acc, it) => acc + (Number(it.subtotal) || 0),
      0,
    );
    setFormData((prev) => ({ ...prev, items, total }));
  };

  // ====== Modal ======
  const openCreate = () => {
    setIsViewMode(false);
    setEditingId(null);
    setFormData({
      ...emptyForm,
      date: todayISO(), // ✅ fuerza hoy siempre al abrir crear
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEdit = (p) => {
    setIsViewMode(false);
    setEditingId(p.id);

    // Convertir fecha a formato ISO si es un objeto Date
    const dateStr =
      p.date instanceof Date ? p.date.toISOString().slice(0, 10) : p.date || "";

    setFormData({
      providerId: String(p.providerId),
      date: dateStr,
      notes: p.notes || "",
      items: (p.items || []).map((it) => ({
        productId: it.productId ?? null,
        productName: it.productName || "",
        qty: String(it.qty ?? "1"),
        unitPrice: String(it.unitPrice ?? "0"),
        subtotal: Number(it.subtotal) || 0,
      })),
      total: Number(p.total) || 0,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openView = (p) => {
    setIsViewMode(true);
    setEditingId(p.id);

    // Convertir fecha a formato ISO si es un objeto Date
    const dateStr =
      p.date instanceof Date ? p.date.toISOString().slice(0, 10) : p.date || "";

    setFormData({
      providerId: String(p.providerId),
      date: dateStr,
      notes: p.notes || "",
      estado: p.estado || "",
      items: (p.items || []).map((it) => ({
        productId: it.productId ?? null,
        productName: it.productName || "",
        qty: String(it.qty ?? "1"),
        unitPrice: String(it.unitPrice ?? "0"),
        subtotal: Number(it.subtotal) || 0,
      })),
      total: Number(p.total) || 0,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsViewMode(false);
    setEditingId(null);
    setErrors({});
    setActiveSuggestIndex(null);
    setSuggestions([]);
  };

  // ====== Form handlers ======
  const handleTopChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const nextItems = formData.items.map((it, i) => {
      if (i !== index) return it;

      const updated = { ...it, [field]: value };

      const qty = field === "qty" ? value : updated.qty;
      const unitPrice = field === "unitPrice" ? value : updated.unitPrice;
      updated.subtotal = calcSubtotal(qty, unitPrice);

      return updated;
    });

    recalcTotals(nextItems);
  };

  const addItem = () => {
    const next = [
      ...formData.items,
      {
        productId: null,
        productName: "",
        qty: "1",
        unitPrice: "0",
        subtotal: 0,
      },
    ];
    recalcTotals(next);
  };

  const removeItem = (index) => {
    const next = formData.items.filter((_, i) => i !== index);
    recalcTotals(
      next.length
        ? next
        : [
            {
              productId: null,
              productName: "",
              qty: "1",
              unitPrice: "0",
              subtotal: 0,
            },
          ],
    );
  };

  // ✅ FIX: autocomplete sin “pisar” el texto del input (ahora sí se ve lo que escribes)
  const onProductTyping = (index, text) => {
    setFormData((prev) => {
      const items = prev.items.map((it, i) => {
        if (i !== index) return it;
        const updated = {
          ...it,
          productName: text,
          productId: null, // al escribir, se limpia selección
        };
        updated.subtotal = calcSubtotal(updated.qty, updated.unitPrice);
        return updated;
      });

      const total = items.reduce(
        (acc, it) => acc + (Number(it.subtotal) || 0),
        0,
      );
      return { ...prev, items, total };
    });

    const q = text.trim().toLowerCase();
    if (!q) {
      setActiveSuggestIndex(null);
      setSuggestions([]);
      return;
    }

    const matches = products
      .filter(
        (p) =>
          p.nombre_producto?.toLowerCase().includes(q) ||
          p.nombre?.toLowerCase().includes(q),
      )
      .slice(0, 6);
    setActiveSuggestIndex(index);
    setSuggestions(matches);
  };

  const pickSuggestion = (index, product) => {
    const nextItems = formData.items.map((it, i) => {
      if (i !== index) return it;
      const productName =
        product.nombre_producto || product.nombre || product.name || "";
      const productPrice = product.precio_venta || product.price || 0;
      const unitPrice = String(productPrice);
      const qty = it.qty || "1";
      return {
        ...it,
        productId: product.id,
        productName: productName,
        unitPrice,
        subtotal: calcSubtotal(qty, unitPrice),
      };
    });

    recalcTotals(nextItems);
    setActiveSuggestIndex(null);
    setSuggestions([]);
  };

  // ====== Validate & Submit ======
  const validate = () => {
    const newErrors = {};
    if (!formData.providerId)
      newErrors.providerId = "El proveedor es obligatorio";
    if (!formData.date) newErrors.date = "La fecha es obligatoria";

    const itemErrors = [];
    formData.items.forEach((it, idx) => {
      const e = {};
      if (!it.productName.trim()) e.productName = "Producto obligatorio";
      const q = Number(it.qty);
      if (!it.qty.toString().trim() || Number.isNaN(q) || q <= 0)
        e.qty = "Cantidad > 0";
      const p = Number(it.unitPrice);
      if (!it.unitPrice.toString().trim() || Number.isNaN(p) || p < 0)
        e.unitPrice = "Precio >= 0";
      if (Object.keys(e).length) itemErrors[idx] = e;
    });

    if (itemErrors.length) newErrors.items = itemErrors;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return;
    if (!validate()) return;

    const provider = providers.find(
      (p) => String(p.id) === String(formData.providerId),
    );

    const normalizedItems = formData.items.map((it) => {
      const prod = products.find((p) => String(p.id) === String(it.productId));

      const productId = it.productId || null;
      const productName = prod
        ? prod.nombre_producto || prod.nombre || prod.name
        : it.productName.trim();
      const qty = Number(it.qty);
      const unitPrice = Number(it.unitPrice);

      return {
        productId,
        productName,
        qty: Number.isFinite(qty) ? qty : 0,
        unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0,
        subtotal: calcSubtotal(qty, unitPrice),
      };
    });

    const total = normalizedItems.reduce(
      (acc, it) => acc + (it.subtotal || 0),
      0,
    );

    // Preparar datos para el backend
    const backendData = {
      proveedor_id: formData.providerId,
      fecha: formData.date,
      comprobante_factura_proveedor: formData.notes?.trim() || null,
      total_compra: total,
      estado: editingId ? undefined : "pendiente",
      items: normalizedItems,
    };

    try {
      if (editingId) {
        // Update
        await comprasService.update(editingId, backendData);
        alert("Compra actualizada exitosamente");
      } else {
        // Create new
        await comprasService.create(backendData);
        alert("Compra registrada exitosamente");
      }
      await loadData(); // Recargar datos
      closeModal();
    } catch (error) {
      console.error("Error al guardar compra:", error);
      alert(
        "Error al guardar la compra: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const deletePurchase = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta compra?")) return;
    try {
      await comprasService.delete(id);
      alert("Compra eliminada exitosamente");
      await loadData(); // Recargar datos
    } catch (error) {
      console.error("Error al eliminar compra:", error);
      alert(
        "Error al eliminar la compra: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const toggleEstado = async (id) => {
    try {
      const purchase = purchases.find((p) => p.id === id);

      // Ciclar entre los estados: pendiente -> completada -> cancelada -> pendiente
      let newEstado;
      if (purchase.estado === "pendiente") {
        newEstado = "completada";
      } else if (purchase.estado === "completada") {
        newEstado = "cancelada";
      } else {
        newEstado = "pendiente";
      }

      await comprasService.update(id, { estado: newEstado });
      await loadData(); // Recargar datos
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert(
        "Error al cambiar el estado: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  // ✅ cantidad total de productos comprados (sumatoria qty)
  const countProducts = (purchase) =>
    (purchase.items || []).reduce((acc, it) => acc + (Number(it.qty) || 0), 0);

  return (
    <div className="p-6">
      {" "}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-neutral-400 text-lg">Cargando compras...</div>
        </div>
      ) : (
        <>
          {" "}
          {/* ENCABEZADO */}
          <div className="flex items-start md:items-center justify-between mb-4 gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-white tracking-wide">
                Gestión de Compras
              </h2>
              <p className="text-neutral-400 text-sm">
                Administra compras y proveedores.
              </p>
            </div>

            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-5 py-3 rounded-xl shadow-md transition"
            >
              <FiPlus />
              Registrar compra
            </button>
          </div>
          {/* BUSCADOR */}
          <div className="bg-neutral-900/70 border border-neutral-700 rounded-2xl p-6 shadow-lg mb-6">
            <div className="flex items-center bg-neutral-800/70 border border-neutral-600 rounded-xl px-4 py-3 shadow-md">
              <FiSearch className="text-neutral-400 mr-3 text-lg" />
              <input
                type="text"
                placeholder="Buscar compras por proveedor, correo, teléfono o fecha..."
                className="w-full bg-transparent outline-none text-neutral-200 placeholder-neutral-500"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          {/* TABLA (con Productos de nuevo) */}
          <div className="overflow-x-auto bg-neutral-900/70 border border-neutral-700 rounded-2xl shadow-lg">
            <table className="w-full text-left border-collapse">
              <thead className="bg-neutral-800/80 text-neutral-300 text-sm uppercase">
                <tr>
                  <th className="p-3 font-semibold">Proveedor</th>
                  <th className="p-3 font-semibold">Contacto</th>
                  <th className="p-3 font-semibold">Productos</th>
                  <th className="p-3 font-semibold">Fecha</th>
                  <th className="p-3 font-semibold">Total</th>
                  <th className="p-3 font-semibold">Estado</th>
                  <th className="p-3 font-semibold text-center">Acciones</th>
                </tr>
              </thead>

              <tbody className="text-sm text-neutral-200">
                {paginated.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-neutral-700 hover:bg-neutral-800/50 transition"
                  >
                    <td className="p-3 font-medium text-white">
                      {p.providerName}
                    </td>

                    <td className="p-3 text-neutral-300">
                      <div className="leading-5">
                        <div className="text-neutral-200">
                          {p.providerEmail || "—"}
                        </div>
                        <div className="text-neutral-400">
                          {p.providerPhone || "—"}
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-neutral-300">
                      {countProducts(p)}{" "}
                      <span className="text-neutral-500">und.</span>
                    </td>

                    <td className="p-3 text-neutral-300">
                      {p.date ? p.date.toISOString().slice(0, 10) : ""}
                    </td>

                    <td className="p-3 text-green-400 font-semibold">
                      {money(p.total)}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => toggleEstado(p.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow cursor-pointer transition capitalize
                      ${
                        p.estado === "completada"
                          ? "bg-green-600 text-black hover:bg-green-500"
                          : p.estado === "pendiente"
                            ? "bg-yellow-600 text-black hover:bg-yellow-500"
                            : "bg-red-600 text-black hover:bg-red-500"
                      }`}
                      >
                        {p.estado}
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
                          onClick={() => deletePurchase(p.id)}
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {paginated.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-4 text-center text-neutral-400"
                    >
                      No se encontraron compras.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* PAGINACIÓN */}
            <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 border-t border-neutral-800 gap-3 text-sm text-neutral-300">
              <span>
                Mostrando{" "}
                {filtered.length === 0
                  ? "0"
                  : `${startIndex + 1}–${Math.min(startIndex + itemsPerPage, filtered.length)}`}{" "}
                de {filtered.length} compras
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg border border-neutral-700 bg-neutral-800 disabled:opacity-40 hover:bg-neutral-700"
                >
                  Anterior
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
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
                  ),
                )}

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
          {/* MODAL */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto text-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    {isViewMode
                      ? "Ver Compra"
                      : editingId
                        ? "Editar Compra"
                        : "Registrar Nueva Compra"}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-neutral-400 hover:text-neutral-200"
                  >
                    ✖
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Proveedor + Fecha + Estado */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300">
                        Proveedor <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="providerId"
                        className={`${inputBase} ${errors.providerId ? "border-red-500" : ""} ${
                          isViewMode ? disabledInput : ""
                        }`}
                        value={formData.providerId}
                        onChange={handleTopChange}
                        disabled={isViewMode}
                      >
                        <option value="">Seleccionar proveedor...</option>
                        {providers.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre_o_razon_social || p.nombre || p.name}
                          </option>
                        ))}
                      </select>
                      {errors.providerId && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.providerId}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-300">
                        Fecha <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        className={`${inputBase} ${errors.date ? "border-red-500" : ""} ${
                          isViewMode ? disabledInput : ""
                        }`}
                        value={formData.date}
                        onChange={handleTopChange}
                        disabled={isViewMode}
                      />
                      {errors.date && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.date}
                        </p>
                      )}
                    </div>

                    {isViewMode && formData.estado && (
                      <div>
                        <label className="block text-sm font-medium text-neutral-300">
                          Estado
                        </label>
                        <div className="mt-1">
                          <span
                            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                              formData.estado === "completada"
                                ? "bg-green-600 text-black"
                                : formData.estado === "pendiente"
                                  ? "bg-yellow-600 text-black"
                                  : "bg-red-600 text-black"
                            }`}
                          >
                            {formData.estado}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Productos */}
                  <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">Productos</h4>

                      {!isViewMode && (
                        <button
                          type="button"
                          onClick={addItem}
                          className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-xl"
                        >
                          <FiPlus />
                          Agregar producto
                        </button>
                      )}
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="text-neutral-300 text-xs uppercase">
                          <tr>
                            <th className="p-2">Producto</th>
                            <th className="p-2">Cantidad</th>
                            <th className="p-2">Precio Unidad</th>
                            <th className="p-2">Total parcial</th>
                            <th className="p-2 text-center">Acción</th>
                          </tr>
                        </thead>

                        <tbody className="text-sm">
                          {formData.items.map((it, idx) => {
                            const itemErr =
                              (errors.items && errors.items[idx]) || {};

                            return (
                              <tr
                                key={idx}
                                className="border-t border-neutral-800"
                              >
                                {/* Producto con autocomplete */}
                                <td
                                  className="p-2 relative"
                                  ref={
                                    idx === activeSuggestIndex
                                      ? suggestBoxRef
                                      : null
                                  }
                                >
                                  <input
                                    type="text"
                                    value={it.productName}
                                    onChange={(e) =>
                                      onProductTyping(idx, e.target.value)
                                    }
                                    disabled={isViewMode}
                                    placeholder="Escribe para buscar..."
                                    className={`w-full p-3 bg-neutral-800 border rounded-xl text-neutral-200 caret-white outline-none focus:border-green-500 ${
                                      itemErr.productName
                                        ? "border-red-500"
                                        : "border-neutral-700"
                                    } ${isViewMode ? disabledInput : ""}`}
                                  />

                                  {activeSuggestIndex === idx &&
                                    suggestions.length > 0 &&
                                    !isViewMode && (
                                      <div className="absolute z-50 mt-2 w-full bg-neutral-900 border border-neutral-700 rounded-xl shadow-xl overflow-hidden">
                                        {suggestions.map((p) => {
                                          const productName =
                                            p.nombre_producto ||
                                            p.nombre ||
                                            p.name ||
                                            "Sin nombre";
                                          const productPrice =
                                            p.precio_venta || p.price || 0;
                                          return (
                                            <button
                                              key={p.id}
                                              type="button"
                                              onClick={() =>
                                                pickSuggestion(idx, p)
                                              }
                                              className="w-full text-left px-4 py-3 hover:bg-neutral-800 text-neutral-200"
                                            >
                                              <div className="font-medium">
                                                {productName}
                                              </div>
                                              <div className="text-xs text-neutral-400">
                                                {money(productPrice)}
                                              </div>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}

                                  {itemErr.productName && (
                                    <p className="text-xs text-red-400 mt-1">
                                      {itemErr.productName}
                                    </p>
                                  )}
                                </td>

                                {/* Cantidad */}
                                <td className="p-2">
                                  <input
                                    type="number"
                                    value={it.qty}
                                    onChange={(e) =>
                                      handleItemChange(
                                        idx,
                                        "qty",
                                        e.target.value,
                                      )
                                    }
                                    disabled={isViewMode}
                                    min="0"
                                    className={`w-full p-3 bg-neutral-800 border rounded-xl text-neutral-200 outline-none focus:border-green-500 ${
                                      itemErr.qty
                                        ? "border-red-500"
                                        : "border-neutral-700"
                                    } ${isViewMode ? disabledInput : ""}`}
                                  />
                                  {itemErr.qty && (
                                    <p className="text-xs text-red-400 mt-1">
                                      {itemErr.qty}
                                    </p>
                                  )}
                                </td>

                                {/* Precio unitario */}
                                <td className="p-2">
                                  <input
                                    type="number"
                                    value={it.unitPrice}
                                    onChange={(e) =>
                                      handleItemChange(
                                        idx,
                                        "unitPrice",
                                        e.target.value,
                                      )
                                    }
                                    disabled={isViewMode}
                                    min="0"
                                    className={`w-full p-3 bg-neutral-800 border rounded-xl text-neutral-200 outline-none focus:border-green-500 ${
                                      itemErr.unitPrice
                                        ? "border-red-500"
                                        : "border-neutral-700"
                                    } ${isViewMode ? disabledInput : ""}`}
                                    onFocus={() => {
                                      if (isViewMode) return;
                                      if (String(it.unitPrice) === "0")
                                        handleItemChange(idx, "unitPrice", "");
                                    }}
                                  />
                                  {itemErr.unitPrice && (
                                    <p className="text-xs text-red-400 mt-1">
                                      {itemErr.unitPrice}
                                    </p>
                                  )}
                                </td>

                                <td className="p-2 font-semibold text-green-400">
                                  {money(it.subtotal)}
                                </td>

                                <td className="p-2 text-center">
                                  {!isViewMode && (
                                    <button
                                      type="button"
                                      onClick={() => removeItem(idx)}
                                      className="bg-red-600 hover:bg-red-500 text-black p-2 rounded-lg shadow"
                                      title="Eliminar fila"
                                    >
                                      <FiTrash2 />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Total */}
                    <div className="flex justify-end mt-4">
                      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 w-full md:w-80">
                        <div className="flex items-center justify-between text-sm text-neutral-300">
                          <span>Total</span>
                          <span className="text-green-400 font-semibold">
                            {money(formData.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Observaciones */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-300">
                      Observaciones
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      className={`${inputBase} ${isViewMode ? disabledInput : ""}`}
                      placeholder="Notas adicionales de la compra..."
                      value={formData.notes}
                      onChange={handleTopChange}
                      disabled={isViewMode}
                    />
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
                        {editingId ? "Guardar cambios" : "Registrar compra"}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
