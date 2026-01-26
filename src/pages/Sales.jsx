// src/pages/Sales.jsx
import { useMemo, useRef, useState, useEffect } from "react";
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiFileText,
  FiDollarSign,
  FiList,
} from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ventasService } from "../services/ventasService";
import { abonosService } from "../services/abonosService";
import { clientesService } from "../services/clientesService";
import { productosService } from "../services/productosService";
import { domiciliariosService } from "../services/domiciliariosService";

export default function Sales() {
  // ===== DATOS =====
  const [sales, setSales] = useState([]);
  const [abonos, setAbonos] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [domiciliarios, setDomiciliarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        loadSales(),
        loadAbonos(),
        loadClients(),
        loadProducts(),
        loadDomiciliarios(),
      ]);
    } catch (err) {
      setError(err.message || "Error al cargar datos");
      console.error("Error cargando datos iniciales:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSales = async () => {
    try {
      const response = await ventasService.getAll();
      setSales(response.data || []);
    } catch (err) {
      console.error("Error cargando ventas:", err);
      throw err;
    }
  };

  const loadAbonos = async () => {
    try {
      const response = await abonosService.getAll();
      setAbonos(response.data || []);
    } catch (err) {
      console.error("Error cargando abonos:", err);
    }
  };

  const loadClients = async () => {
    try {
      const response = await clientesService.getAll();
      setClients(response.data || []);
    } catch (err) {
      console.error("Error cargando clientes:", err);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productosService.getAll();
      setProducts(response.data || []);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  const loadDomiciliarios = async () => {
    try {
      const response = await domiciliariosService.getAll();
      setDomiciliarios(response.data || []);
    } catch (err) {
      console.error("Error cargando domiciliarios:", err);
    }
  };

  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // modal abonos
  const [isAbonosOpen, setIsAbonosOpen] = useState(false);
  const [selectedVentaResumen, setSelectedVentaResumen] = useState(null);
  const [loadingResumen, setLoadingResumen] = useState(false);
  const [selectedVentaAbonos, setSelectedVentaAbonos] = useState(null);
  const [loadingVentaAbonos, setLoadingVentaAbonos] = useState(false);

  // modo abono
  const [isAbonoMode, setIsAbonoMode] = useState(false);
  const [abonoAmount, setAbonoAmount] = useState("");

  // paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const emptyProduct = () => ({
    name: "",
    qty: "1",
    price: "0",
  });

  const [formData, setFormData] = useState({
    cliente: "",
    cliente_id: "",
    tipoCliente: "Natural",
    nit: "",
    fecha: new Date().toISOString().slice(0, 10),
    vendedor: "",
    vendedor_id: "",
    metodoPago: "Efectivo",
    productos: [emptyProduct()],
    descuento: 0,
    impuestos: 0,
    observaciones: "",
  });

  // ===== AUTOCOMPLETES: estados UI =====
  const [clienteQuery, setClienteQuery] = useState("");
  const [showClienteSuggest, setShowClienteSuggest] = useState(false);

  // para cerrar sugerencias al hacer click afuera
  const clienteWrapRef = useRef(null);

  // ===== FILTRO + PAGINACIÓN =====
  const filteredSales = sales.filter(
    (sale) =>
      (sale.cliente_nombre || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (sale.domiciliario_nombre || "")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSales.length / itemsPerPage),
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSales = filteredSales.slice(
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

  // ===== PRODUCTOS DINÁMICOS =====
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

  const calcularSubtotal = () =>
    formData.productos.reduce((acc, p) => {
      const qtyNum = parseFloat(p.qty) || 0;
      const priceNum = parseFloat(p.price) || 0;
      return acc + qtyNum * priceNum;
    }, 0);

  const calcularTotal = () => {
    const sub = calcularSubtotal();
    const desc = Number(formData.descuento) || 0;
    const imp = Number(formData.impuestos) || 0;
    return Math.max(0, sub - desc + imp);
  };

  const buildFormFromSale = (sale) => ({
    cliente: sale.cliente_nombre || "",
    cliente_id: sale.cliente_id || "",
    tipoCliente: sale.cliente_tipo_documento === "NIT" ? "Jurídico" : "Natural",
    nit: sale.cliente_documento || "",
    fecha: sale.fecha
      ? sale.fecha.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    vendedor: sale.domiciliario_nombre || "",
    vendedor_id: sale.domiciliario_id || "",
    metodoPago: sale.metodoPago || "Efectivo",
    productos:
      sale.productos && sale.productos.length
        ? sale.productos.map((p) => ({
            name: p.producto_nombre || p.name || "",
            qty: String(p.cantidad || p.qty || 1),
            price: String(p.precio_unitario || p.price || 0),
            producto_id: p.producto_id || "",
          }))
        : [emptyProduct()],
    descuento: sale.descuento || 0,
    impuestos: sale.impuestos || 0,
    observaciones: sale.observaciones || "",
  });

  const openForm = async (sale = null) => {
    setIsAbonoMode(false);
    setAbonoAmount("");
    setIsReadOnly(false);

    if (sale) {
      setEditingId(sale.id);
      // Cargar detalles de la venta
      try {
        const detalles = await ventasService.getDetalles(sale.id);
        const saleConDetalles = { ...sale, productos: detalles.data || [] };
        const built = buildFormFromSale(saleConDetalles);
        setFormData(built);
        setClienteQuery(built.cliente);
      } catch (err) {
        console.error("Error cargando detalles:", err);
        const built = buildFormFromSale(sale);
        setFormData(built);
        setClienteQuery(built.cliente);
      }
    } else {
      setEditingId(null);
      const fresh = {
        cliente: "",
        tipoCliente: "Natural",
        nit: "",
        fecha: new Date().toISOString().slice(0, 10),
        vendedor: "",
        metodoPago: "Efectivo",
        productos: [emptyProduct()],
        descuento: 0,
        impuestos: 0,
        observaciones: "",
      };
      setFormData(fresh);
      setClienteQuery("");
    }
    setShowClienteSuggest(false);
    setIsFormOpen(true);
  };

  const openView = async (sale) => {
    setIsAbonoMode(false);
    setAbonoAmount("");
    setIsReadOnly(true);
    setEditingId(sale.id);
    // Cargar detalles de la venta
    try {
      const detalles = await ventasService.getDetalles(sale.id);
      const saleConDetalles = { ...sale, productos: detalles.data || [] };
      const built = buildFormFromSale(saleConDetalles);
      setFormData(built);
      setClienteQuery(built.cliente);
    } catch (err) {
      console.error("Error cargando detalles:", err);
      const built = buildFormFromSale(sale);
      setFormData(built);
      setClienteQuery(built.cliente);
    }
    setShowClienteSuggest(false);
    setIsFormOpen(true);
  };

  const openAbonar = async (sale) => {
    setIsReadOnly(true);
    setIsAbonoMode(true);
    setAbonoAmount("");
    setEditingId(sale.id);

    // Cargar resumen de abonos de la venta
    try {
      setLoadingResumen(true);
      const resumen = await abonosService.getResumen(sale.id);
      setSelectedVentaResumen(resumen.data || null);
    } catch (err) {
      console.error("Error cargando resumen de abonos:", err);
      setSelectedVentaResumen(null);
    } finally {
      setLoadingResumen(false);
    }

    // Cargar detalles de la venta
    try {
      const detalles = await ventasService.getDetalles(sale.id);
      const saleConDetalles = { ...sale, productos: detalles.data || [] };
      const built = buildFormFromSale(saleConDetalles);
      setFormData(built);
      setClienteQuery(built.cliente);
    } catch (err) {
      console.error("Error cargando detalles:", err);
      const built = buildFormFromSale(sale);
      setFormData(built);
      setClienteQuery(built.cliente);
    }
    setShowClienteSuggest(false);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsReadOnly(false);
    setIsAbonoMode(false);
    setEditingId(null);
    setAbonoAmount("");
    setShowClienteSuggest(false);
    setSelectedVentaResumen(null);
  };

  const validateForm = () => {
    if (!formData.cliente.trim()) {
      alert("El cliente es obligatorio");
      return false;
    }
    if (!formData.fecha) {
      alert("La fecha de venta es obligatoria");
      return false;
    }
    if (!formData.vendedor.trim()) {
      alert("El vendedor es obligatorio");
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

  const saveSale = async () => {
    if (!validateForm()) return;

    const productosLimpios = formData.productos
      .filter((p) => {
        const qtyNum = parseFloat(p.qty);
        const priceNum = parseFloat(p.price);
        return p.name.trim() && qtyNum > 0 && priceNum >= 0;
      })
      .map((p) => {
        const qty = parseFloat(p.qty) || 0;
        const price = parseFloat(p.price) || 0;
        return {
          producto_id: p.producto_id,
          cantidad: qty,
          precio_unitario: price,
        };
      });

    const subtotal = productosLimpios.reduce(
      (sum, p) => sum + p.cantidad * p.precio_unitario,
      0,
    );
    const descuento = Number(formData.descuento) || 0;
    const impuestos = Number(formData.impuestos) || 0;
    const total = Math.max(0, subtotal - descuento + impuestos);

    const data = {
      cliente_id: formData.cliente_id,
      domiciliario_id: formData.vendedor_id,
      fecha: formData.fecha,
      total_venta: total,
      productos: productosLimpios,
    };

    try {
      if (editingId) {
        await ventasService.update(editingId, data);
      } else {
        await ventasService.create(data);
      }
      await loadSales();
      closeForm();
    } catch (err) {
      alert(err.message || "Error al guardar venta");
    }
  };

  const deleteSale = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta venta?")) return;
    try {
      await ventasService.delete(id);
      setSales((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.message || "Error al eliminar venta");
    }
  };

  // ===== 4 ESTADOS EN TABLA (rotación al click) =====
  const ESTADOS = ["pendiente", "en_transito", "entregada", "anulada"];

  const toggleEstado = async (id) => {
    try {
      await ventasService.toggleEstado(id);
      setSales((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          const idx = ESTADOS.indexOf(s.estado);
          const next = ESTADOS[(idx + 1) % ESTADOS.length] || "pendiente";
          return { ...s, estado: next };
        }),
      );
    } catch (err) {
      alert(err.message || "Error al cambiar estado");
    }
  };

  // estilos del botón estado
  const estadoButtonClasses = (estado) => {
    if (estado === "entregada")
      return "bg-green-600 text-black hover:bg-green-500";
    if (estado === "pendiente")
      return "bg-yellow-500 text-black hover:bg-yellow-400";
    if (estado === "en_transito")
      return "bg-neutral-800 text-white hover:bg-neutral-700";
    // anulada
    return "bg-red-600 text-black hover:bg-red-500";
  };

  const formatEstado = (estado) => {
    const estados = {
      pendiente: "Pendiente",
      en_transito: "En tránsito",
      entregada: "Entregada",
      anulada: "Anulada",
    };
    return estados[estado] || estado;
  };

  // ===== ABONO =====
  const registrarAbono = async () => {
    const sale = sales.find((s) => s.id === editingId);
    if (!sale) return;

    const abonoNum = Number(abonoAmount);
    if (!abonoAmount || Number.isNaN(abonoNum) || abonoNum <= 0) {
      alert("Ingresa un valor de abono válido (mayor a 0).");
      return;
    }

    // Validar contra el resumen si está disponible
    if (selectedVentaResumen) {
      const deudaPendiente = Number(selectedVentaResumen.deuda_pendiente || 0);
      if (abonoNum > deudaPendiente) {
        alert(
          `El abono no puede ser mayor a la deuda pendiente ($${deudaPendiente.toFixed(2)})`,
        );
        return;
      }
    }

    const data = {
      venta_id: sale.id,
      monto: abonoNum,
      fecha_abono: new Date().toISOString().slice(0, 10),
    };

    try {
      await abonosService.create(data);
      await loadAbonos();
      await loadSales();
      closeForm();
    } catch (err) {
      alert(err.message || "Error al registrar abono");
    }
  };

  const verAbonosDeVenta = async (ventaId) => {
    try {
      setLoadingVentaAbonos(true);
      const response = await abonosService.getByVenta(ventaId);
      setSelectedVentaAbonos(response.data || []);
      setIsAbonosOpen(true);
    } catch (err) {
      console.error("Error cargando abonos de la venta:", err);
      setSelectedVentaAbonos([]);
      setIsAbonosOpen(true);
    } finally {
      setLoadingVentaAbonos(false);
    }
  };

  // ===== PDF =====
  const generatePdf = (sale) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Comprobante de Venta", 105, 15, { align: "center" });

    doc.setFontSize(11);
    doc.text(`ID: ${sale.id}`, 14, 25);
    doc.text(`Cliente: ${sale.cliente_nombre || ""}`, 14, 32);
    doc.text(`Documento: ${sale.cliente_documento || ""}`, 14, 39);
    doc.text(`Teléfono: ${sale.cliente_telefono || ""}`, 14, 46);
    doc.text(`Dirección: ${sale.cliente_direccion || ""}`, 14, 53);
    doc.text(
      `Fecha: ${sale.fecha ? new Date(sale.fecha).toLocaleDateString("es-CO") : "-"}`,
      14,
      60,
    );
    doc.text(`Domiciliario: ${sale.domiciliario_nombre || ""}`, 14, 67);

    const productosData =
      sale.productos && sale.productos.length > 0
        ? sale.productos.map((p) => {
            const qty = p.cantidad || p.qty || 0;
            const price = p.precio_unitario || p.price || 0;
            const subtotal = qty * price;
            return [
              p.producto_nombre || p.name || "-",
              qty,
              `$ ${Number(price).toFixed(2)}`,
              `$ ${subtotal.toFixed(2)}`,
            ];
          })
        : [];

    autoTable(doc, {
      startY: 77,
      head: [["Producto", "Cant.", "Precio Unit.", "Subtotal"]],
      body: productosData,
    });

    const finalY = doc.lastAutoTable.finalY || 77;

    doc.text(
      `Descuento: $ ${Number(sale.descuento || 0).toFixed(2)}`,
      14,
      finalY + 10,
    );
    doc.text(
      `Impuestos: $ ${Number(sale.impuestos || 0).toFixed(2)}`,
      14,
      finalY + 17,
    );
    doc.setFontSize(13);
    doc.text(
      `TOTAL: $ ${Number(sale.total_venta || 0).toFixed(2)}`,
      14,
      finalY + 28,
    );

    if (sale.observaciones) {
      doc.setFontSize(11);
      doc.text("Observaciones:", 14, finalY + 40);
      doc.text(sale.observaciones, 14, finalY + 47, { maxWidth: 180 });
    }

    doc.save(`venta-${sale.id}.pdf`);
  };

  const abonosOrdenados = useMemo(() => {
    return [...abonos].sort((a, b) => {
      const dateA = new Date(a.fecha_abono || a.fechaAbono || 0);
      const dateB = new Date(b.fecha_abono || b.fechaAbono || 0);
      return dateB - dateA;
    });
  }, [abonos]);

  // ===== AUTOCOMPLETAR CLIENTE =====
  const clienteSuggestions = useMemo(() => {
    const q = (clienteQuery || "").toLowerCase().trim();
    const filteredClients = clients.filter((c) => c.estado === "activo");
    if (!q) return filteredClients.slice(0, 8);
    return filteredClients
      .filter((c) => c.nombre.toLowerCase().includes(q))
      .slice(0, 8);
  }, [clienteQuery, clients]);

  const selectClient = (c) => {
    if (isReadOnly) return;
    setClienteQuery(c.nombre);
    setFormData((prev) => ({
      ...prev,
      cliente: c.nombre,
      cliente_id: c.id,
      tipoCliente: c.tipo_documento === "NIT" ? "Jurídico" : "Natural",
      nit: c.tipo_documento === "NIT" ? c.documento || "" : "",
    }));
    setShowClienteSuggest(false);
  };

  // ===== AUTOCOMPLETAR PRODUCTOS (por fila) =====
  const [productSuggestIndex, setProductSuggestIndex] = useState(null);

  const productSuggestionsFor = (value) => {
    const q = (value || "").toLowerCase().trim();
    const activeProducts = products.filter((p) => p.estado === "activo");
    if (!q) return activeProducts.slice(0, 8);
    return activeProducts
      .filter((p) => p.nombre.toLowerCase().includes(q))
      .slice(0, 8);
  };

  const selectProductForRow = (index, productObj) => {
    if (isReadOnly) return;
    updateProducto(index, "name", productObj.nombre);
    updateProducto(index, "price", String(productObj.precio || 0));
    updateProducto(index, "producto_id", productObj.id);
    setProductSuggestIndex(null);
  };

  // ===== RENDER =====
  return (
    <div className="">
      {/* ENCABEZADO + BOTONES */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-wide">
            Gestión de Ventas
          </h2>
          <p className="text-neutral-400 text-sm">
            Registro y control de ventas realizadas.
          </p>
        </div>

        <div className="mt-3 md:mt-0 flex items-center gap-3">
          <button
            onClick={() => setIsAbonosOpen(true)}
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition"
          >
            <FiDollarSign />
            Abonos
          </button>

          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-5 py-3 rounded-xl shadow-md transition"
          >
            <FiPlus />
            Agregar venta
          </button>
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="bg-neutral-900/70 border border-neutral-700 rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex items-center bg-neutral-800/70 border border-neutral-600 rounded-xl px-4 py-3 shadow-md">
          <FiSearch className="text-neutral-400 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Buscar por cliente o vendedor..."
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
              <th className="p-3 font-semibold">Cliente</th>
              <th className="p-3 font-semibold">Fecha</th>
              <th className="p-3 font-semibold">Vendedor</th>
              <th className="p-3 font-semibold">Productos</th>
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
                    Cargando ventas...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-red-400">
                  {error}
                  <button
                    onClick={loadInitialData}
                    className="ml-2 text-green-400 hover:underline"
                  >
                    Reintentar
                  </button>
                </td>
              </tr>
            ) : paginatedSales.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-neutral-400">
                  No se encontraron ventas.
                </td>
              </tr>
            ) : (
              paginatedSales.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-t border-neutral-700 hover:bg-neutral-800/50 transition"
                >
                  <td className="p-3">
                    <div className="font-semibold">{sale.cliente_nombre}</div>
                    <div className="text-xs text-neutral-400">
                      {sale.cliente_telefono} · {sale.cliente_direccion}
                    </div>
                  </td>
                  <td className="p-3">
                    {sale.fecha
                      ? new Date(sale.fecha).toLocaleDateString("es-CO")
                      : "-"}
                  </td>
                  <td className="p-3">
                    <div>{sale.domiciliario_nombre}</div>
                    <div className="text-xs text-neutral-400">
                      {sale.domiciliario_telefono}
                    </div>
                  </td>
                  <td className="p-3">
                    {sale.productos && sale.productos.length > 0 ? (
                      sale.productos.map((p, i) => (
                        <div key={i} className="text-xs">
                          {p.producto_nombre || p.name} x{p.cantidad || p.qty}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-neutral-400">
                        Sin detalles
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-semibold text-green-400">
                    ${Number(sale.total_venta || 0).toFixed(2)}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleEstado(sale.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow cursor-pointer transition ${estadoButtonClasses(
                        sale.estado,
                      )}`}
                    >
                      {formatEstado(sale.estado)}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      <button
                        className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg shadow text-white"
                        onClick={() => openView(sale)}
                      >
                        <FiEye className="text-lg" />
                      </button>

                      <button
                        className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg shadow text-white"
                        onClick={() => generatePdf(sale)}
                      >
                        <FiFileText className="text-lg" />
                      </button>

                      <button
                        className="bg-green-600 hover:bg-green-500 text-black p-2 rounded-lg shadow"
                        onClick={() => openForm(sale)}
                      >
                        <FiEdit2 className="text-lg" />
                      </button>

                      <button
                        className="bg-red-600 hover:bg-red-500 text-black p-2 rounded-lg shadow"
                        onClick={() => deleteSale(sale.id)}
                      >
                        <FiTrash2 className="text-lg" />
                      </button>

                      <button
                        className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg shadow text-white"
                        onClick={() => openAbonar(sale)}
                        title="Realizar abono"
                      >
                        <FiDollarSign className="text-lg" />
                      </button>

                      <button
                        className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg shadow"
                        onClick={() => verAbonosDeVenta(sale.id)}
                        title="Ver abonos de esta venta"
                      >
                        <FiList className="text-lg" />
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
            {filteredSales.length === 0
              ? "0"
              : `${startIndex + 1}–${Math.min(
                  startIndex + itemsPerPage,
                  filteredSales.length,
                )}`}{" "}
            de {filteredSales.length} ventas
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
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto text-neutral-200">
            <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
              💰{" "}
              {isAbonoMode
                ? "Realizar Abono"
                : isReadOnly
                  ? "Detalle de Venta"
                  : editingId
                    ? "Editar Venta"
                    : "Registrar Nueva Venta"}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isAbonoMode) {
                  registrarAbono();
                  return;
                }
                if (isReadOnly) {
                  closeForm();
                  return;
                }
                saveSale();
              }}
              className="space-y-5"
            >
              {/* DATOS PRINCIPALES */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* CLIENTE (AUTOCOMPLETE) */}
                <div className="flex flex-col gap-1" ref={clienteWrapRef}>
                  <label className="text-sm font-medium text-neutral-300">
                    Cliente <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Seleccionar cliente"
                      className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                        !isReadOnly && "focus:border-green-500"
                      } ${isReadOnly && "opacity-70 cursor-not-allowed"}`}
                      value={clienteQuery}
                      disabled={isReadOnly}
                      onChange={(e) => {
                        const val = e.target.value;
                        setClienteQuery(val);
                        setShowClienteSuggest(true);
                        setFormData((prev) => ({
                          ...prev,
                          cliente: val,
                        }));
                      }}
                      onFocus={() => {
                        if (!isReadOnly) setShowClienteSuggest(true);
                      }}
                      onBlur={() => {
                        // pequeño delay para permitir click en opción
                        setTimeout(() => setShowClienteSuggest(false), 150);
                      }}
                    />

                    {showClienteSuggest && !isReadOnly && (
                      <div className="absolute z-50 mt-2 w-full bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg overflow-hidden">
                        {clienteSuggestions.length ? (
                          clienteSuggestions.map((c) => (
                            <button
                              type="button"
                              key={c.id}
                              className="w-full text-left px-4 py-2 hover:bg-neutral-800 text-neutral-200"
                              onMouseDown={(ev) => ev.preventDefault()}
                              onClick={() => selectClient(c)}
                            >
                              <div className="font-semibold">{c.nombre}</div>
                              <div className="text-xs text-neutral-400">
                                {c.tipo_documento}
                                {c.tipo_documento === "NIT" && c.documento
                                  ? ` · ${c.documento}`
                                  : ""}
                              </div>
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
                </div>

                {/* TIPO CLIENTE */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-neutral-300">
                    Tipo de Cliente <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                      !isReadOnly && "focus:border-green-500"
                    } ${isReadOnly && "opacity-70 cursor-not-allowed"}`}
                    value={formData.tipoCliente}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        tipoCliente: val,
                        nit: val === "Jurídico" ? prev.nit : "",
                      }));
                    }}
                  >
                    <option value="Natural">Natural</option>
                    <option value="Jurídico">Jurídico</option>
                  </select>
                </div>

                {/* FECHA */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-neutral-300">
                    Fecha de Venta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                      !isReadOnly && "focus:border-green-500"
                    } ${isReadOnly && "opacity-70 cursor-not-allowed"}`}
                    value={formData.fecha}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha: e.target.value })
                    }
                  />
                </div>

                {/* NIT (solo jurídico) */}
                {formData.tipoCliente === "Jurídico" && (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-neutral-300">
                      NIT <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="NIT del cliente"
                      className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                        !isReadOnly && "focus:border-green-500"
                      } ${isReadOnly && "opacity-70 cursor-not-allowed"}`}
                      value={formData.nit}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        setFormData({ ...formData, nit: e.target.value })
                      }
                    />
                  </div>
                )}

                {/* VENDEDOR (SELECT) */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-neutral-300">
                    Domiciliario <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                      !isReadOnly && "focus:border-green-500"
                    } ${isReadOnly && "opacity-70 cursor-not-allowed"}`}
                    value={formData.vendedor_id}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      const selectedDom = domiciliarios.find(
                        (d) => d.id === e.target.value,
                      );
                      setFormData({
                        ...formData,
                        vendedor_id: e.target.value,
                        vendedor: selectedDom ? selectedDom.nombre : "",
                      });
                    }}
                  >
                    <option value="">Seleccionar domiciliario</option>
                    {domiciliarios
                      .filter((d) => d.estado === "activo")
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.nombre}
                        </option>
                      ))}
                  </select>
                </div>

                {/* METODO PAGO */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-neutral-300">
                    Método de Pago <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                      !isReadOnly && "focus:border-green-500"
                    } ${isReadOnly && "opacity-70 cursor-not-allowed"}`}
                    value={formData.metodoPago}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      setFormData({ ...formData, metodoPago: e.target.value })
                    }
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Crédito">Crédito</option>
                  </select>
                </div>
              </div>

              {/* PRODUCTOS */}
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

                    const suggestions = productSuggestionsFor(p.name);

                    return (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-3 items-center"
                      >
                        {/* PRODUCTO autocomplete */}
                        <div className="col-span-5 relative">
                          <input
                            type="text"
                            placeholder="Producto"
                            className={`w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-neutral-200 outline-none ${
                              !isReadOnly && "focus:border-green-500"
                            } ${isReadOnly && "opacity-70 cursor-not-allowed"}`}
                            value={p.name}
                            disabled={isReadOnly}
                            onChange={(e) => {
                              updateProducto(index, "name", e.target.value);
                              setProductSuggestIndex(index);
                            }}
                            onFocus={() => {
                              if (!isReadOnly) setProductSuggestIndex(index);
                            }}
                            onBlur={() => {
                              setTimeout(
                                () => setProductSuggestIndex(null),
                                150,
                              );
                            }}
                          />

                          {productSuggestIndex === index && !isReadOnly && (
                            <div className="absolute z-50 mt-2 w-full bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg overflow-hidden">
                              {suggestions.length ? (
                                suggestions.map((prod) => (
                                  <button
                                    type="button"
                                    key={prod.id}
                                    className="w-full text-left px-4 py-2 hover:bg-neutral-800 text-neutral-200"
                                    onMouseDown={(ev) => ev.preventDefault()}
                                    onClick={() =>
                                      selectProductForRow(index, prod)
                                    }
                                  >
                                    <div className="font-semibold">
                                      {prod.nombre}
                                    </div>
                                    <div className="text-xs text-neutral-400">
                                      ${Number(prod.precio || 0).toFixed(2)} ·
                                      Stock: {prod.cantidad}
                                    </div>
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
              </div>

              {/* DESCUENTO / IMPUESTOS / TOTAL */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-neutral-300">
                    Descuento ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                      !isReadOnly && "focus:border-green-500"
                    } ${isReadOnly && "opacity-70 cursor-not-allowed"}`}
                    value={formData.descuento}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      setFormData({ ...formData, descuento: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-neutral-300">
                    Impuestos ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                      !isReadOnly && "focus:border-green-500"
                    } ${isReadOnly && "opacity-70 cursor-not-allowed"}`}
                    value={formData.impuestos}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      setFormData({ ...formData, impuestos: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-neutral-300">
                    Total
                  </label>
                  <div className="w-full p-3 bg-green-600 text-black font-semibold rounded-xl flex items-center justify-between">
                    <span>$ {calcularTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* OBSERVACIONES */}
              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-1">
                  Observaciones
                </label>
                <textarea
                  rows={3}
                  placeholder="Observaciones adicionales sobre la venta"
                  className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                    !isReadOnly && "focus:border-green-500"
                  } ${isReadOnly && "opacity-70 cursor-not-allowed"}`}
                  value={formData.observaciones}
                  disabled={isReadOnly}
                  onChange={(e) =>
                    setFormData({ ...formData, observaciones: e.target.value })
                  }
                />
              </div>

              {/* ABONO */}
              {isAbonoMode && (
                <div className="bg-neutral-800/70 border border-neutral-700 rounded-2xl p-4">
                  {loadingResumen ? (
                    <div className="flex items-center justify-center gap-2 p-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                      <span className="text-neutral-400">
                        Cargando información...
                      </span>
                    </div>
                  ) : selectedVentaResumen ? (
                    <>
                      {/* Información del resumen */}
                      <div className="grid md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-neutral-700">
                        <div>
                          <div className="text-xs text-neutral-400 mb-1">
                            Total de la venta
                          </div>
                          <div className="text-lg font-semibold text-white">
                            $
                            {Number(
                              selectedVentaResumen.total_venta || 0,
                            ).toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-neutral-400 mb-1">
                            Total abonado
                          </div>
                          <div className="text-lg font-semibold text-blue-400">
                            $
                            {Number(
                              selectedVentaResumen.total_abonado || 0,
                            ).toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-neutral-400 mb-1">
                            Deuda pendiente
                          </div>
                          <div className="text-lg font-semibold text-red-400">
                            $
                            {Number(
                              selectedVentaResumen.deuda_pendiente || 0,
                            ).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* Campo de abono */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-sm font-medium text-neutral-300">
                            Valor a abonar{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            max={selectedVentaResumen.deuda_pendiente}
                            className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500"
                            value={abonoAmount}
                            onChange={(e) => setAbonoAmount(e.target.value)}
                            placeholder="Ej: 20000"
                          />
                        </div>
                        <div className="flex flex-col justify-end">
                          <div className="text-sm text-neutral-400">
                            Después de este abono quedaría:{" "}
                            <span className="font-semibold text-green-400">
                              $
                              {(
                                Number(
                                  selectedVentaResumen.deuda_pendiente || 0,
                                ) - Number(abonoAmount || 0)
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-neutral-300">
                          Valor a abonar <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500"
                          value={abonoAmount}
                          onChange={(e) => setAbonoAmount(e.target.value)}
                          placeholder="Ej: 20000"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* BOTONES */}
              <div className="flex justify-end gap-3 mt-6">
                {isReadOnly && !isAbonoMode ? (
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
                      {isAbonoMode
                        ? "Registrar Abono"
                        : editingId
                          ? "Actualizar Venta"
                          : "Registrar Venta"}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ABONOS */}
      {isAbonosOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto text-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <FiDollarSign />
                Abonos
                {selectedVentaAbonos && (
                  <span className="text-sm text-neutral-400">
                    (Venta específica)
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                {selectedVentaAbonos && (
                  <button
                    onClick={() => setSelectedVentaAbonos(null)}
                    className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 text-sm rounded-lg transition"
                  >
                    Ver todos
                  </button>
                )}
                <button
                  onClick={() => setIsAbonosOpen(false)}
                  className="text-neutral-400 hover:text-neutral-200"
                >
                  ✖
                </button>
              </div>
            </div>

            <div className="overflow-x-auto bg-neutral-900/70 border border-neutral-700 rounded-2xl shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead className="bg-neutral-800/80 text-neutral-300 text-sm uppercase">
                  <tr>
                    <th className="p-3 font-semibold">Cliente</th>
                    <th className="p-3 font-semibold">Fecha abono</th>
                    <th className="p-3 font-semibold">Vendedor</th>
                    <th className="p-3 font-semibold">Abonado</th>
                    <th className="p-3 font-semibold">Saldo restante</th>
                    <th className="p-3 font-semibold">Venta</th>
                  </tr>
                </thead>

                <tbody className="text-sm text-neutral-200">
                  {loadingVentaAbonos ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-8 text-center text-neutral-400"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                          Cargando abonos...
                        </div>
                      </td>
                    </tr>
                  ) : (selectedVentaAbonos !== null
                      ? selectedVentaAbonos
                      : abonosOrdenados
                    ).length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-4 text-center text-neutral-400"
                      >
                        {selectedVentaAbonos !== null
                          ? "Esta venta no tiene abonos registrados."
                          : "Aún no hay abonos registrados."}
                      </td>
                    </tr>
                  ) : (
                    (selectedVentaAbonos !== null
                      ? selectedVentaAbonos
                      : abonosOrdenados
                    ).map((a) => (
                      <tr
                        key={a.id}
                        className="border-t border-neutral-700 hover:bg-neutral-800/50 transition"
                      >
                        <td className="p-3">
                          <div className="font-semibold">
                            {a.cliente_nombre || a.cliente || "-"}
                          </div>
                          <div className="text-xs text-neutral-400">
                            {a.cliente_documento
                              ? `Doc: ${a.cliente_documento}`
                              : ""}
                          </div>
                        </td>
                        <td className="p-3">
                          {a.fecha_abono
                            ? new Date(a.fecha_abono).toLocaleDateString(
                                "es-CO",
                              )
                            : a.fechaAbono || "-"}
                        </td>
                        <td className="p-3">
                          {a.vendedor_nombre || a.vendedor || "-"}
                        </td>
                        <td className="p-3 font-semibold text-green-400">
                          ${Number(a.monto || a.abono || 0).toFixed(2)}
                        </td>
                        <td className="p-3 font-semibold">
                          <div className="text-neutral-300">
                            $
                            {Number(
                              a.saldo_restante || a.saldoRestante || 0,
                            ).toFixed(2)}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-xs">
                            {a.fecha_venta
                              ? new Date(a.fecha_venta).toLocaleDateString(
                                  "es-CO",
                                )
                              : a.fechaVenta || "-"}
                          </div>
                          <div className="text-xs text-neutral-400">
                            ID:{" "}
                            {a.venta_id
                              ? String(a.venta_id).slice(0, 8)
                              : a.saleId || "-"}
                            ...
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="px-5 py-2 bg-neutral-700 text-neutral-200 hover:bg-neutral-600 rounded-xl transition"
                onClick={() => setIsAbonosOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
