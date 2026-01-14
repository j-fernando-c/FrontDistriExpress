// src/pages/Purchases.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { compraService } from "../services/compraService";
import { proveedorService } from "../services/proveedorService";
import { productosService } from "../services/productosService";

export default function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [providersList, setProvidersList] = useState([]);
  const [productsList, setProductsList] = useState([]);

  // ====== Data para autocomplete ======
  const PRODUCTS = useMemo(
    () => [
      { id: 1, name: "Arroz Integral", price: 4800 },
      { id: 2, name: "Aceite de Oliva", price: 12900 },
      { id: 3, name: "Harina de Trigo", price: 6200 },
      { id: 4, name: "Lentejas", price: 5400 },
      { id: 5, name: "Azúcar", price: 3900 },
      { id: 6, name: "Sal", price: 1200 },
      { id: 7, name: "Café", price: 8900 },
    ],
    []
  );

  const PROVIDERS = useMemo(
    () => [
      {
        id: 1,
        name: "Distribuidora Nacional de Granos S.A.S.",
        email: "compras@granos.com",
        phone: "3001234567",
      },
      {
        id: 2,
        name: "Aceites Premium Colombia Ltda.",
        email: "contacto@aceitespremium.com",
        phone: "3109876543",
      },
      {
        id: 3,
        name: "Harinas y Derivados La Espiga Ltda.",
        email: "ventas@laespiga.com",
        phone: "3155552222",
      },
    ],
    []
  );

  useEffect(() => {
    loadData();
    loadProviders();
    loadProducts();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await compraService.getAll();
      const purchasesData = (response.data || []).map((c) => ({
        id: c.id,
        providerId: c.proveedor_id,
        providerName: c.proveedor_id ? `Proveedor ${c.proveedor_id}` : "Sin proveedor",
        providerEmail: "",
        providerPhone: "",
        date: c.fecha ? c.fecha.split("T")[0] : "",
        estado: c.estado || "Activo",
        items: [],
        total: c.total_compra || 0,
        notes: "",
      }));
      setPurchases(purchasesData);
    } catch (err) {
      setError(err.message || "Error al cargar compras");
      console.error("Error cargando compras:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadProviders = async () => {
    try {
      const response = await proveedorService.getAll();
      const providersData = (response.data || []).map((p) => ({
        id: p.id,
        name: p.nombre,
        email: p.email || "",
        phone: p.contacto || p.telefono || "",
      }));
      if (providersData.length > 0) {
        setProvidersList(providersData);
      }
    } catch (err) {
      console.error("Error cargando proveedores:", err);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productosService.getAll();
      const productsData = (response.data || []).map((p) => ({
        id: p.id,
        name: p.nombre,
        price: p.precio || 0,
      }));
      if (productsData.length > 0) {
        setProductsList(productsData);
      }
    } catch (err) {
      console.error("Error cargando productos:", err);
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
    items: [{ productId: null, productName: "", qty: "1", unitPrice: "0", subtotal: 0 }],
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
    const total = items.reduce((acc, it) => acc + (Number(it.subtotal) || 0), 0);
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
    setFormData({
      providerId: String(p.providerId),
      date: p.date || "",
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
    setFormData({
      providerId: String(p.providerId),
      date: p.date || "",
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
      { productId: null, productName: "", qty: "1", unitPrice: "0", subtotal: 0 },
    ];
    recalcTotals(next);
  };

  const removeItem = (index) => {
    const next = formData.items.filter((_, i) => i !== index);
    recalcTotals(
      next.length
        ? next
        : [{ productId: null, productName: "", qty: "1", unitPrice: "0", subtotal: 0 }]
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

      const total = items.reduce((acc, it) => acc + (Number(it.subtotal) || 0), 0);
      return { ...prev, items, total };
    });

    const q = text.trim().toLowerCase();
    if (!q) {
      setActiveSuggestIndex(null);
      setSuggestions([]);
      return;
    }

    const matches = PRODUCTS.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 6);
    setActiveSuggestIndex(index);
    setSuggestions(matches);
  };

  const pickSuggestion = (index, product) => {
    const nextItems = formData.items.map((it, i) => {
      if (i !== index) return it;
      const unitPrice = String(product.price ?? "0");
      const qty = it.qty || "1";
      return {
        ...it,
        productId: product.id,
        productName: product.name,
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
    if (!formData.providerId) newErrors.providerId = "El proveedor es obligatorio";
    if (!formData.date) newErrors.date = "La fecha es obligatoria";

    const itemErrors = [];
    formData.items.forEach((it, idx) => {
      const e = {};
      if (!it.productName.trim()) e.productName = "Producto obligatorio";
      const q = Number(it.qty);
      if (!it.qty.toString().trim() || Number.isNaN(q) || q <= 0) e.qty = "Cantidad > 0";
      const p = Number(it.unitPrice);
      if (!it.unitPrice.toString().trim() || Number.isNaN(p) || p < 0) e.unitPrice = "Precio >= 0";
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

    const normalizedItems = formData.items.map((it) => {
      const prod =
        [...PRODUCTS, ...productsList].find((p) => p.id === it.productId) ||
        [...PRODUCTS, ...productsList].find((p) => p.name === it.productName);

      const productId = prod?.id ?? it.productId ?? null;
      // const productName = prod?.name ?? it.productName.trim();
      const qty = Number(it.qty);
      const unitPrice = Number(it.unitPrice);

      return {
        producto_id: productId,
        cantidad: Number.isFinite(qty) ? qty : 0,
        precio_unitario: Number.isFinite(unitPrice) ? unitPrice : 0,
        subtotal: calcSubtotal(qty, unitPrice),
      };
    });

    const total = normalizedItems.reduce((acc, it) => acc + (it.subtotal || 0), 0);

    const data = {
      proveedor_id: Number(formData.providerId),
      fecha: formData.date,
      total_compra: total,
      observaciones: formData.notes?.trim() || "",
      estado: "Activo",
      items: normalizedItems,
    };

    try {
      if (editingId) {
        await compraService.update(editingId, data);
      } else {
        await compraService.create(data);
      }
      await loadData();
      closeModal();
    } catch (err) {
      alert(err.message || "Error al guardar compra");
    }
  };

  const deletePurchase = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta compra?")) return;
    try {
      await compraService.delete(id);
      setPurchases((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || "Error al eliminar compra");
    }
  };

  const toggleEstado = async (id) => {
    try {
      await compraService.toggleEstado(id);
      setPurchases((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, estado: p.estado === "ACTIVO" ? "Inactivo" : "Activo" }
            : p
        )
      );
    } catch (err) {
      alert(err.message || "Error al cambiar estado");
    }
  };

  // ✅ cantidad total de productos comprados (sumatoria qty)
  const countProducts = (purchase) =>
    (purchase.items || []).reduce((acc, it) => acc + (Number(it.qty) || 0), 0);

  return (
    <div className="p-6">
      {/* ENCABEZADO */}
      <div className="flex items-start md:items-center justify-between mb-4 gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-wide">Gestión de Compras</h2>
          <p className="text-neutral-400 text-sm">Administra compras y proveedores.</p>
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
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-neutral-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                    Cargando compras...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-red-400">
                  {error}
                  <button
                    onClick={loadData}
                    className="ml-2 text-green-400 hover:underline"
                  >
                    Reintentar
                  </button>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-neutral-400">
                  No se encontraron compras.
                </td>
              </tr>
            ) : (
              paginated.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-neutral-700 hover:bg-neutral-800/50 transition"
                >
                  <td className="p-3 font-medium text-white">{p.providerName}</td>

                  <td className="p-3 text-neutral-300">
                    <div className="leading-5">
                      <div className="text-neutral-200">{p.providerEmail || "—"}</div>
                      <div className="text-neutral-400">{p.providerPhone || "—"}</div>
                    </div>
                  </td>

                  <td className="p-3 text-neutral-300">
                    {countProducts(p)}{" "}
                    <span className="text-neutral-500">und.</span>
                  </td>

                  <td className="p-3 text-neutral-300">{p.date}</td>

                  <td className="p-3 text-green-400 font-semibold">{money(p.total)}</td>

                  <td className="p-3">
                    <button
                      onClick={() => toggleEstado(p.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow cursor-pointer transition
                        ${
                          p.estado === "ACTIVO" || p.estado === "Activo"
                            ? "bg-green-600 text-black hover:bg-green-500"
                            : "bg-red-600 text-black hover:bg-red-500"
                        }`}
                    >
                      {p.estado === "ACTIVO" ? "Activo" : p.estado}
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
              ))
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

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto text-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                {isViewMode ? "Ver Compra" : editingId ? "Editar Compra" : "Registrar Nueva Compra"}
              </h3>
              <button onClick={closeModal} className="text-neutral-400 hover:text-neutral-200">
                ✖
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Proveedor + Fecha */}
              <div className="grid md:grid-cols-2 gap-4">
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
                    {[...PROVIDERS, ...providersList].map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {errors.providerId && <p className="text-xs text-red-400 mt-1">{errors.providerId}</p>}
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
                  {errors.date && <p className="text-xs text-red-400 mt-1">{errors.date}</p>}
                </div>
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
                        const itemErr = (errors.items && errors.items[idx]) || {};

                        return (
                          <tr key={idx} className="border-t border-neutral-800">
                            {/* Producto con autocomplete */}
                            <td className="p-2 relative" ref={idx === activeSuggestIndex ? suggestBoxRef : null}>
                              <input
                                type="text"
                                value={it.productName}
                                onChange={(e) => onProductTyping(idx, e.target.value)}
                                disabled={isViewMode}
                                placeholder="Escribe para buscar..."
                                className={`w-full p-3 bg-neutral-800 border rounded-xl text-neutral-200 caret-white outline-none focus:border-green-500 ${
                                  itemErr.productName ? "border-red-500" : "border-neutral-700"
                                } ${isViewMode ? disabledInput : ""}`}
                              />

                              {activeSuggestIndex === idx && suggestions.length > 0 && !isViewMode && (
                                <div className="absolute z-50 mt-2 w-full bg-neutral-900 border border-neutral-700 rounded-xl shadow-xl overflow-hidden">
                                  {suggestions.map((p) => (
                                    <button
                                      key={p.id}
                                      type="button"
                                      onClick={() => pickSuggestion(idx, p)}
                                      className="w-full text-left px-4 py-3 hover:bg-neutral-800 text-neutral-200"
                                    >
                                      <div className="font-medium">{p.name}</div>
                                      <div className="text-xs text-neutral-400">{money(p.price)}</div>
                                    </button>
                                  ))}
                                </div>
                              )}

                              {itemErr.productName && (
                                <p className="text-xs text-red-400 mt-1">{itemErr.productName}</p>
                              )}
                            </td>

                            {/* Cantidad */}
                            <td className="p-2">
                              <input
                                type="number"
                                value={it.qty}
                                onChange={(e) => handleItemChange(idx, "qty", e.target.value)}
                                disabled={isViewMode}
                                min="0"
                                className={`w-full p-3 bg-neutral-800 border rounded-xl text-neutral-200 outline-none focus:border-green-500 ${
                                  itemErr.qty ? "border-red-500" : "border-neutral-700"
                                } ${isViewMode ? disabledInput : ""}`}
                              />
                              {itemErr.qty && <p className="text-xs text-red-400 mt-1">{itemErr.qty}</p>}
                            </td>

                            {/* Precio unitario */}
                            <td className="p-2">
                              <input
                                type="number"
                                value={it.unitPrice}
                                onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
                                disabled={isViewMode}
                                min="0"
                                className={`w-full p-3 bg-neutral-800 border rounded-xl text-neutral-200 outline-none focus:border-green-500 ${
                                  itemErr.unitPrice ? "border-red-500" : "border-neutral-700"
                                } ${isViewMode ? disabledInput : ""}`}
                                onFocus={() => {
                                  if (isViewMode) return;
                                  if (String(it.unitPrice) === "0") handleItemChange(idx, "unitPrice", "");
                                }}
                              />
                              {itemErr.unitPrice && (
                                <p className="text-xs text-red-400 mt-1">{itemErr.unitPrice}</p>
                              )}
                            </td>

                            <td className="p-2 font-semibold text-green-400">{money(it.subtotal)}</td>

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
                      <span className="text-green-400 font-semibold">{money(formData.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-medium text-neutral-300">Observaciones</label>
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
    </div>
  );
}
