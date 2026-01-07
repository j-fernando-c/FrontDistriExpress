// src/pages/Zones.jsx
import { useState } from "react";
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";

export default function Zones() {
  const [zones, setZones] = useState([
    {
      id: 1,
      nombre: "Zona Norte",
      descripcion: "Zona de distribución norte - Categoría urbana",
      observaciones: "Cobertura principal en barrios residenciales.",
      tiendas: [
        {
          nombre: "Tienda Norte 1",
          contacto: "Carlos López",
          telefono: "555-0101",
          direccion: "Calle 10 #12-34",
        },
        {
          nombre: "Tienda Norte 2",
          contacto: "Ana Pérez",
          telefono: "555-0102",
          direccion: "Carrera 15 #20-10",
        },
      ],
      estado: "Activa",
    },
    {
      id: 2,
      nombre: "Zona Sur",
      descripcion: "Zona de distribución sur - Categoría rural",
      observaciones: "",
      tiendas: [
        {
          nombre: "Tienda Sur 1",
          contacto: "Luis Martínez",
          telefono: "555-0201",
          direccion: "Vereda La Esperanza",
        },
      ],
      estado: "Inactiva",
    },
  ]);

  const [search, setSearch] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const emptyTienda = () => ({
    nombre: "",
    contacto: "",
    telefono: "",
    direccion: "",
  });

  const [formData, setFormData] = useState({
    nombreZona: "",
    descripcion: "",
    observaciones: "",
    tiendas: [emptyTienda()],
  });

  // ===== FILTRO + PAGINACIÓN =====
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredZones = zones.filter((z) => {
    const term = search.toLowerCase();
    return (
      z.nombre.toLowerCase().includes(term) ||
      z.descripcion.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredZones.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedZones = filteredZones.slice(
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

  // ===== FORM HELPERS =====
  const buildFormFromZone = (zone) => ({
    nombreZona: zone.nombre,
    descripcion: zone.descripcion,
    observaciones: zone.observaciones || "",
    tiendas:
      zone.tiendas && zone.tiendas.length
        ? zone.tiendas.map((t) => ({ ...t }))
        : [emptyTienda()],
  });

  const resetForm = () => {
    setFormData({
      nombreZona: "",
      descripcion: "",
      observaciones: "",
      tiendas: [emptyTienda()],
    });
  };

  const openForm = (zone = null) => {
    setIsReadOnly(false);
    if (zone) {
      setEditingId(zone.id);
      setFormData(buildFormFromZone(zone));
    } else {
      setEditingId(null);
      resetForm();
    }
    setIsFormOpen(true);
  };

  const openView = (zone) => {
    setIsReadOnly(true);
    setEditingId(zone.id);
    setFormData(buildFormFromZone(zone));
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsReadOnly(false);
    setEditingId(null);
  };

  const validateForm = () => {
    if (!formData.nombreZona.trim()) {
      alert("El nombre de la zona es obligatorio");
      return false;
    }
    if (!formData.descripcion.trim()) {
      alert("La descripción de la zona es obligatoria");
      return false;
    }

    const tiendasValidas = formData.tiendas.filter(
      (t) => t.nombre.trim() && t.direccion.trim()
    );

    if (!tiendasValidas.length) {
      alert(
        "Debe registrar al menos una tienda con nombre y dirección."
      );
      return false;
    }

    return true;
  };

  const saveZone = () => {
    if (isReadOnly) return;
    if (!validateForm()) return;

    const tiendasLimpias = formData.tiendas
      .filter((t) => t.nombre.trim() && t.direccion.trim())
      .map((t) => ({
        ...t,
        contacto: t.contacto || "",
        telefono: t.telefono || "",
      }));

    if (editingId) {
      setZones((prev) =>
        prev.map((z) =>
          z.id === editingId
            ? {
                ...z,
                nombre: formData.nombreZona,
                descripcion: formData.descripcion,
                observaciones: formData.observaciones,
                tiendas: tiendasLimpias,
              }
            : z
        )
      );
    } else {
      const newId = zones.length
        ? Math.max(...zones.map((z) => z.id)) + 1
        : 1;

      const nuevaZona = {
        id: newId,
        nombre: formData.nombreZona,
        descripcion: formData.descripcion,
        observaciones: formData.observaciones,
        tiendas: tiendasLimpias,
        estado: "Activa",
      };

      setZones((prev) => [...prev, nuevaZona]);
    }

    closeForm();
  };

  const deleteZone = (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta zona?")) return;
    setZones((prev) => prev.filter((z) => z.id !== id));
  };

  const toggleEstado = (id) => {
    setZones((prev) =>
      prev.map((z) =>
        z.id === id
          ? {
              ...z,
              estado: z.estado === "Activa" ? "Inactiva" : "Activa",
            }
          : z
      )
    );
  };

  const estadoClasses = (estado) =>
    estado === "Activa"
      ? "bg-green-600 text-black hover:bg-green-500"
      : "bg-red-600 text-black hover:bg-red-500";

  // ===== TIENDAS EN FORM =====
  const addTienda = () => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      tiendas: [...prev.tiendas, emptyTienda()],
    }));
  };

  const removeTienda = (index) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const tiendas = prev.tiendas.filter((_, i) => i !== index);
      return { ...prev, tiendas: tiendas.length ? tiendas : [emptyTienda()] };
    });
  };

  const updateTienda = (index, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const tiendas = prev.tiendas.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      );
      return { ...prev, tiendas };
    });
  };

  // ===== RENDER =====
  return (
    <div className="">
      {/* ENCABEZADO + BOTÓN ALINEADO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-wide">
            Gestión de Zonas
          </h2>
          <p className="text-neutral-400 text-sm">
            Administra zonas de entrega y sus tiendas asociadas.
          </p>
        </div>

        <button
          onClick={() => openForm()}
          className="mt-3 md:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-5 py-3 rounded-xl shadow-md transition"
        >
          <FiPlus />
          Nueva zona
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-neutral-900/70 border border-neutral-700 rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex items-center bg-neutral-800/70 border border-neutral-600 rounded-xl px-4 py-3 shadow-md">
          <FiSearch className="text-neutral-400 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Buscar zonas (nombre, descripción)..."
            className="w-full bg-transparent outline-none text-neutral-200 placeholder-neutral-500"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* TABLA (sin columna ID) */}
      <div className="overflow-x-auto bg-neutral-900/70 border border-neutral-700 rounded-2xl shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-neutral-800/80 text-neutral-300 text-sm uppercase">
            <tr>
              <th className="p-3 font-semibold">Zona</th>
              <th className="p-3 font-semibold">Descripción</th>
              <th className="p-3 font-semibold">Tiendas</th>
              <th className="p-3 font-semibold">Estado</th>
              <th className="p-3 font-semibold text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-sm text-neutral-200">
            {paginatedZones.map((z) => (
              <tr
                key={z.id}
                className="border-t border-neutral-700 hover:bg-neutral-800/50 transition"
              >
                <td className="p-3">{z.nombre}</td>
                <td className="p-3">{z.descripcion}</td>
                <td className="p-3">
                  {z.tiendas.length}{" "}
                  {z.tiendas.length === 1 ? "tienda" : "tiendas"}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggleEstado(z.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow cursor-pointer transition ${estadoClasses(
                      z.estado
                    )}`}
                  >
                    {z.estado}
                  </button>
                </td>
                <td className="p-3">
                  <div className="flex justify-center gap-3">
                    {/* VER (solo lectura) */}
                    <button
                      className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg shadow text-white"
                      onClick={() => openView(z)}
                    >
                      <FiEye className="text-lg" />
                    </button>

                    {/* EDITAR */}
                    <button
                      className="bg-green-600 hover:bg-green-500 text-black p-2 rounded-lg shadow"
                      onClick={() => openForm(z)}
                    >
                      <FiEdit2 className="text-lg" />
                    </button>

                    {/* ELIMINAR */}
                    <button
                      className="bg-red-600 hover:bg-red-500 text-black p-2 rounded-lg shadow"
                      onClick={() => deleteZone(z.id)}
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginatedZones.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-neutral-400">
                  No se encontraron zonas.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINACIÓN */}
        <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 border-t border-neutral-800 gap-3 text-sm text-neutral-300">
          <span>
            Mostrando{" "}
            {filteredZones.length === 0
              ? "0"
              : `${startIndex + 1}–${Math.min(
                  startIndex + itemsPerPage,
                  filteredZones.length
                )}`}{" "}
            de {filteredZones.length} zonas
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

      {/* MODAL FORM (Crear / Editar / Ver) */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-white">
              {isReadOnly
                ? "Detalle de Zona"
                : editingId
                ? "Editar Zona"
                : "Registrar Nueva Zona"}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isReadOnly) {
                  closeForm();
                  return;
                }
                saveZone();
              }}
              className="space-y-5 text-neutral-200"
            >
              {/* INFORMACIÓN PRINCIPAL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-neutral-300">
                    Nombre de la Zona{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Zona Norte, Zona Centro..."
                    className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                      isReadOnly
                        ? "opacity-70 cursor-not-allowed"
                        : "focus:border-green-500"
                    }`}
                    value={formData.nombreZona}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nombreZona: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-neutral-300">
                    Descripción <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Descripción de la zona"
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
              </div>

              {/* OBSERVACIONES (bloque pequeño) */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-300">
                  Observaciones
                </label>
                <textarea
                  rows={3}
                  placeholder="Observaciones adicionales sobre la zona..."
                  className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                    isReadOnly
                      ? "opacity-70 cursor-not-allowed"
                      : "focus:border-green-500"
                  }`}
                  value={formData.observaciones}
                  disabled={isReadOnly}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      observaciones: e.target.value,
                    })
                  }
                />
              </div>

              {/* TIENDAS */}
              <div className="bg-neutral-800/70 border border-neutral-700 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-neutral-200 font-semibold">
                    Tiendas de la Zona
                  </h4>

                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={addTienda}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black text-sm font-semibold px-3 py-2 rounded-lg"
                    >
                      <FiPlus className="text-sm" />
                      Agregar tienda
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-12 gap-3 text-xs text-neutral-400 mb-1">
                  <span className="col-span-3">Nombre de la tienda *</span>
                  <span className="col-span-3">Contacto</span>
                  <span className="col-span-2">Teléfono</span>
                  <span className="col-span-3">Dirección *</span>
                  <span className="col-span-1 text-center">Acción</span>
                </div>

                {formData.tiendas.map((t, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-3 items-center"
                  >
                    <input
                      type="text"
                      placeholder="Nombre de la tienda"
                      className={`col-span-3 p-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-neutral-200 outline-none ${
                        isReadOnly
                          ? "opacity-70 cursor-not-allowed"
                          : "focus:border-green-500"
                      }`}
                      value={t.nombre}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        updateTienda(index, "nombre", e.target.value)
                      }
                    />

                    <input
                      type="text"
                      placeholder="Nombre del contacto"
                      className={`col-span-3 p-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-neutral-200 outline-none ${
                        isReadOnly
                          ? "opacity-70 cursor-not-allowed"
                          : "focus:border-green-500"
                      }`}
                      value={t.contacto}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        updateTienda(index, "contacto", e.target.value)
                      }
                    />

                    <input
                      type="text"
                      placeholder="Teléfono"
                      className={`col-span-2 p-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-neutral-200 outline-none ${
                        isReadOnly
                          ? "opacity-70 cursor-not-allowed"
                          : "focus:border-green-500"
                      }`}
                      value={t.telefono}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        updateTienda(index, "telefono", e.target.value)
                      }
                    />

                    <input
                      type="text"
                      placeholder="Dirección completa"
                      className={`col-span-3 p-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-neutral-200 outline-none ${
                        isReadOnly
                          ? "opacity-70 cursor-not-allowed"
                          : "focus:border-green-500"
                      }`}
                      value={t.direccion}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        updateTienda(index, "direccion", e.target.value)
                      }
                    />

                    <div className="col-span-1 flex justify-center">
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => removeTienda(index)}
                          className="bg-red-600 hover:bg-red-500 text-black text-xs px-2 py-1 rounded-lg"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {formData.tiendas.length === 0 && (
                  <div className="text-center text-neutral-400 text-sm py-4">
                    No hay tiendas agregadas.
                  </div>
                )}
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
                      {editingId ? "Guardar cambios" : "Crear zona"}
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
