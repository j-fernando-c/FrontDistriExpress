// src/pages/Pedidos.jsx
import { useMemo, useState, useEffect } from "react";
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiFileText,
} from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { pedidosService } from "../services/pedidosService";

// Productos disponibles solo para el front (precio para calcular totales)
const AVAILABLE_PRODUCTS = [
  { id: "p1", nombre: "Arroz integral", precio: 12.5 },
  { id: "p2", nombre: "Aceite de Oliva Extra Virgen", precio: 23.8 },
  { id: "p3", nombre: "Quinua Real", precio: 12.8 },
  { id: "p4", nombre: "Harina de Almendras", precio: 22.5 },
];

// ===== Autocomplete (sin estilos nuevos; usa tus clases) =====
function AutocompleteInput({
  value,
  onChange,
  onPick,
  disabled,
  placeholder,
  items,
  inputClassName,
}) {
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = (value || "").toLowerCase().trim();
    if (!q) return items.slice(0, 8);
    return items.filter((it) => it.toLowerCase().includes(q)).slice(0, 8);
  }, [value, items]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        className={inputClassName}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => !disabled && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />

      {open && !disabled && (
        <div className="absolute z-50 mt-2 w-full bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg overflow-hidden">
          {filtered.length ? (
            filtered.map((it) => (
              <button
                key={it}
                type="button"
                className="w-full text-left px-4 py-2 hover:bg-neutral-800 text-neutral-200"
                onMouseDown={(ev) => ev.preventDefault()}
                onClick={() => {
                  onPick(it);
                  setOpen(false);
                }}
              >
                <div className="font-semibold">{it}</div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-neutral-400">
              Sin resultados
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Pedidos() {
  // ===== Listas quemadas =====
  const CLIENTES = useMemo(
    () => [
      "Restaurante El Buen Sabor",
      "Supermercado La Canasta",
      "Panadería Santa Marta",
      "Tienda Naturista Vida Sana",
      "Hotel Los Pinos",
      "Cafetería Central",
      "Mercado La Esquina",
      "Distribuidora Andina",
      "Restaurante Don Pepe",
      "Minimercado La 14",
    ],
    [],
  );

  const VENDEDORES = useMemo(
    () => ["Carlos Mendoza", "María González", "Juan Pérez", "María Torres"],
    [],
  );

  const PRODUCTOS_SUGERIDOS = useMemo(
    () => AVAILABLE_PRODUCTS.map((p) => p.nombre),
    [],
  );

  // ✅ Estados (4)
  const ESTADOS = useMemo(
    () => ["confirmado", "en_preparacion", "enviado", "entregado", "cancelado"], // servicio de pedidos (importado arriba)
    [],
  );

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const mapBackendToFrontend = (o) => ({
    id: o.id,
    cliente: o.cliente_nombre ?? o.cliente ?? "",
    telefono: o.cliente_telefono ?? o.telefono ?? "",
    fechaEntrega: o.fecha ? o.fecha.split("T")[0] : (o.fechaEntrega ?? ""),
    vendedor: o.domiciliario_nombre ?? o.vendedor ?? "",
    direccion: o.cliente_direccion ?? o.direccion ?? "",
    estado: o.estado
      ? String(o.estado).charAt(0).toUpperCase() + String(o.estado).slice(1)
      : "",
    items: o.items ?? [],
    observaciones: o.observaciones ?? "",
    total: o.total ? parseFloat(o.total) : (o.total ?? 0),
  });

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await pedidosService.getAll();
      const list = res?.data ?? res ?? [];
      const mapped = Array.isArray(list) ? list.map(mapBackendToFrontend) : [];
      setOrders(mapped);
    } catch (err) {
      console.error(err);
      setError("Error cargando pedidos");
    } finally {
      setLoading(false);
    }
  };

  const [search, setSearch] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const emptyProduct = () => ({
    name: "",
    qty: "1",
    price: "0",
  });

  const [formData, setFormData] = useState({
    cliente: "",
    telefono: "",
    fechaEntrega: "",
    vendedor: "",
    direccion: "",
    productos: [emptyProduct()],
    observaciones: "",
  });

  // ===== FILTRO + PAGINACIÓN =====
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredOrders = orders.filter((o) => {
    const term = search.toLowerCase();
    return (
      o.cliente.toLowerCase().includes(term) ||
      o.telefono.toLowerCase().includes(term) ||
      o.vendedor.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / itemsPerPage),
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
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

  // ===== Helpers =====
  const buildFormFromOrder = (order) => ({
    cliente: order.cliente,
    telefono: order.telefono,
    fechaEntrega: order.fechaEntrega,
    vendedor: order.vendedor,
    direccion: order.direccion,
    productos:
      order.items && order.items.length
        ? order.items.map((it) => ({
            name: it.nombre,
            qty: String(it.cantidad),
            price: String(it.precio),
          }))
        : [emptyProduct()],
    observaciones: order.observaciones || "",
  });

  const openForm = (order = null) => {
    setIsReadOnly(false);
    if (order) {
      setEditingId(order.id);
      setFormData(buildFormFromOrder(order));
    } else {
      setEditingId(null);
      setFormData({
        cliente: "",
        telefono: "",
        fechaEntrega: "",
        vendedor: "",
        direccion: "",
        productos: [emptyProduct()],
        observaciones: "",
      });
    }
    setIsFormOpen(true);
  };

  const openView = (order) => {
    setIsReadOnly(true);
    setEditingId(order.id);
    setFormData(buildFormFromOrder(order));
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsReadOnly(false);
    setEditingId(null);
  };

  const validateForm = () => {
    if (!formData.cliente.trim()) {
      alert("El cliente es obligatorio");
      return false;
    }
    if (!formData.telefono.trim()) {
      alert("El teléfono es obligatorio");
      return false;
    }
    if (!formData.fechaEntrega) {
      alert("La fecha de entrega es obligatoria");
      return false;
    }
    if (!formData.vendedor.trim()) {
      alert("El vendedor es obligatorio");
      return false;
    }
    if (!formData.direccion.trim()) {
      alert("La dirección de entrega es obligatoria");
      return false;
    }

    const algunProductoValido = formData.productos.some((p) => {
      const qtyNum = parseFloat(p.qty);
      const priceNum = parseFloat(p.price);
      return p.name.trim() && qtyNum > 0 && priceNum >= 0;
    });

    if (!algunProductoValido) {
      alert("Debe agregar al menos un producto válido");
      return false;
    }

    return true;
  };

  const calcularSubtotal = () =>
    formData.productos.reduce((acc, p) => {
      const qtyNum = parseFloat(p.qty) || 0;
      const priceNum = parseFloat(p.price) || 0;
      return acc + qtyNum * priceNum;
    }, 0);

  const calcularTotal = () => Math.max(0, calcularSubtotal());

  // ===== Productos dinámicos (como ventas) =====
  const addProducto = () => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      productos: [...prev.productos, emptyProduct()],
    }));
  };

  const removeProducto = (index) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const productos = prev.productos.filter((_, i) => i !== index);
      return {
        ...prev,
        productos: productos.length ? productos : [emptyProduct()],
      };
    });
  };

  const updateProducto = (index, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const productos = prev.productos.map((p, i) =>
        i === index ? { ...p, [field]: value } : p,
      );
      return { ...prev, productos };
    });
  };

  // ✅ al seleccionar sugerencia, si existe en AVAILABLE_PRODUCTS, pone precio
  const pickProducto = (index, nombre) => {
    const found = AVAILABLE_PRODUCTS.find((p) => p.nombre === nombre);
    if (found) {
      updateProducto(index, "name", found.nombre);
      updateProducto(index, "price", String(found.precio));
      return;
    }
    updateProducto(index, "name", nombre);
  };

  const saveOrder = () => {
    if (isReadOnly) return;
    if (!validateForm()) return;

    const items = formData.productos
      .filter((p) => {
        const qtyNum = parseFloat(p.qty);
        const priceNum = parseFloat(p.price);
        return p.name.trim() && qtyNum > 0 && priceNum >= 0;
      })
      .map((p) => {
        const qty = parseFloat(p.qty) || 0;
        const price = parseFloat(p.price) || 0;
        const found = AVAILABLE_PRODUCTS.find(
          (ap) => ap.nombre === p.name.trim(),
        );
        return {
          productoId: found ? found.id : `x-${p.name.trim()}`,
          nombre: p.name.trim(),
          cantidad: qty,
          precio: price,
          subtotal: qty * price,
        };
      });

    const total = items.reduce((sum, it) => sum + it.subtotal, 0);

    if (editingId) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === editingId
            ? {
                ...o,
                cliente: formData.cliente,
                telefono: formData.telefono,
                fechaEntrega: formData.fechaEntrega,
                vendedor: formData.vendedor,
                direccion: formData.direccion,
                items,
                observaciones: formData.observaciones,
                total,
              }
            : o,
        ),
      );
    } else {
      const newId = orders.length
        ? Math.max(...orders.map((o) => o.id)) + 1
        : 1;

      setOrders((prev) => [
        ...prev,
        {
          id: newId,
          cliente: formData.cliente,
          telefono: formData.telefono,
          fechaEntrega: formData.fechaEntrega,
          vendedor: formData.vendedor,
          direccion: formData.direccion,
          items,
          observaciones: formData.observaciones,
          estado: "Pendiente",
          total,
        },
      ]);
    }

    closeForm();
  };

  const deleteOrder = (id) => {
    if (!confirm("¿Seguro que deseas eliminar este pedido?")) return;
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  // ✅ toggle 4 estados
  const toggleEstado = (id) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const idx = ESTADOS.indexOf(o.estado);
        const next = ESTADOS[(idx + 1) % ESTADOS.length] || "Pendiente";
        return { ...o, estado: next };
      }),
    );
  };

  const estadoClasses = (estado) => {
    const s = String(estado || "").toLowerCase();
    if (s === "confirmado") return "bg-green-600 text-black hover:bg-green-500";
    if (s === "en_preparacion")
      return "bg-yellow-500 text-black hover:bg-yellow-400";
    if (s === "enviado") return "bg-blue-600 text-black hover:bg-blue-500";
    if (s === "entregado") return "bg-green-700 text-black hover:bg-green-600";
    if (s === "cancelado") return "bg-red-600 text-black hover:bg-red-500";
    return "bg-neutral-700 text-white";
  };

  // ===== PDF =====
  const generatePdf = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Comprobante de Pedido", 105, 15, { align: "center" });

    doc.setFontSize(11);
    doc.text(`Cliente: ${order.cliente}`, 14, 30);
    doc.text(`Teléfono: ${order.telefono}`, 14, 37);
    doc.text(`Vendedor: ${order.vendedor}`, 14, 44);
    doc.text(`Fecha de entrega: ${order.fechaEntrega}`, 14, 51);
    doc.text("Dirección de entrega:", 14, 58);
    doc.text(order.direccion, 14, 65, { maxWidth: 180 });

    const productosData = order.items.map((p) => [
      p.nombre,
      p.cantidad,
      `$ ${p.precio.toFixed(2)}`,
      `$ ${p.subtotal.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 75,
      head: [["Producto", "Cant.", "Precio Unit.", "Subtotal"]],
      body: productosData,
    });

    const finalY = doc.lastAutoTable?.finalY || 75;

    doc.setFontSize(11);
    doc.text(`TOTAL: $ ${order.total.toFixed(2)}`, 14, finalY + 10);
    doc.text(`Estado: ${order.estado}`, 14, finalY + 18);

    if (order.observaciones) {
      doc.text("Observaciones:", 14, finalY + 28);
      doc.text(order.observaciones, 14, finalY + 35, { maxWidth: 180 });
    }

    doc.save(`pedido-${order.id}.pdf`);
  };

  // ===== RENDER =====
  return (
    <div className="">
      {/* ENCABEZADO + BOTÓN */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-wide">
            Gestión de Pedidos
          </h2>
          <p className="text-neutral-400 text-sm">
            Administra pedidos de clientes y distribuidores.
          </p>
        </div>

        <button
          onClick={() => openForm()}
          className="mt-3 md:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-5 py-3 rounded-xl shadow-md transition"
        >
          <FiPlus />
          Nuevo pedido
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-neutral-900/70 border border-neutral-700 rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex items-center bg-neutral-800/70 border border-neutral-600 rounded-xl px-4 py-3 shadow-md">
          <FiSearch className="text-neutral-400 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Buscar pedidos (cliente, teléfono, vendedor)..."
            className="w-full bg-transparent outline-none text-neutral-200 placeholder-neutral-500"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* TABLA (sin columna ID visible) */}
      <div className="overflow-x-auto bg-neutral-900/70 border border-neutral-700 rounded-2xl shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-neutral-800/80 text-neutral-300 text-sm uppercase">
            <tr>
              <th className="p-3 font-semibold">Cliente</th>
              <th className="p-3 font-semibold">Fecha entrega</th>
              <th className="p-3 font-semibold">Vendedor</th>
              <th className="p-3 font-semibold">Estado</th>
              <th className="p-3 font-semibold">Total</th>
              <th className="p-3 font-semibold text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-sm text-neutral-200">
            {paginatedOrders.map((o) => (
              <tr
                key={o.id}
                className="border-t border-neutral-700 hover:bg-neutral-800/50 transition"
              >
                <td className="p-3">
                  <div className="font-semibold">{o.cliente}</div>
                  <div className="text-xs text-neutral-400">{o.telefono}</div>
                </td>

                <td className="p-3">{o.fechaEntrega}</td>

                <td className="p-3">{o.vendedor}</td>

                <td className="p-3">
                  <button
                    onClick={() => toggleEstado(o.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow cursor-pointer transition ${estadoClasses(
                      o.estado,
                    )}`}
                  >
                    {o.estado}
                  </button>
                </td>

                <td className="p-3 font-semibold text-green-400">
                  ${o.total.toFixed(2)}
                </td>

                <td className="p-3">
                  <div className="flex justify-center gap-3">
                    {/* VER (solo lectura) */}
                    <button
                      className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg shadow text-white"
                      onClick={() => openView(o)}
                    >
                      <FiEye className="text-lg" />
                    </button>

                    {/* PDF */}
                    <button
                      className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg shadow text-white"
                      onClick={() => generatePdf(o)}
                    >
                      <FiFileText className="text-lg" />
                    </button>

                    {/* EDITAR */}
                    <button
                      className="bg-green-600 hover:bg-green-500 text-black p-2 rounded-lg shadow"
                      onClick={() => openForm(o)}
                    >
                      <FiEdit2 className="text-lg" />
                    </button>

                    {/* ELIMINAR */}
                    <button
                      className="bg-red-600 hover:bg-red-500 text-black p-2 rounded-lg shadow"
                      onClick={() => deleteOrder(o.id)}
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginatedOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-neutral-400">
                  No se encontraron pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINACIÓN */}
        <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 border-t border-neutral-800 gap-3 text-sm text-neutral-300">
          <span>
            Mostrando{" "}
            {filteredOrders.length === 0
              ? "0"
              : `${startIndex + 1}–${Math.min(
                  startIndex + itemsPerPage,
                  filteredOrders.length,
                )}`}{" "}
            de {filteredOrders.length} pedidos
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

      {/* MODAL FORM (Crear / Editar / Ver) */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-white">
              {isReadOnly
                ? "Detalle de Pedido"
                : editingId
                  ? "Editar Pedido"
                  : "Registrar Nuevo Pedido"}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isReadOnly) {
                  closeForm();
                  return;
                }
                saveOrder();
              }}
              className="space-y-6 text-neutral-200"
            >
              {/* INFORMACIÓN DEL CLIENTE */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-200 mb-2 flex items-center gap-2">
                  <span className="text-green-500">▮</span>
                  Información del Cliente
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* ✅ Cliente (buscador) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-neutral-300">
                      Cliente <span className="text-red-500">*</span>
                    </label>

                    <AutocompleteInput
                      value={formData.cliente}
                      disabled={isReadOnly}
                      placeholder="Nombre del cliente"
                      items={CLIENTES}
                      inputClassName={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                        isReadOnly
                          ? "opacity-70 cursor-not-allowed"
                          : "focus:border-green-500"
                      }`}
                      onChange={(val) =>
                        setFormData((prev) => ({ ...prev, cliente: val }))
                      }
                      onPick={(val) =>
                        setFormData((prev) => ({ ...prev, cliente: val }))
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-neutral-300">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Número de teléfono"
                      className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                        isReadOnly
                          ? "opacity-70 cursor-not-allowed"
                          : "focus:border-green-500"
                      }`}
                      value={formData.telefono}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          telefono: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-neutral-300">
                      Fecha de Entrega <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                        isReadOnly
                          ? "opacity-70 cursor-not-allowed"
                          : "focus:border-green-500"
                      }`}
                      value={formData.fechaEntrega}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          fechaEntrega: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* ✅ Vendedor (dropdown) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-neutral-300">
                      Vendedor <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                        isReadOnly
                          ? "opacity-70 cursor-not-allowed"
                          : "focus:border-green-500"
                      }`}
                      value={formData.vendedor}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          vendedor: e.target.value,
                        }))
                      }
                    >
                      <option value="">Seleccionar vendedor</option>
                      {VENDEDORES.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-neutral-300">
                      Dirección de Entrega{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Dirección completa de entrega"
                      className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                        isReadOnly
                          ? "opacity-70 cursor-not-allowed"
                          : "focus:border-green-500"
                      }`}
                      value={formData.direccion}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          direccion: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* PRODUCTOS (como ventas) */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-neutral-200 font-semibold">Productos</h4>

                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={addProducto}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black text-sm font-semibold px-3 py-2 rounded-lg"
                    >
                      <FiPlus className="text-sm" /> Agregar Producto
                    </button>
                  )}
                </div>

                <div className="bg-neutral-800/70 border border-neutral-700 rounded-2xl p-4 space-y-3">
                  <div className="grid grid-cols-12 gap-3 text-xs text-neutral-400 mb-1">
                    <span className="col-span-5">Producto</span>
                    <span className="col-span-2 text-center">Cantidad</span>
                    <span className="col-span-2 text-center">Precio Unit.</span>
                    <span className="col-span-2 text-center">Subtotal</span>
                    <span className="col-span-1 text-center">Acción</span>
                  </div>

                  {formData.productos.map((p, index) => {
                    const qtyNum = parseFloat(p.qty) || 0;
                    const priceNum = parseFloat(p.price) || 0;
                    const subtotal = qtyNum * priceNum;

                    return (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-3 items-center"
                      >
                        {/* ✅ Producto (buscador) */}
                        <div className="col-span-5">
                          <AutocompleteInput
                            value={p.name}
                            disabled={isReadOnly}
                            placeholder="Producto"
                            items={PRODUCTOS_SUGERIDOS}
                            inputClassName={`w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-neutral-200 outline-none ${
                              !isReadOnly && "focus:border-green-500"
                            } ${isReadOnly && "opacity-70 cursor-not-allowed"}`}
                            onChange={(val) =>
                              updateProducto(index, "name", val)
                            }
                            onPick={(val) => pickProducto(index, val)}
                          />
                        </div>

                        <input
                          type="number"
                          min="0"
                          className={`col-span-2 p-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-neutral-200 text-center outline-none ${
                            !isReadOnly && "focus:border-green-500"
                          } ${isReadOnly && "opacity-70 cursor-not-allowed"}`}
                          value={p.qty}
                          disabled={isReadOnly}
                          onChange={(e) =>
                            updateProducto(index, "qty", e.target.value)
                          }
                        />

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className={`col-span-2 p-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-neutral-200 text-center outline-none ${
                            !isReadOnly && "focus:border-green-500"
                          } ${isReadOnly && "opacity-70 cursor-not-allowed"}`}
                          value={p.price}
                          disabled={isReadOnly}
                          onChange={(e) =>
                            updateProducto(index, "price", e.target.value)
                          }
                        />

                        <div className="col-span-2 text-center text-sm text-neutral-100">
                          ${subtotal.toFixed(2)}
                        </div>

                        <div className="col-span-1 flex justify-center">
                          {!isReadOnly && (
                            <button
                              type="button"
                              onClick={() => removeProducto(index)}
                              className="bg-red-600 hover:bg-red-500 text-black text-xs px-2 py-1 rounded-lg"
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end text-sm mt-3">
                  <span className="text-neutral-300 mr-2">
                    Total del pedido:
                  </span>
                  <span className="font-semibold text-green-400">
                    $ {calcularTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* OBSERVACIONES */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-200 mb-2 flex items-center gap-2">
                  <span className="text-green-500">▮</span>
                  Observaciones
                </h4>
                <textarea
                  rows={3}
                  placeholder="Observaciones especiales para el pedido..."
                  className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                    isReadOnly
                      ? "opacity-70 cursor-not-allowed"
                      : "focus:border-green-500"
                  }`}
                  value={formData.observaciones}
                  disabled={isReadOnly}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      observaciones: e.target.value,
                    }))
                  }
                />
              </div>

              {/* BOTONES */}
              <div className="flex justify-end gap-3 mt-2">
                {isReadOnly ? (
                  <button
                    type="button"
                    className="px-5 py-2 bg-neutral-700 text-neutral-200 hover:bg-neutral-600 rounded-xl transition"
                    onClick={closeForm}
                  >
                    Cerrar
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="px-5 py-2 bg-neutral-700 text-neutral-200 hover:bg-neutral-600 rounded-xl transition"
                      onClick={closeForm}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-green-600 hover:bg-green-500 text-black font-semibold rounded-xl transition"
                    >
                      {editingId ? "Guardar cambios" : "Crear Pedido"}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
