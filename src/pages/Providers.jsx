// src/pages/Providers.jsx  (o Proveedores.jsx)
import { useMemo, useState, useEffect } from "react";
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiUser,
  FiBriefcase,
} from "react-icons/fi";
import { proveedoresService } from "../services/proveedoresService";

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

export default function Providers() {
  // ===== DATA INICIAL (desde servicio) =====
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // servicio (import arriba)

  useEffect(() => {
    fetchProviders();
  }, []);

  const mapBackendToFrontend = (u) => ({
    id: u.id,
    nombre: u.nombre_o_razon_social ?? u.nombre ?? "",
    tipoPersona: u.tipo ?? "",
    documentoNit: u.documento ?? u.documentoNit ?? "",
    contacto: u.contacto ?? "",
    email: u.email ?? "",
    telefono: u.telefono ?? "",
    ciudad: u.ciudad ?? "",
    direccion: u.direccion ?? "",
    observaciones: u.observaciones ?? "",
    estado:
      typeof u.estado === "string" && u.estado.toLowerCase() === "activo"
        ? "activo"
        : "inactivo",
  });

  const fetchProviders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await proveedoresService.getAll();
      const list = res?.data ?? res ?? [];
      const mapped = Array.isArray(list) ? list.map(mapBackendToFrontend) : [];
      setProviders(mapped);
    } catch (err) {
      console.error(err);
      setError("Error cargando proveedores");
    } finally {
      setLoading(false);
    }
  };

  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false); // modo lectura
  const [editingId, setEditingId] = useState(null);

  // ===== PAGINACIÓN =====
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProviders = providers.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(term) ||
      (p.documentoNit || "").toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term) ||
      p.ciudad.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProviders.length / itemsPerPage),
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProviders = filteredProviders.slice(
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

  // ===== FORM DATA =====
  const emptyForm = {
    nombre: "",
    tipoPersona: "Jurídica",
    documentoNit: "",
    telefono: "",
    contacto: "",
    email: "",
    ciudad: "",
    direccion: "",
    observaciones: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  // ===== Ciudad buscador (sin cambiar estilos globales) =====
  const [cityQuery, setCityQuery] = useState("");
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const citySuggestions = useMemo(() => {
    const q = (cityQuery || "").toLowerCase().trim();
    if (!q) return COLOMBIA_CITIES.slice(0, 6);
    return COLOMBIA_CITIES.filter((c) => c.toLowerCase().includes(q)).slice(
      0,
      6,
    );
  }, [cityQuery]);

  const handleChange = (field, value) => {
    if (field === "tipoPersona") {
      setFormData((prev) => ({
        ...prev,
        tipoPersona: value,
        documentoNit: prev.documentoNit, // no lo borro, solo cambia el label/placeholder
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ===== MODAL / CRUD =====
  const openFormForCreate = () => {
    setIsViewMode(false);
    setEditingId(null);
    setFormData(emptyForm);
    setCityQuery("");
    setShowCitySuggestions(false);
    setIsFormOpen(true);
  };

  const openFormForEdit = (provider) => {
    setIsViewMode(false);
    setEditingId(provider.id);
    setFormData({
      nombre: provider.nombre,
      tipoPersona: provider.tipoPersona,
      documentoNit: provider.documentoNit,
      telefono: provider.telefono,
      contacto: provider.contacto ?? "",
      email: provider.email,
      ciudad: provider.ciudad,
      direccion: provider.direccion,
      observaciones: provider.observaciones || "",
    });
    setCityQuery(provider.ciudad || "");
    setShowCitySuggestions(false);
    setIsFormOpen(true);
  };

  const openFormForView = (provider) => {
    setIsViewMode(true);
    setEditingId(null);
    setFormData({
      nombre: provider.nombre,
      tipoPersona: provider.tipoPersona,
      documentoNit: provider.documentoNit,
      telefono: provider.telefono,
      contacto: provider.contacto ?? "",
      email: provider.email,
      ciudad: provider.ciudad,
      direccion: provider.direccion,
      observaciones: provider.observaciones || "",
    });
    setCityQuery(provider.ciudad || "");
    setShowCitySuggestions(false);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setShowCitySuggestions(false);
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      alert("El nombre del proveedor es obligatorio");
      return false;
    }
    if (!formData.tipoPersona) {
      alert("El tipo de proveedor es obligatorio");
      return false;
    }
    if (!formData.documentoNit.trim()) {
      alert(
        formData.tipoPersona === "Jurídica"
          ? "El NIT es obligatorio"
          : "El documento es obligatorio",
      );
      return false;
    }
    if (!formData.telefono.trim()) {
      alert("El teléfono es obligatorio");
      return false;
    }
    if (!formData.email.trim()) {
      alert("El email es obligatorio");
      return false;
    }
    // validación sencilla de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      alert("El email no tiene un formato válido");
      return false;
    }
    if (!formData.ciudad.trim()) {
      alert("La ciudad es obligatoria");
      return false;
    }
    if (!formData.direccion.trim()) {
      alert("La dirección es obligatoria");
      return false;
    }
    return true;
  };

  const saveProvider = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        tipo: formData.tipoPersona,
        tipo_documento:
          formData.tipoPersona === "Jurídica"
            ? "NIT"
            : (formData.tipo_documento ?? ""),
        documento: formData.documentoNit.trim(),
        nombre_o_razon_social: formData.nombre.trim(),
        contacto: formData.contacto ?? "",
        email: formData.email.trim(),
        telefono: formData.telefono.trim(),
        estado: (formData.estado || "activo").toLowerCase(),
      };

      if (editingId) {
        await proveedoresService.update(editingId, payload);
      } else {
        await proveedoresService.create(payload);
      }

      await fetchProviders();
      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
      alert(err?.message || "Error guardando proveedor");
    } finally {
      setSaving(false);
    }
  };

  const deleteProvider = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este proveedor?")) return;
    try {
      await proveedoresService.delete(id);
      await fetchProviders();
    } catch (err) {
      console.error(err);
      alert("Error eliminando proveedor");
    }
  };

  const toggleEstado = async (id) => {
    const p = providers.find((x) => x.id === id);
    if (!p) return;
    const newEstado =
      (p.estado || "").toLowerCase() === "activo" ? "inactivo" : "activo";
    try {
      await proveedoresService.toggleEstado(id, newEstado);
      setProviders((prev) =>
        prev.map((prov) =>
          prov.id === id ? { ...prov, estado: newEstado } : prov,
        ),
      );
    } catch (err) {
      console.error(err);
      alert("Error cambiando estado");
    }
  };

  const disabledField = isViewMode;

  const estadoBtnClass = (estado) =>
    (estado || "").toString().toLowerCase() === "activo"
      ? "bg-green-600 text-black hover:bg-green-500"
      : "bg-red-600 text-black hover:bg-red-500";

  // ===== RENDER =====
  return (
    <div className="p-6">
      {/* ENCABEZADO + BOTÓN ALINEADO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-wide">
            Gestión de Proveedores
          </h2>
          <p className="text-neutral-400 text-sm">
            Administra proveedores y distribuidores de alimentos.
          </p>
        </div>

        <button
          onClick={openFormForCreate}
          className="mt-3 md:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-5 py-3 rounded-xl shadow-md transition"
        >
          <FiUser />
          Nuevo Proveedor
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-neutral-900/70 border border-neutral-700 rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex items-center bg-neutral-800/70 border border-neutral-600 rounded-xl px-4 py-3 shadow-md">
          <FiSearch className="text-neutral-400 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Buscar proveedores (nombre, documento/NIT, email, ciudad)..."
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
              <th className="p-3 font-semibold">Nombre proveedor</th>
              <th className="p-3 font-semibold">Correo</th>
              <th className="p-3 font-semibold">Teléfono</th>
              <th className="p-3 font-semibold">Tipo de proveedor</th>
              <th className="p-3 font-semibold">NIT/Documento</th>
              <th className="p-3 font-semibold">Ciudad</th>
              <th className="p-3 font-semibold">Estado</th>
              <th className="p-3 font-semibold text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-sm text-neutral-200">
            {loading && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-neutral-400">
                  {error ? error : "Cargando proveedores..."}
                </td>
              </tr>
            )}
            {paginatedProviders.map((p) => (
              <tr
                key={p.id}
                className="border-t border-neutral-700 hover:bg-neutral-800/50 transition"
              >
                <td className="p-3">
                  <div className="font-semibold text-white">{p.nombre}</div>
                </td>

                <td className="p-3">{p.email}</td>
                <td className="p-3">{p.telefono}</td>

                <td className="p-3">
                  <span className="px-3 py-1 rounded-full text-xs bg-neutral-800 border border-neutral-700">
                    {p.tipoPersona}
                  </span>
                </td>

                <td className="p-3">{p.documentoNit}</td>
                <td className="p-3">{p.ciudad}</td>

                <td className="p-3">
                  <button
                    onClick={() => toggleEstado(p.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow cursor-pointer transition ${estadoBtnClass(
                      p.estado,
                    )}`}
                  >
                    {p.estado
                      ? p.estado.charAt(0).toUpperCase() + p.estado.slice(1)
                      : ""}
                  </button>
                </td>

                <td className="p-3">
                  <div className="flex justify-center gap-3">
                    <button
                      className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg shadow text-white"
                      onClick={() => openFormForView(p)}
                    >
                      <FiEye className="text-lg" />
                    </button>

                    <button
                      className="bg-green-600 hover:bg-green-500 text-black p-2 rounded-lg shadow"
                      onClick={() => openFormForEdit(p)}
                    >
                      <FiEdit2 className="text-lg" />
                    </button>

                    <button
                      className="bg-red-600 hover:bg-red-500 text-black p-2 rounded-lg shadow"
                      onClick={() => deleteProvider(p.id)}
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginatedProviders.length === 0 && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-neutral-400">
                  No se encontraron proveedores.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINACIÓN */}
        <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 border-t border-neutral-800 gap-3 text-sm text-neutral-300">
          <span>
            Mostrando{" "}
            {filteredProviders.length === 0
              ? "0"
              : `${startIndex + 1}–${Math.min(
                  startIndex + itemsPerPage,
                  filteredProviders.length,
                )}`}{" "}
            de {filteredProviders.length} proveedores
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
          <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto text-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <FiBriefcase />
                {isViewMode
                  ? "Detalle de Proveedor"
                  : editingId
                    ? "Editar Proveedor"
                    : "Registrar Nuevo Proveedor"}
              </h3>

              <button
                onClick={closeForm}
                className="text-neutral-400 hover:text-white text-xl"
              >
                ✖
              </button>
            </div>

            {/* FORM */}
            <div className="space-y-6 mb-6">
              <div>
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Tipo persona ARRIBA */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm">
                      Tipo de Proveedor <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500"
                      value={formData.tipoPersona}
                      onChange={(e) =>
                        handleChange("tipoPersona", e.target.value)
                      }
                      disabled={disabledField}
                    >
                      <option value="Jurídica">Jurídica</option>
                      <option value="Natural">Natural</option>
                    </select>
                  </div>

                  {/* Nombre */}
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-sm">
                      Nombre de proveedor{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500"
                      value={formData.nombre}
                      onChange={(e) => handleChange("nombre", e.target.value)}
                      disabled={disabledField}
                      placeholder="Nombre o razón social"
                    />
                  </div>

                  {/* Documento/NIT */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm">
                      {formData.tipoPersona === "Jurídica"
                        ? "NIT"
                        : "Documento"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500"
                      value={formData.documentoNit}
                      onChange={(e) =>
                        handleChange("documentoNit", e.target.value)
                      }
                      disabled={disabledField}
                      placeholder={
                        formData.tipoPersona === "Jurídica"
                          ? "Número de NIT"
                          : "Número de documento"
                      }
                    />
                  </div>

                  {/* Contacto (opcional) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm">Contacto</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500"
                      value={formData.contacto}
                      onChange={(e) => handleChange("contacto", e.target.value)}
                      disabled={disabledField}
                      placeholder="Nombre del contacto"
                    />
                  </div>

                  {/* Teléfono */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500"
                      value={formData.telefono}
                      onChange={(e) => handleChange("telefono", e.target.value)}
                      disabled={disabledField}
                      placeholder="Teléfono"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm">
                      Correo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      disabled={disabledField}
                      placeholder="correo@empresa.com"
                    />
                  </div>

                  {/* Ciudad buscador */}
                  <div className="flex flex-col gap-1 relative">
                    <label className="text-sm">
                      Ciudad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500"
                      value={cityQuery}
                      onChange={(e) => {
                        setCityQuery(e.target.value);
                        handleChange("ciudad", e.target.value);
                        setShowCitySuggestions(true);
                      }}
                      onFocus={() => {
                        if (!disabledField) setShowCitySuggestions(true);
                      }}
                      onBlur={() => {
                        // pequeño delay para permitir click en sugerencia
                        setTimeout(() => setShowCitySuggestions(false), 120);
                      }}
                      disabled={disabledField}
                      placeholder="Ciudad"
                    />

                    {!disabledField &&
                      showCitySuggestions &&
                      citySuggestions.length > 0 && (
                        <div className="absolute top-[78px] left-0 w-full bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg overflow-hidden z-50">
                          {citySuggestions.map((c) => (
                            <button
                              type="button"
                              key={c}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setCityQuery(c);
                                handleChange("ciudad", c);
                                setShowCitySuggestions(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-800"
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                </div>

                {/* Dirección */}
                <div className="mt-4">
                  <label className="text-sm block mb-1">
                    Dirección <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500"
                    value={formData.direccion}
                    onChange={(e) => handleChange("direccion", e.target.value)}
                    disabled={disabledField}
                    placeholder="Dirección completa del proveedor"
                  />
                </div>

                {/* Observaciones (se mantiene igual) */}
                <div className="mt-4">
                  <label className="text-sm font-medium text-neutral-300 block mb-1">
                    Observaciones
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500"
                    value={formData.observaciones}
                    onChange={(e) =>
                      handleChange("observaciones", e.target.value)
                    }
                    disabled={disabledField}
                    placeholder="Notas adicionales sobre el proveedor..."
                  />
                </div>
              </div>
            </div>

            {/* BOTONES (SIN TOCAR) */}
            <div className="flex justify-end gap-3 mt-2">
              <button
                className="px-5 py-2 bg-neutral-700 text-neutral-200 hover:bg-neutral-600 rounded-xl transition"
                onClick={closeForm}
              >
                {isViewMode ? "Cerrar" : "Cancelar"}
              </button>

              {!isViewMode && (
                <button
                  className="px-5 py-2 bg-green-600 hover:bg-green-500 text-black font-semibold rounded-xl transition disabled:opacity-50"
                  onClick={saveProvider}
                  disabled={saving}
                >
                  {saving
                    ? "Guardando..."
                    : editingId
                      ? "Guardar Cambios"
                      : "Registrar Proveedor"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
