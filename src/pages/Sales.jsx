// src/pages/Sales.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiFileText,
  FiDollarSign,
} from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ventaService } from "../services/ventaService";
import { clientesService } from "../services/clientesService";
import { usuariosService } from "../services/usuariosService";
import { productosService } from "../services/productosService";

// ===== DATOS PARA AUTOCOMPLETAR =====
const CLIENTS_LIST = [
  { nombre: "Carlos Gómez", tipoCliente: "Natural", nit: "" },
  { nombre: "Laura Sánchez", tipoCliente: "Jurídico", nit: "900123456-1" },
  { nombre: "Distribuidora Andina S.A.S.", tipoCliente: "Jurídico", nit: "901234567-8" },
  { nombre: "Panadería El Trigal", tipoCliente: "Natural", nit: "" },
  { nombre: "Supermercado La Canasta", tipoCliente: "Jurídico", nit: "800234567-2" },
  { nombre: "Restaurante El Buen Sabor", tipoCliente: "Natural", nit: "" },
  { nombre: "Tienda Orgánica Vida", tipoCliente: "Natural", nit: "" },
  { nombre: "Comercializadora Central", tipoCliente: "Jurídico", nit: "830456789-0" },
];

const PRODUCTS_LIST = [
  "Arroz integral",
  "Aceite de Oliva",
  "Aceite de Oliva Extra Virgen",
  "Quinua Real",
  "Harina de Almendras",
  "Lentejas",
  "Avena",
  "Panela orgánica",
];

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vendedores, setVendedores] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [clientesList, setClientesList] = useState(CLIENTS_LIST);
  // eslint-disable-next-line no-unused-vars
  const [productsList, setProductsList] = useState(PRODUCTS_LIST);

  useEffect(() => {
    loadData();
    loadVendedores();
    loadClientes();
    loadProductos();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ventaService.getAll();
      const salesData = (response.data || []).map((v) => ({
        id: v.id,
        cliente: v.cliente_id ? `Cliente ${v.cliente_id}` : "Sin cliente",
        tipoCliente: "Natural",
        nit: "",
        fecha: v.fecha ? v.fecha.split("T")[0] : new Date().toISOString().slice(0, 10),
        vendedor: v.domicilio_id ? `Vendedor ${v.domicilio_id}` : "",
        metodoPago: "Efectivo",
        productos: [],
        descuento: 0,
        impuestos: 0,
        total: v.total_venta || 0,
        observaciones: "",
        estado: v.estado || "Pendiente",
      }));
      setSales(salesData);
    } catch (err) {
      setError(err.message || "Error al cargar ventas");
      console.error("Error cargando ventas:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadVendedores = async () => {
    try {
      const response = await usuariosService.getAll();
      const vendedoresData = (response.data || [])
        .filter((u) => u.rol_id === 2)
        .map((u) => u.nombre);
      if (vendedoresData.length > 0) {
        setVendedores(vendedoresData);
      } else {
        setVendedores(["María Torres", "Juan Pérez", "Carlos Mendoza", "María González"]);
      }
    } catch {
      setVendedores(["María Torres", "Juan Pérez", "Carlos Mendoza", "María González"]);
    }
  };

  const loadClientes = async () => {
    try {
      const response = await clientesService.getAll();
      const clientesData = (response.data || []).map((c) => ({
        nombre: `${c.nombres} ${c.apellidos}`,
        tipoCliente: c.tipoCliente || "Natural",
        nit: c.nit || "",
      }));
      if (clientesData.length > 0) {
        setClientesList(clientesData);
      }
    } catch (err) {
      console.error("Error cargando clientes:", err);
    }
  };

  const loadProductos = async () => {
    try {
      const response = await productosService.getAll();
      const productosData = (response.data || []).map((p) => p.nombre);
      if (productosData.length > 0) {
        setProductsList(productosData);
      }
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  // ===== TABLA DE ABONOS =====
  const [abonos, setAbonos] = useState([]);

  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // modal abonos
  const [isAbonosOpen, setIsAbonosOpen] = useState(false);

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
    tipoCliente: "Natural",
    nit: "",
    fecha: new Date().toISOString().slice(0, 10),
    vendedor: "",
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
      sale.cliente.toLowerCase().includes(search.toLowerCase()) ||
      sale.vendedor.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredSales.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSales = filteredSales.slice(startIndex, startIndex + itemsPerPage);

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
        i === index ? { ...p, [field]: value } : p
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
    cliente: sale.cliente,
    tipoCliente: sale.tipoCliente || "Natural",
    nit: sale.nit || "",
    fecha: sale.fecha,
    vendedor: sale.vendedor,
    metodoPago: sale.metodoPago || "Efectivo",
    productos:
      sale.productos && sale.productos.length
        ? sale.productos.map((p) => ({
            name: p.name,
            qty: String(p.qty),
            price: String(p.price),
          }))
        : [emptyProduct()],
    descuento: sale.descuento || 0,
    impuestos: sale.impuestos || 0,
    observaciones: sale.observaciones || "",
  });

  const openForm = (sale = null) => {
    setIsAbonoMode(false);
    setAbonoAmount("");
    setIsReadOnly(false);

    if (sale) {
      setEditingId(sale.id);
      const built = buildFormFromSale(sale);
      setFormData(built);
      setClienteQuery(built.cliente);
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

  const openView = (sale) => {
    setIsAbonoMode(false);
    setAbonoAmount("");
    setIsReadOnly(true);
    setEditingId(sale.id);
    const built = buildFormFromSale(sale);
    setFormData(built);
    setClienteQuery(built.cliente);
    setShowClienteSuggest(false);
    setIsFormOpen(true);
  };

  const openAbonar = (sale) => {
    setIsReadOnly(true);
    setIsAbonoMode(true);
    setAbonoAmount("");
    setEditingId(sale.id);
    const built = buildFormFromSale(sale);
    setFormData(built);
    setClienteQuery(built.cliente);
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
          name: p.name.trim(),
          qty,
          price,
          subtotal: qty * price,
        };
      });

    const subtotal = productosLimpios.reduce((sum, p) => sum + p.subtotal, 0);
    const descuento = Number(formData.descuento) || 0;
    const impuestos = Number(formData.impuestos) || 0;
    const total = Math.max(0, subtotal - descuento + impuestos);

    const data = {
      cliente_id: formData.clienteId || null,
      fecha: formData.fecha,
      total_venta: total,
      metodo_pago: formData.metodoPago,
      descuento,
      impuestos,
      observaciones: formData.observaciones,
      productos: productosLimpios,
    };

    try {
      if (editingId) {
        await ventaService.update(editingId, data);
      } else {
        await ventaService.create(data);
      }
      await loadData();
      closeForm();
    } catch (err) {
      alert(err.message || "Error al guardar venta");
    }
  };

  const deleteSale = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta venta?")) return;
    try {
      await ventaService.delete(id);
      setSales((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.message || "Error al eliminar venta");
    }
  };

  // ===== 4 ESTADOS EN TABLA (rotación al click) =====
  const ESTADOS = ["Pendiente", "En transito", "Completada", "Anulada"];

  const toggleEstado = async (id) => {
    try {
      await ventaService.toggleEstado(id);
      setSales((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          const idx = ESTADOS.indexOf(s.estado);
          const next = ESTADOS[(idx + 1) % ESTADOS.length] || "Pendiente";
          return { ...s, estado: next };
        })
      );
    } catch (err) {
      alert(err.message || "Error al cambiar estado");
    }
  };

  // estilos del botón estado (manteniendo tu patrón actual)
  const estadoButtonClasses = (estado) => {
    if (estado === "Completada") return "bg-green-600 text-black hover:bg-green-500";
    if (estado === "Pendiente") return "bg-yellow-500 text-black hover:bg-yellow-400";
    if (estado === "En transito") return "bg-neutral-800 text-white hover:bg-neutral-700";
    // Anulada
    return "bg-red-600 text-black hover:bg-red-500";
  };

  // ===== ABONO =====
  const registrarAbono = () => {
    const sale = sales.find((s) => s.id === editingId);
    if (!sale) return;

    const saldoActual = Number(sale.total) || 0;
    if (!(saldoActual < 0)) {
      alert("Esta venta no tiene saldo pendiente (total negativo) para abonar.");
      return;
    }

    const abonoNum = Number(abonoAmount);
    if (!abonoAmount || Number.isNaN(abonoNum) || abonoNum <= 0) {
      alert("Ingresa un valor de abono válido (mayor a 0).");
      return;
    }

    const deuda = Math.abs(saldoActual);
    if (abonoNum > deuda) {
      alert("El abono no puede ser mayor al saldo pendiente.");
      return;
    }

    const nuevoTotal = saldoActual + abonoNum; // -100 + 20 = -80
    const saldoRestante = Math.max(0, Math.abs(nuevoTotal));
    const fechaAbono = new Date().toISOString().slice(0, 10);

    const newAbonoId = abonos.length ? Math.max(...abonos.map((a) => a.id)) + 1 : 1;

    setAbonos((prev) => [
      ...prev,
      {
        id: newAbonoId,
        saleId: sale.id,
        cliente: sale.cliente,
        tipoCliente: sale.tipoCliente || "",
        nit: sale.nit || "",
        vendedor: sale.vendedor,
        fechaVenta: sale.fecha,
        fechaAbono,
        abono: abonoNum,
        saldoRestante,
      },
    ]);

    setSales((prev) =>
      prev.map((s) => {
        if (s.id !== sale.id) return s;
        const totalActualizado = nuevoTotal >= 0 ? 0 : nuevoTotal;
        const estadoActualizado = totalActualizado === 0 ? "Completada" : "Pendiente";
        return { ...s, total: totalActualizado, estado: estadoActualizado };
      })
    );

    closeForm();
  };

  // ===== PDF =====
  const generatePdf = (sale) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Comprobante de Venta", 105, 15, { align: "center" });

    doc.setFontSize(11);
    doc.text(`ID: ${sale.id}`, 14, 25);
    doc.text(`Cliente: ${sale.cliente}`, 14, 32);
    doc.text(`Tipo de cliente: ${sale.tipoCliente || ""}`, 14, 39);
    if (sale.tipoCliente === "Jurídico" && sale.nit) {
      doc.text(`NIT: ${sale.nit}`, 14, 46);
    }
    doc.text(`Fecha: ${sale.fecha}`, 14, 53);
    doc.text(`Vendedor: ${sale.vendedor}`, 14, 60);
    doc.text(`Método de pago: ${sale.metodoPago || ""}`, 14, 67);

    const productosData = sale.productos.map((p) => [
      p.name,
      p.qty,
      `$ ${p.price.toFixed(2)}`,
      `$ ${p.subtotal.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 77,
      head: [["Producto", "Cant.", "Precio Unit.", "Subtotal"]],
      body: productosData,
    });

    const finalY = doc.lastAutoTable.finalY || 77;

    doc.text(`Descuento: $ ${Number(sale.descuento || 0).toFixed(2)}`, 14, finalY + 10);
    doc.text(`Impuestos: $ ${Number(sale.impuestos || 0).toFixed(2)}`, 14, finalY + 17);
    doc.setFontSize(13);
    doc.text(`TOTAL: $ ${sale.total.toFixed(2)}`, 14, finalY + 28);

    if (sale.observaciones) {
      doc.setFontSize(11);
      doc.text("Observaciones:", 14, finalY + 40);
      doc.text(sale.observaciones, 14, finalY + 47, { maxWidth: 180 });
    }

    doc.save(`venta-${sale.id}.pdf`);
  };

  const abonosOrdenados = useMemo(() => {
    return [...abonos].sort((a, b) => (a.fechaAbono > b.fechaAbono ? -1 : 1));
  }, [abonos]);

  // ===== AUTOCOMPLETAR CLIENTE =====
  const clienteSuggestions = useMemo(() => {
    const q = (clienteQuery || "").toLowerCase().trim();
    if (!q) return CLIENTS_LIST.slice(0, 8);
    return CLIENTS_LIST.filter((c) => c.nombre.toLowerCase().includes(q)).slice(0, 8);
  }, [clienteQuery]);

  const selectClient = (c) => {
    if (isReadOnly) return;
    setClienteQuery(c.nombre);
    setFormData((prev) => ({
      ...prev,
      cliente: c.nombre,
      tipoCliente: c.tipoCliente,
      nit: c.tipoCliente === "Jurídico" ? c.nit || "" : "",
    }));
    setShowClienteSuggest(false);
  };

  // ===== AUTOCOMPLETAR PRODUCTOS (por fila) =====
  const [productSuggestIndex, setProductSuggestIndex] = useState(null);

  const productSuggestionsFor = (value) => {
    const q = (value || "").toLowerCase().trim();
    if (!q) return PRODUCTS_LIST.slice(0, 8);
    return PRODUCTS_LIST.filter((p) => p.toLowerCase().includes(q)).slice(0, 8);
  };

  const selectProductForRow = (index, name) => {
    if (isReadOnly) return;
    updateProducto(index, "name", name);
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
                    onClick={loadData}
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
                  <td className="p-3">{sale.cliente}</td>
                  <td className="p-3">{sale.fecha}</td>
                  <td className="p-3">{sale.vendedor}</td>
                  <td className="p-3">
                    {sale.productos && sale.productos.map((p, i) => (
                      <div key={i}>
                        {p.name} x{p.qty}
                      </div>
                    ))}
                  </td>
                  <td className="p-3 font-semibold text-green-400">
                    ${sale.total.toFixed(2)}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleEstado(sale.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow cursor-pointer transition ${estadoButtonClasses(
                        sale.estado
                      )}`}
                    >
                      {sale.estado}
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
                  filteredSales.length
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
                              key={c.nombre}
                              className="w-full text-left px-4 py-2 hover:bg-neutral-800 text-neutral-200"
                              onMouseDown={(ev) => ev.preventDefault()}
                              onClick={() => selectClient(c)}
                            >
                              <div className="font-semibold">{c.nombre}</div>
                              <div className="text-xs text-neutral-400">
                                {c.tipoCliente}
                                {c.tipoCliente === "Jurídico" && c.nit ? ` · NIT: ${c.nit}` : ""}
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
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                    />
                  </div>
                )}

                  {/* VENDEDOR (SELECT) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-neutral-300">
                      Vendedor <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                        !isReadOnly && "focus:border-green-500"
                      } ${isReadOnly && "opacity-70 cursor-not-allowed"}`}
                      value={formData.vendedor}
                      disabled={isReadOnly}
                      onChange={(e) => setFormData({ ...formData, vendedor: e.target.value })}
                    >
                      <option value="">Seleccionar vendedor</option>
                      {vendedores.map((v) => (
                        <option key={v} value={v}>
                          {v}
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
                    onChange={(e) => setFormData({ ...formData, metodoPago: e.target.value })}
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
                      <div key={index} className="grid grid-cols-12 gap-3 items-center">
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
                              setTimeout(() => setProductSuggestIndex(null), 150);
                            }}
                          />

                          {productSuggestIndex === index && !isReadOnly && (
                            <div className="absolute z-50 mt-2 w-full bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg overflow-hidden">
                              {suggestions.length ? (
                                suggestions.map((name) => (
                                  <button
                                    type="button"
                                    key={name}
                                    className="w-full text-left px-4 py-2 hover:bg-neutral-800 text-neutral-200"
                                    onMouseDown={(ev) => ev.preventDefault()}
                                    onClick={() => selectProductForRow(index, name)}
                                  >
                                    {name}
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
                          onChange={(e) => updateProducto(index, "qty", e.target.value)}
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
                          onChange={(e) => updateProducto(index, "price", e.target.value)}
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
                    onChange={(e) => setFormData({ ...formData, descuento: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, impuestos: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                />
              </div>

              {/* ABONO */}
              {isAbonoMode && (
                <div className="bg-neutral-800/70 border border-neutral-700 rounded-2xl p-4">
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
                    <div className="flex flex-col justify-end">
                      <div className="text-sm text-neutral-300">
                        Saldo actual:{" "}
                        <span className="font-semibold text-green-400">
                          $
                          {(() => {
                            const s = sales.find((x) => x.id === editingId);
                            const saldo = s ? Math.abs(Number(s.total) || 0) : 0;
                            return saldo.toFixed(2);
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
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
              </h3>
              <button
                onClick={() => setIsAbonosOpen(false)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                ✖
              </button>
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
                  {abonosOrdenados.map((a) => (
                    <tr
                      key={a.id}
                      className="border-t border-neutral-700 hover:bg-neutral-800/50 transition"
                    >
                      <td className="p-3">
                        <div className="font-semibold">{a.cliente}</div>
                        <div className="text-xs text-neutral-400">
                          {a.tipoCliente === "Jurídico" && a.nit ? `NIT: ${a.nit}` : ""}
                        </div>
                      </td>
                      <td className="p-3">{a.fechaAbono}</td>
                      <td className="p-3">{a.vendedor}</td>
                      <td className="p-3 font-semibold text-green-400">
                        ${Number(a.abono || 0).toFixed(2)}
                      </td>
                      <td className="p-3 font-semibold text-green-400">
                        ${Number(a.saldoRestante || 0).toFixed(2)}
                      </td>
                      <td className="p-3">
                        {a.fechaVenta} (#{a.saleId})
                      </td>
                    </tr>
                  ))}

                  {abonosOrdenados.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-neutral-400">
                        Aún no hay abonos registrados.
                      </td>
                    </tr>
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
