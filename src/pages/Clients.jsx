// src/pages/Clients.jsx
import { useState, useEffect } from "react";
import { FiSearch, FiEye, FiEdit2, FiTrash2, FiUserPlus } from "react-icons/fi";
import { clientesService } from "../services/clientesService";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientesService.getAll();
      setClients(response.data || []);
    } catch (err) {
      setError(err.message || "Error al cargar clientes");
      console.error("Error cargando clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false); // solo lectura
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  // paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    nombre: "",
    tipo_documento: "NIT",
    documento: "",
    email: "",
    telefono: "",
    direccion: "",
    estado: "activo",
  });

  // ===== FILTRO + PAGINACIÓN =====
  const filteredClients = clients.filter((c) => {
    const term = search.toLowerCase();
    const fields = [
      c.nombre,
      c.documento,
      c.tipo_documento,
      c.email,
      c.telefono,
      c.direccion,
      c.estado,
    ];
    return fields.some((field) => (field || "").toLowerCase().includes(term));
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredClients.length / itemsPerPage),
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(
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

  const formatDate = (iso) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (e) {
      return "-";
    }
  };

  // ===== FORMULARIO =====
  const openForm = (client = null, viewMode = false) => {
    if (client) {
      setEditingId(client.id);
      setFormData({
        nombre: client.nombre || "",
        tipo_documento: client.tipo_documento || "NIT",
        documento: client.documento || "",
        email: client.email || "",
        telefono: client.telefono || "",
        direccion: client.direccion || "",
        estado: client.estado || "activo",
      });
    } else {
      setEditingId(null);
      setFormData({
        nombre: "",
        tipo_documento: "NIT",
        documento: "",
        email: "",
        telefono: "",
        direccion: "",
        estado: "activo",
      });
    }
    setIsViewMode(viewMode);
    setErrors({});
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsViewMode(false);
    setErrors({});
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }
    if (!formData.tipo_documento.trim()) {
      newErrors.tipo_documento = "El tipo de documento es obligatorio";
    }
    if (!formData.documento.trim()) {
      newErrors.documento = "El documento es obligatorio";
    }
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no tiene un formato válido";
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveClient = async () => {
    if (!validateForm()) return;

    const data = {
      nombre: formData.nombre,
      tipo_documento: formData.tipo_documento,
      documento: formData.documento,
      email: formData.email,
      telefono: formData.telefono,
      direccion: formData.direccion,
      estado: formData.estado,
    };

    try {
      if (editingId) {
        await clientesService.update(editingId, data);
      } else {
        await clientesService.create(data);
      }
      await loadClients();
      setIsFormOpen(false);
      setIsViewMode(false);
    } catch (err) {
      alert(err.message || "Error al guardar cliente");
    }
  };

  const deleteClient = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;
    try {
      await clientesService.delete(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message || "Error al eliminar cliente");
    }
  };

  const toggleEstado = async (id) => {
    try {
      await clientesService.toggleEstado(id);
      setClients((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                estado: c.estado === "activo" ? "inactivo" : "activo",
              }
            : c,
        ),
      );
    } catch (err) {
      alert(err.message || "Error al cambiar estado");
    }
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
            placeholder="Buscar por nombre, documento, email o teléfono..."
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
              <th className="p-3 font-semibold">Tipo Doc</th>
              <th className="p-3 font-semibold">Documento</th>
              <th className="p-3 font-semibold">Teléfono</th>
              <th className="p-3 font-semibold">Correo</th>
              <th className="p-3 font-semibold">Dirección</th>
              <th className="p-3 font-semibold">Estado</th>
              <th className="p-3 font-semibold">Creado</th>
              <th className="p-3 font-semibold text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-sm text-neutral-200">
            {loading ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-neutral-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                    Cargando clientes...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={9} className="p-4 text-center text-red-400">
                  {error}
                  <button
                    onClick={loadClients}
                    className="ml-2 text-green-400 hover:underline"
                  >
                    Reintentar
                  </button>
                </td>
              </tr>
            ) : paginatedClients.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-4 text-center text-neutral-400">
                  No se encontraron clientes.
                </td>
              </tr>
            ) : (
              paginatedClients.map((client) => (
                <tr
                  key={client.id}
                  className="border-t border-neutral-700 hover:bg-neutral-800/50 transition"
                >
                  <td className="p-3">
                    <div className="font-semibold">{client.nombre}</div>
                  </td>
                  <td className="p-3">{client.tipo_documento}</td>
                  <td className="p-3">{client.documento}</td>
                  <td className="p-3">{client.telefono}</td>
                  <td className="p-3">{client.email}</td>
                  <td className="p-3">{client.direccion}</td>

                  <td className="p-3">
                    <button
                      onClick={() => toggleEstado(client.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow cursor-pointer transition ${
                        (client.estado || "").toLowerCase() === "activo"
                          ? "bg-green-600 text-black hover:bg-green-500"
                          : "bg-red-600 text-black hover:bg-red-500"
                      }`}
                    >
                      {(client.estado || "-").charAt(0).toUpperCase() +
                        (client.estado || "-").slice(1)}
                    </button>
                  </td>

                  <td className="p-3">{formatDate(client.fecha_creacion)}</td>

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
              ))
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
                  filteredClients.length,
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

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-medium text-neutral-300">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full p-3 bg-neutral-800 border rounded-xl text-neutral-200 outline-none focus:border-green-500 disabled:opacity-60 ${
                    errors.nombre ? "border-red-500" : "border-neutral-700"
                  }`}
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  disabled={isViewMode}
                  placeholder="Nombre del cliente"
                />
                {errors.nombre && (
                  <p className="text-xs text-red-400 mt-1">{errors.nombre}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-300">
                  Tipo de documento <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full p-3 bg-neutral-800 border rounded-xl text-neutral-200 outline-none focus:border-green-500 disabled:opacity-60 ${
                    errors.tipo_documento
                      ? "border-red-500"
                      : "border-neutral-700"
                  }`}
                  value={formData.tipo_documento}
                  onChange={(e) =>
                    handleChange("tipo_documento", e.target.value)
                  }
                  disabled={isViewMode}
                >
                  <option value="NIT">NIT</option>
                  <option value="CC">Cédula de ciudadanía</option>
                  <option value="CE">Cédula de extranjería</option>
                  <option value="PAS">Pasaporte</option>
                </select>
                {errors.tipo_documento && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.tipo_documento}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-300">
                  Documento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full p-3 bg-neutral-800 border rounded-xl text-neutral-200 outline-none focus:border-green-500 disabled:opacity-60 ${
                    errors.documento ? "border-red-500" : "border-neutral-700"
                  }`}
                  value={formData.documento}
                  onChange={(e) => handleChange("documento", e.target.value)}
                  disabled={isViewMode}
                  placeholder="Número de documento"
                />
                {errors.documento && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.documento}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-300">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className={`w-full p-3 bg-neutral-800 border rounded-xl text-neutral-200 outline-none focus:border-green-500 disabled:opacity-60 ${
                    errors.email ? "border-red-500" : "border-neutral-700"
                  }`}
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={isViewMode}
                  placeholder="correo@ejemplo.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-300">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full p-3 bg-neutral-800 border rounded-xl text-neutral-200 outline-none focus:border-green-500 disabled:opacity-60 ${
                    errors.telefono ? "border-red-500" : "border-neutral-700"
                  }`}
                  value={formData.telefono}
                  onChange={(e) => handleChange("telefono", e.target.value)}
                  disabled={isViewMode}
                  placeholder="Número de teléfono"
                />
                {errors.telefono && (
                  <p className="text-xs text-red-400 mt-1">{errors.telefono}</p>
                )}
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-medium text-neutral-300">
                  Dirección <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full p-3 bg-neutral-800 border rounded-xl text-neutral-200 outline-none focus:border-green-500 disabled:opacity-60 ${
                    errors.direccion ? "border-red-500" : "border-neutral-700"
                  }`}
                  value={formData.direccion}
                  onChange={(e) => handleChange("direccion", e.target.value)}
                  disabled={isViewMode}
                  placeholder="Dirección completa"
                />
                {errors.direccion && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.direccion}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-300">
                  Estado
                </label>
                <select
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500 disabled:opacity-60"
                  value={formData.estado}
                  onChange={(e) => handleChange("estado", e.target.value)}
                  disabled={isViewMode}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
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
