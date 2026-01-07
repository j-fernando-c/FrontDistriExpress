// src/pages/Credits.jsx
import { useState } from "react";
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

export default function Credits() {
  const [credits, setCredits] = useState([
    {
      id: 1,
      cliente: "Juan Pérez López",
      monto: 50000,
      plazoMeses: 24,
      tasaInteres: 12.5,
      cuotaInicial: 5000,
      tipoCredito: "Personal",
      garantia: "Sin garantía",
      descripcion: "Crédito de consumo general",
      estado: "Aprobado",
      fecha: "2024-01-15",
    },
    {
      id: 2,
      cliente: "María González Ruiz",
      monto: 120000,
      plazoMeses: 36,
      tasaInteres: 10.8,
      cuotaInicial: 20000,
      tipoCredito: "Empresarial",
      garantia: "Garantía hipotecaria",
      descripcion: "Capital de trabajo",
      estado: "Pendiente",
      fecha: "2024-02-20",
    },
    {
      id: 3,
      cliente: "Carlos Mendoza Silva",
      monto: 80000,
      plazoMeses: 48,
      tasaInteres: 9.9,
      cuotaInicial: 0,
      tipoCredito: "Vehicular",
      garantia: "Vehículo",
      descripcion: "Compra de vehículo",
      estado: "Aprobado",
      fecha: "2024-03-10",
    },
  ]);

  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    cliente: "",
    monto: "",
    plazoMeses: "",
    tasaInteres: "",
    cuotaInicial: "",
    tipoCredito: "",
    garantia: "",
    descripcion: "",
  });

  // ===== FILTRO + PAGINACIÓN =====
  const filteredCredits = credits.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.cliente.toLowerCase().includes(term) ||
      c.tipoCredito.toLowerCase().includes(term) ||
      c.estado.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCredits.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCredits = filteredCredits.slice(
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

  // ===== HELPERS FORM =====
  const buildFormFromCredit = (credit) => ({
    cliente: credit.cliente,
    monto: credit.monto,
    plazoMeses: credit.plazoMeses,
    tasaInteres: credit.tasaInteres,
    cuotaInicial: credit.cuotaInicial,
    tipoCredito: credit.tipoCredito,
    garantia: credit.garantia || "",
    descripcion: credit.descripcion || "",
  });

  const resetForm = () => {
    setFormData({
      cliente: "",
      monto: "",
      plazoMeses: "",
      tasaInteres: "",
      cuotaInicial: "",
      tipoCredito: "",
      garantia: "",
      descripcion: "",
    });
  };

  const openForm = (credit = null) => {
    setIsReadOnly(false);
    if (credit) {
      setEditingId(credit.id);
      setFormData(buildFormFromCredit(credit));
    } else {
      setEditingId(null);
      resetForm();
    }
    setIsFormOpen(true);
  };

  const openView = (credit) => {
    setIsReadOnly(true);
    setEditingId(credit.id); // solo referencia
    setFormData(buildFormFromCredit(credit));
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
    if (formData.monto === "" || Number(formData.monto) <= 0) {
      alert("El monto del crédito debe ser mayor a 0");
      return false;
    }
    if (formData.plazoMeses === "" || Number(formData.plazoMeses) <= 0) {
      alert("El plazo (meses) debe ser mayor a 0");
      return false;
    }
    if (formData.tasaInteres === "" || Number(formData.tasaInteres) < 0) {
      alert("La tasa de interés debe ser 0 o mayor");
      return false;
    }
    if (!formData.tipoCredito.trim()) {
      alert("El tipo de crédito es obligatorio");
      return false;
    }
    return true;
  };

  const saveCredit = () => {
    if (isReadOnly) return;
    if (!validateForm()) return;

    const monto = Number(formData.monto);
    const plazoMeses = Number(formData.plazoMeses);
    const tasaInteres = Number(formData.tasaInteres);
    const cuotaInicial =
      formData.cuotaInicial === "" ? 0 : Number(formData.cuotaInicial);

    if (editingId) {
      setCredits((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                cliente: formData.cliente,
                monto,
                plazoMeses,
                tasaInteres,
                cuotaInicial,
                tipoCredito: formData.tipoCredito,
                garantia: formData.garantia,
                descripcion: formData.descripcion,
              }
            : c
        )
      );
    } else {
      const newId = credits.length
        ? Math.max(...credits.map((c) => c.id)) + 1
        : 1;
      const today = new Date().toISOString().slice(0, 10);

      const nuevoCredito = {
        id: newId,
        cliente: formData.cliente,
        monto,
        plazoMeses,
        tasaInteres,
        cuotaInicial,
        tipoCredito: formData.tipoCredito,
        garantia: formData.garantia,
        descripcion: formData.descripcion,
        estado: "Pendiente",
        fecha: today,
      };

      setCredits((prev) => [...prev, nuevoCredito]);
    }

    closeForm();
  };

  const deleteCredit = (id) => {
    if (!confirm("¿Seguro que deseas eliminar este crédito?")) return;
    setCredits((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleEstado = (id) => {
    setCredits((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        let next = "Pendiente";
        if (c.estado === "Pendiente") next = "Aprobado";
        else if (c.estado === "Aprobado") next = "Rechazado";
        else if (c.estado === "Rechazado") next = "Pendiente";
        return { ...c, estado: next };
      })
    );
  };

  const estadoClasses = (estado) => {
    if (estado === "Aprobado") {
      return "bg-green-600 text-black hover:bg-green-500";
    }
    if (estado === "Pendiente") {
      return "bg-yellow-500 text-black hover:bg-yellow-400";
    }
    return "bg-red-600 text-black hover:bg-red-500"; // Rechazado u otro
  };

  // ===== GENERAR PDF =====
  const generatePdf = (credit) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Comprobante de Crédito", 105, 15, { align: "center" });

    doc.setFontSize(11);
    doc.text(`ID interno: ${credit.id}`, 14, 25);
    doc.text(`Cliente: ${credit.cliente}`, 14, 32);
    doc.text(`Fecha: ${credit.fecha}`, 14, 39);
    doc.text(`Estado: ${credit.estado}`, 14, 46);
    doc.text(`Tipo de crédito: ${credit.tipoCredito}`, 14, 53);

    const montoFmt = `$ ${credit.monto.toLocaleString("es-CO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    const cuotaIniFmt = `$ ${(credit.cuotaInicial || 0).toLocaleString(
      "es-CO",
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )}`;

    const body = [
      ["Monto del crédito", montoFmt],
      ["Plazo (meses)", `${credit.plazoMeses}`],
      ["Tasa de interés (%)", `${credit.tasaInteres}%`],
      ["Cuota inicial", cuotaIniFmt],
    ];

    autoTable(doc, {
      startY: 65,
      head: [["Detalle", "Valor"]],
      body,
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 110 },
      },
    });

    let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 65;

    if (credit.garantia) {
      doc.setFontSize(11);
      doc.text("Garantía:", 14, finalY + 10);
      doc.text(credit.garantia, 14, finalY + 16, { maxWidth: 180 });
      finalY += 20;
    }

    if (credit.descripcion) {
      doc.setFontSize(11);
      doc.text("Descripción:", 14, finalY + 10);
      doc.text(credit.descripcion, 14, finalY + 16, { maxWidth: 180 });
      finalY += 20;
    }

    doc.save(`credito-${credit.id}.pdf`);
  };

  // ===== RENDER =====
  return (
    <div className="">
      {/* ENCABEZADO + BOTÓN ALINEADO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-wide">
            Gestión de Créditos
          </h2>
        <p className="text-neutral-400 text-sm">
            Administra créditos, solicitudes y financiamiento.
          </p>
        </div>

        <button
          onClick={() => openForm()}
          className="mt-3 md:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-5 py-3 rounded-xl shadow-md transition"
        >
          <FiPlus />
          Registrar crédito
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-neutral-900/70 border border-neutral-700 rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex items-center bg-neutral-800/70 border border-neutral-600 rounded-xl px-4 py-3 shadow-md">
          <FiSearch className="text-neutral-400 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Buscar créditos (cliente, tipo, estado)..."
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
              <th className="p-3 font-semibold">Monto</th>
              <th className="p-3 font-semibold">Plazo</th>
              <th className="p-3 font-semibold">Tipo</th>
              <th className="p-3 font-semibold">Estado</th>
              <th className="p-3 font-semibold">Fecha</th>
              <th className="p-3 font-semibold text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-sm text-neutral-200">
            {paginatedCredits.map((c) => (
              <tr
                key={c.id}
                className="border-t border-neutral-700 hover:bg-neutral-800/50 transition"
              >
                <td className="p-3">{c.cliente}</td>
                <td className="p-3 font-semibold text-green-400">
                  $
                  {c.monto.toLocaleString("es-CO", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="p-3">{c.plazoMeses} meses</td>
                <td className="p-3">{c.tipoCredito}</td>
                <td className="p-3">
                  <button
                    onClick={() => toggleEstado(c.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow cursor-pointer transition ${estadoClasses(
                      c.estado
                    )}`}
                  >
                    {c.estado}
                  </button>
                </td>
                <td className="p-3">{c.fecha}</td>
                <td className="p-3">
                  <div className="flex justify-center gap-3">
                    {/* VER → solo lectura */}
                    <button
                      className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg shadow text-white"
                      onClick={() => openView(c)}
                    >
                      <FiEye className="text-lg" />
                    </button>

                    {/* PDF */}
                    <button
                      className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg shadow text-white"
                      onClick={() => generatePdf(c)}
                    >
                      <FiFileText className="text-lg" />
                    </button>

                    {/* EDITAR */}
                    <button
                      className="bg-green-600 hover:bg-green-500 text-black p-2 rounded-lg shadow"
                      onClick={() => openForm(c)}
                    >
                      <FiEdit2 className="text-lg" />
                    </button>

                    {/* ELIMINAR */}
                    <button
                      className="bg-red-600 hover:bg-red-500 text-black p-2 rounded-lg shadow"
                      onClick={() => deleteCredit(c.id)}
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginatedCredits.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-neutral-400">
                  No se encontraron créditos.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINACIÓN */}
        <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 border-t border-neutral-800 gap-3 text-sm text-neutral-300">
          <span>
            Mostrando{" "}
            {filteredCredits.length === 0
              ? "0"
              : `${startIndex + 1}–${Math.min(
                  startIndex + itemsPerPage,
                  filteredCredits.length
                )}`}{" "}
            de {filteredCredits.length} créditos
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
              )
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

      {/* MODAL FORMULARIO (Registrar / Editar / Ver solo lectura) */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
              {isReadOnly
                ? "Detalle de Crédito"
                : editingId
                ? "Editar Crédito"
                : "Registrar Nuevo Crédito"}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isReadOnly) {
                  closeForm();
                  return;
                }
                saveCredit();
              }}
              className="space-y-5 text-neutral-200"
            >
              {/* FILA 1: Cliente / Monto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-neutral-300">
                    Cliente <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre del cliente"
                    className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                      isReadOnly
                        ? "opacity-70 cursor-not-allowed"
                        : "focus:border-green-500"
                    }`}
                    value={formData.cliente}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      setFormData({ ...formData, cliente: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-neutral-300">
                    Monto del Crédito <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                      isReadOnly
                        ? "opacity-70 cursor-not-allowed"
                        : "focus:border-green-500"
                    }`}
                    value={formData.monto}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      setFormData({ ...formData, monto: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* FILA 2: Plazo / Tasa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-neutral-300">
                    Plazo (meses) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="12"
                    className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                      isReadOnly
                        ? "opacity-70 cursor-not-allowed"
                        : "focus:border-green-500"
                    }`}
                    value={formData.plazoMeses}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        plazoMeses: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-neutral-300">
                    Tasa de Interés (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="12.5"
                    className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                      isReadOnly
                        ? "opacity-70 cursor-not-allowed"
                        : "focus:border-green-500"
                    }`}
                    value={formData.tasaInteres}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tasaInteres: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* FILA 3: Cuota inicial / Tipo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-neutral-300">
                    Cuota Inicial
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                      isReadOnly
                        ? "opacity-70 cursor-not-allowed"
                        : "focus:border-green-500"
                    }`}
                    value={formData.cuotaInicial}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cuotaInicial: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-neutral-300">
                    Tipo de Crédito <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                      isReadOnly
                        ? "opacity-70 cursor-not-allowed"
                        : "focus:border-green-500"
                    }`}
                    value={formData.tipoCredito}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipoCredito: e.target.value,
                      })
                    }
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="Personal">Personal</option>
                    <option value="Empresarial">Empresarial</option>
                    <option value="Vehicular">Vehicular</option>
                    <option value="Hipotecario">Hipotecario</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              {/* Garantía */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-300">
                  Garantía
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalles de la garantía ofrecida"
                  className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                    isReadOnly
                      ? "opacity-70 cursor-not-allowed"
                      : "focus:border-green-500"
                  }`}
                  value={formData.garantia}
                  disabled={isReadOnly}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      garantia: e.target.value,
                    })
                  }
                />
              </div>

              {/* Descripción */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-300">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  placeholder="Descripción adicional del crédito"
                  className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                    isReadOnly
                      ? "opacity-70 cursor-not-allowed"
                      : "focus:border-green-500"
                  }`}
                  value={formData.descripcion}
                  disabled={isReadOnly}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      descripcion: e.target.value,
                    })
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
                      {editingId ? "Guardar Cambios" : "Registrar Crédito"}
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
