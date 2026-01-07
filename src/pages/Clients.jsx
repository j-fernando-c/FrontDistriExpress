// src/pages/Clients.jsx
import { useState } from "react";
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiUserPlus,
} from "react-icons/fi";

const COLOMBIA_CITIES = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Pereira",
  "Manizales",
  "Santa Marta",
  "Cúcuta",
];

export default function Clients() {
  const [clients, setClients] = useState([
    {
      id: 1,
      nombres: "Juan Carlos",
      apellidos: "Pérez García",
      email: "juan.perez@email.com",
      telefono: "3001234567",
      direccion: "Cra 10 #20-30",
      ciudad: "Medellín",
      tipoCliente: "Natural",
      nit: "", // para jurídico
      documento: "1030123456", // ✅ para natural
      totalCompras: 2450000,
      estado: "Activo",
    },
    {
      id: 2,
      nombres: "Distribuidora La Central",
      apellidos: "",
      email: "contacto@central.com",
      telefono: "3019876543",
      direccion: "Av. 80 #45-10",
      ciudad: "Bogotá",
      tipoCliente: "Jurídico",
      nit: "900123456-1",
      documento: "",
      totalCompras: 5680000,
      estado: "Activo",
    },
  ]);

  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false); // solo lectura
  const [editingId, setEditingId] = useState(null);

  // paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ ciudad buscador
  const [cityQuery, setCityQuery] = useState("");
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const [formData, setFormData] = useState({
    tipoCliente: "Natural", // ✅ ahora arriba
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    nit: "",
    documento: "",
  });

  // ===== FILTRO + PAGINACIÓN =====
  const filteredClients = clients.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.nombres.toLowerCase().includes(term) ||
      (c.apellidos || "").toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.ciudad.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredClients.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(
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

  // ===== CITY HELPERS =====
  const citySuggestions = (() => {
    const q = (cityQuery || "").trim().toLowerCase();
    if (!q) return [];
    return COLOMBIA_CITIES.filter((c) => c.toLowerCase().includes(q)).slice(
      0,
      6
    );
  })();

  const pickCity = (city) => {
    setCityQuery(city);
    setFormData((prev) => ({ ...prev, ciudad: city }));
    setShowCitySuggestions(false);
  };

  // ===== FORMULARIO =====
  const openForm = (client = null, viewMode = false) => {
    if (client) {
      setEditingId(client.id);
      setFormData({
        tipoCliente: client.tipoCliente || "Natural",
        nombres: client.nombres,
        apellidos: client.apellidos || "",
        email: client.email,
        telefono: client.telefono,
        direccion: client.direccion,
        ciudad: client.ciudad,
        nit: client.nit || "",
        documento: client.documento || "",
      });
      setCityQuery(client.ciudad || "");
    } else {
      setEditingId(null);
      setFormData({
        tipoCliente: "Natural",
        nombres: "",
        apellidos: "",
        email: "",
        telefono: "",
        direccion: "",
        ciudad: "",
        nit: "",
        documento: "",
      });
      setCityQuery("");
    }
    setIsViewMode(viewMode);
    setShowCitySuggestions(false);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsViewMode(false);
    setShowCitySuggestions(false);
  };

  const handleChange = (field, value) => {
    // ✅ si cambia tipoCliente: limpiar NIT/Documento según corresponda
    if (field === "tipoCliente") {
      setFormData((prev) => ({
        ...prev,
        tipoCliente: value,
        nit: value === "Jurídico" ? prev.nit : "",
        documento: value === "Natural" ? prev.documento : "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.tipoCliente) {
      alert("El tipo de cliente es obligatorio");
      return false;
    }

    if (!formData.nombres.trim()) {
      alert("El nombre es obligatorio");
      return false;
    }
    if (!formData.apellidos.trim()) {
      alert("Los apellidos son obligatorios");
      return false;
    }
    if (!formData.email.trim()) {
      alert("El email es obligatorio");
      return false;
    }
    // validación sencilla de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert("El email no tiene un formato válido");
      return false;
    }
    if (!formData.telefono.trim()) {
      alert("El teléfono es obligatorio");
      return false;
    }
    if (!formData.direccion.trim()) {
      alert("La dirección es obligatoria");
      return false;
    }
    if (!formData.ciudad.trim()) {
      alert("La ciudad es obligatoria");
      return false;
    }

    // ✅ Jurídico => NIT obligatorio; Natural => Documento obligatorio
    if (formData.tipoCliente === "Jurídico") {
      if (!formData.nit.trim()) {
        alert("El NIT es obligatorio para clientes jurídicos");
        return false;
      }
    } else {
      if (!formData.documento.trim()) {
        alert("El documento es obligatorio para clientes naturales");
        return false;
      }
    }

    return true;
  };

  const saveClient = () => {
    if (!validateForm()) return;

    if (editingId) {
      // editar
      setClients((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                ...formData,
                // mantener consistencia
                nit: formData.tipoCliente === "Jurídico" ? formData.nit : "",
                documento:
                  formData.tipoCliente === "Natural" ? formData.documento : "",
              }
            : c
        )
      );
    } else {
      // crear
      const newId = clients.length
        ? Math.max(...clients.map((c) => c.id)) + 1
        : 1;

      const newClient = {
        id: newId,
        ...formData,
        nit: formData.tipoCliente === "Jurídico" ? formData.nit : "",
        documento: formData.tipoCliente === "Natural" ? formData.documento : "",
        totalCompras: 0, // queda en el objeto, pero ya NO se muestra en tabla
        estado: "Activo",
      };

      setClients((prev) => [...prev, newClient]);
    }

    setIsFormOpen(false);
    setIsViewMode(false);
  };

  const deleteClient = (id) => {
    if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleEstado = (id) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              estado: c.estado === "Activo" ? "Inactivo" : "Activo",
            }
          : c
      )
    );
  };

  // ===== RENDER =====
  return (
    <div className="p-6">
      {/* ENCABEZADO + BOTÓN */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-wide">
            Gestión de Clientes
          </h2>
          <p className="text-neutral-400 text-sm">
            Administra la información de tus clientes.
          </p>
        </div>

        <button
          onClick={() => openForm(null, false)}
          className="mt-3 md:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-5 py-3 rounded-xl shadow-md transition"
        >
          <FiUserPlus />
          Registrar Cliente
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-neutral-900/70 border border-neutral-700 rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex items-center bg-neutral-800/70 border border-neutral-600 rounded-xl px-4 py-3 shadow-md">
          <FiSearch className="text-neutral-400 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o ciudad..."
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
              {/* ✅ contacto separado */}
              <th className="p-3 font-semibold">Correo</th>
              <th className="p-3 font-semibold">Número</th>
              <th className="p-3 font-semibold">Ciudad</th>
              <th className="p-3 font-semibold">Tipo</th>
              {/* ✅ renombrado */}
              <th className="p-3 font-semibold">Documento/NIT</th>
              {/* ❌ se quita Total Compras */}
              <th className="p-3 font-semibold">Estado</th>
              <th className="p-3 font-semibold text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-sm text-neutral-200">
            {paginatedClients.map((client) => (
              <tr
                key={client.id}
                className="border-t border-neutral-700 hover:bg-neutral-800/50 transition"
              >
                <td className="p-3">
                  <div className="font-semibold">
                    {client.nombres} {client.apellidos}
                  </div>
                </td>

                {/* ✅ correo / número */}
                <td className="p-3">{client.email}</td>
                <td className="p-3">{client.telefono}</td>

                <td className="p-3">{client.ciudad}</td>
                <td className="p-3">{client.tipoCliente}</td>

                {/* ✅ documento/nit */}
                <td className="p-3">
                  {client.tipoCliente === "Jurídico"
                    ? client.nit || "-"
                    : client.documento || "-"}
                </td>

                <td className="p-3">
                  <button
                    onClick={() => toggleEstado(client.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow cursor-pointer transition ${
                      client.estado === "Activo"
                        ? "bg-green-600 text-black hover:bg-green-500"
                        : "bg-red-600 text-black hover:bg-red-500"
                    }`}
                  >
                    {client.estado}
                  </button>
                </td>

                <td className="p-3">
                  <div className="flex justify-center gap-3">
                    {/* Ver (modo lectura) */}
                    <button
                      className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg shadow text-white"
                      onClick={() => openForm(client, true)}
                    >
                      <FiEye className="text-lg" />
                    </button>

                    {/* Editar */}
                    <button
                      className="bg-green-600 hover:bg-green-500 text-black p-2 rounded-lg shadow"
                      onClick={() => openForm(client, false)}
                    >
                      <FiEdit2 className="text-lg" />
                    </button>

                    {/* Eliminar */}
                    <button
                      className="bg-red-600 hover:bg-red-500 text-black p-2 rounded-lg shadow"
                      onClick={() => deleteClient(client.id)}
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginatedClients.length === 0 && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-neutral-400">
                  No se encontraron clientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINACIÓN */}
        <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 border-t border-neutral-800 gap-3 text-sm text-neutral-300">
          <span>
            Mostrando{" "}
            {filteredClients.length === 0
              ? "0"
              : `${startIndex + 1}–${Math.min(
                  startIndex + itemsPerPage,
                  filteredClients.length
                )}`}{" "}
            de {filteredClients.length} clientes
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

      {/* MODAL FORMULARIO */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto text-neutral-200">
            <h3 className="text-xl font-semibold mb-4 text-white">
              {isViewMode
                ? "Ver Cliente"
                : editingId
                ? "Editar Cliente"
                : "Registrar Nuevo Cliente"}
            </h3>

            {/* ✅ Tipo de cliente arriba */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-medium text-neutral-300">
                  Tipo de Cliente <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500 disabled:opacity-60"
                  value={formData.tipoCliente}
                  onChange={(e) =>
                    handleChange("tipoCliente", e.target.value)
                  }
                  disabled={isViewMode}
                >
                  <option value="Natural">Natural</option>
                  <option value="Jurídico">Jurídico</option>
                </select>
              </div>

              {/* Documento o NIT según tipo */}
              {formData.tipoCliente === "Jurídico" ? (
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-sm font-medium text-neutral-300">
                    NIT <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500 disabled:opacity-60"
                    value={formData.nit}
                    onChange={(e) => handleChange("nit", e.target.value)}
                    disabled={isViewMode}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-sm font-medium text-neutral-300">
                    Documento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500 disabled:opacity-60"
                    value={formData.documento}
                    onChange={(e) =>
                      handleChange("documento", e.target.value)
                    }
                    disabled={isViewMode}
                  />
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Nombres */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-300">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500 disabled:opacity-60"
                  value={formData.nombres}
                  onChange={(e) => handleChange("nombres", e.target.value)}
                  disabled={isViewMode}
                />
              </div>

              {/* Apellidos */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-300">
                  Apellidos o razon social<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500 disabled:opacity-60"
                  value={formData.apellidos}
                  onChange={(e) => handleChange("apellidos", e.target.value)}
                  disabled={isViewMode}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-300">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500 disabled:opacity-60"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={isViewMode}
                />
              </div>

              {/* Teléfono */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-300">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500 disabled:opacity-60"
                  value={formData.telefono}
                  onChange={(e) => handleChange("telefono", e.target.value)}
                  disabled={isViewMode}
                />
              </div>

              {/* Dirección */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-medium text-neutral-300">
                  Dirección <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500 disabled:opacity-60"
                  value={formData.direccion}
                  onChange={(e) => handleChange("direccion", e.target.value)}
                  disabled={isViewMode}
                />
              </div>

              {/* ✅ Ciudad buscador */}
              <div className="flex flex-col gap-1 md:col-span-2 relative">
                <label className="text-sm font-medium text-neutral-300">
                  Ciudad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500 disabled:opacity-60"
                  value={isViewMode ? formData.ciudad : cityQuery}
                  onFocus={() => !isViewMode && setShowCitySuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowCitySuggestions(false), 120)
                  }
                  onChange={(e) => {
                    const v = e.target.value;
                    setCityQuery(v);
                    handleChange("ciudad", v);
                    setShowCitySuggestions(true);
                  }}
                  disabled={isViewMode}
                />

                {!isViewMode &&
                  showCitySuggestions &&
                  citySuggestions.length > 0 &&
                  cityQuery.trim() && (
                    <div className="absolute z-50 mt-2 w-full bg-neutral-900 border border-neutral-700 rounded-xl shadow-xl overflow-hidden">
                      {citySuggestions.map((city) => (
                        <button
                          key={city}
                          type="button"
                          className="w-full text-left px-4 py-3 hover:bg-neutral-800/70 transition"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => pickCity(city)}
                        >
                          <div className="text-neutral-100">{city}</div>
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-5 py-2 bg-neutral-700 text-neutral-200 hover:bg-neutral-600 rounded-xl transition"
                onClick={closeForm}
              >
                {isViewMode ? "Cerrar" : "Cancelar"}
              </button>

              {!isViewMode && (
                <button
                  className="px-5 py-2 bg-green-600 hover:bg-green-500 text-black font-semibold rounded-xl transition"
                  onClick={saveClient}
                >
                  {editingId ? "Guardar Cambios" : "Registrar Cliente"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
