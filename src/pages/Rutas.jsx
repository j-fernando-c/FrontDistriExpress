// src/pages/Rutas.jsx
import { useEffect, useState } from "react";
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiArrowUp,
  FiArrowDown,
  FiMapPin,
} from "react-icons/fi";
import { rutasService } from "../services/rutasService";

const emptyStop = () => ({ nombre: "", direccion: "" });

export default function Rutas() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const mapBackendToFrontend = (r) => ({
    id: r.id,
    nombre: r.nombre_ruta ?? r.nombre ?? "",
    zona: r.destino ?? r.zona ?? "",
    tiempoMin: r.tiempo_min ?? r.tiempoMin ?? 0,
    distanciaKm: r.distancia_km ?? r.distanciaKm ?? 0,
    descripcion: r.origen ? `Origen: ${r.origen}` : (r.descripcion ?? ""),
    domiciliario: r.domiciliario ?? "",
    vehiculo: r.vehiculo ?? "",
    horaInicio: r.hora_inicio ?? r.horaInicio ?? "",
    horaFin: r.hora_fin ?? r.horaFin ?? "",
    observaciones: r.observaciones ?? "",
    estado: r.estado
      ? String(r.estado).charAt(0).toUpperCase() + String(r.estado).slice(1)
      : "Activa",
    paradas: r.paradas ?? [],
    // raw fields
    rutaId: r.id,
    clienteId: r.cliente_id ?? null,
    fechaCreacion: r.fecha_creacion ?? null,
    fechaCreacionStr: r.fecha_creacion
      ? String(r.fecha_creacion).split("T")[0]
      : "",
    origen: r.origen ?? null,
    destino: r.destino ?? null,
    clienteNombre: r.cliente_nombre ?? null,
    clienteTelefono: r.cliente_telefono ?? null,
  });

  const fetchRoutes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await rutasService.getAll();
      const list = res?.data ?? res ?? [];
      const mapped = Array.isArray(list) ? list.map(mapBackendToFrontend) : [];
      setRoutes(mapped);
    } catch (err) {
      console.error(err);
      setError("Error cargando rutas");
    } finally {
      setLoading(false);
    }
  };

  const [search, setSearch] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [formData, setFormData] = useState({
    nombreRuta: "",
    zona: "",
    tiempoEstimado: "",
    distancia: "",
    descripcion: "",
    origen: "",
    domiciliario: "",
    vehiculo: "",
    horaInicio: "",
    horaFin: "",
    observaciones: "",
    paradas: [emptyStop()],
  });

  // ===== FILTRO + PAGINACIÓN =====
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredRoutes = routes.filter((r) => {
    const term = search.toLowerCase();
    return (
      r.nombre.toLowerCase().includes(term) ||
      r.zona.toLowerCase().includes(term) ||
      (r.domiciliario || "").toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRoutes.length / itemsPerPage),
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoutes = filteredRoutes.slice(
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

  // ===== HELPERS FORM =====
  const buildFormFromRoute = (route) => ({
    nombreRuta: route.nombre,
    zona: route.zona,
    tiempoEstimado: route.tiempoMin.toString(),
    distancia: route.distanciaKm.toString(),
    descripcion: route.descripcion,
    origen: route.origen || "",
    domiciliario: route.domiciliario || "",
    vehiculo: route.vehiculo || "",
    horaInicio: route.horaInicio || "",
    horaFin: route.horaFin || "",
    observaciones: route.observaciones || "",
    paradas:
      route.paradas && route.paradas.length
        ? route.paradas.map((p) => ({
            nombre: p.nombre,
            direccion: p.direccion,
          }))
        : [emptyStop()],
  });

  const resetForm = () => {
    setFormData({
      nombreRuta: "",
      zona: "",
      tiempoEstimado: "",
      distancia: "",
      descripcion: "",
      domiciliario: "",
      vehiculo: "",
      horaInicio: "",
      horaFin: "",
      observaciones: "",
      paradas: [emptyStop()],
    });
  };

  const openForm = (route = null) => {
    setIsReadOnly(false);
    if (route) {
      setEditingId(route.id);
      setFormData(buildFormFromRoute(route));
    } else {
      setEditingId(null);
      resetForm();
    }
    setIsFormOpen(true);
  };

  const openView = (route) => {
    setIsReadOnly(true);
    setEditingId(route.id);
    setFormData(buildFormFromRoute(route));
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsReadOnly(false);
    setEditingId(null);
  };

  const validateForm = () => {
    if (!formData.nombreRuta.trim()) {
      alert("El nombre de la ruta es obligatorio");
      return false;
    }
    if (!formData.zona.trim()) {
      alert("La zona asignada es obligatoria");
      return false;
    }
    if (!formData.descripcion.trim()) {
      alert("La descripción es obligatoria");
      return false;
    }

    const tiempo = Number(formData.tiempoEstimado);
    if (formData.tiempoEstimado !== "" && (isNaN(tiempo) || tiempo < 0)) {
      alert("El tiempo estimado debe ser un número mayor o igual a 0");
      return false;
    }

    const distancia = Number(formData.distancia);
    if (formData.distancia !== "" && (isNaN(distancia) || distancia < 0)) {
      alert("La distancia debe ser un número mayor o igual a 0");
      return false;
    }

    const paradasValidas = formData.paradas.filter(
      (p) => p.nombre.trim() && p.direccion.trim(),
    );
    if (paradasValidas.length === 0) {
      alert("Debe registrar al menos una tienda en el orden de visita");
      return false;
    }

    return true;
  };

  const saveRoute = () => {
    if (isReadOnly) return;
    if (!validateForm()) return;

    const tiempoMin = Number(formData.tiempoEstimado) || 0;
    const distanciaKm = Number(formData.distancia) || 0;
    const paradasValidas = formData.paradas
      .filter((p) => p.nombre.trim())
      .map((p) => ({
        nombre: p.nombre.trim(),
        direccion: p.direccion.trim(),
      }));

    const payload = {
      nombre_ruta: formData.nombreRuta,
      origen: formData.origen || undefined,
      destino: formData.zona || undefined,
      tiempo_min: tiempoMin,
      distancia_km: distanciaKm,
      descripcion: formData.descripcion,
      domiciliario: formData.domiciliario || undefined,
      vehiculo: formData.vehiculo || undefined,
      hora_inicio: formData.horaInicio || undefined,
      hora_fin: formData.horaFin || undefined,
      observaciones: formData.observaciones || "",
      paradas: paradasValidas,
      estado: formData.estado
        ? String(formData.estado).toLowerCase()
        : "activa",
    };

    (async () => {
      setSaving(true);
      try {
        if (editingId) {
          await rutasService.update(editingId, payload);
        } else {
          await rutasService.create(payload);
        }
        await fetchRoutes();
        closeForm();
      } catch (err) {
        console.error(err);
        alert("Error guardando ruta");
      } finally {
        setSaving(false);
      }
    })();
  };

  const deleteRoute = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta ruta?")) return;
    setSaving(true);
    try {
      await rutasService.delete(id);
      await fetchRoutes();
    } catch (err) {
      console.error(err);
      alert("Error eliminando ruta");
    } finally {
      setSaving(false);
    }
  };

  const toggleEstado = (id) => {
    (async () => {
      setSaving(true);
      try {
        const r = routes.find((x) => x.id === id);
        const next = r && r.estado === "Activa" ? "inactiva" : "activa";
        await rutasService.toggleEstado(id, next);
        await fetchRoutes();
      } catch (err) {
        console.error(err);
        alert("Error cambiando estado");
      } finally {
        setSaving(false);
      }
    })();
  };

  const estadoClasses = (estado) =>
    estado === "Activa"
      ? "bg-green-600 text-black hover:bg-green-500"
      : "bg-red-600 text-black hover:bg-red-500";

  // ===== ORDEN DE VISITA (PARADAS) =====
  const addParada = () => {
    setFormData((prev) => ({
      ...prev,
      paradas: [...prev.paradas, emptyStop()],
    }));
  };

  const removeParada = (index) => {
    setFormData((prev) => {
      const next = prev.paradas.filter((_, i) => i !== index);
      return { ...prev, paradas: next.length ? next : [emptyStop()] };
    });
  };

  const updateParada = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      paradas: prev.paradas.map((p, i) =>
        i === index ? { ...p, [field]: value } : p,
      ),
    }));
  };

  const moveParada = (index, direction) => {
    setFormData((prev) => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= prev.paradas.length) return prev;
      const arr = [...prev.paradas];
      const temp = arr[index];
      arr[index] = arr[newIndex];
      arr[newIndex] = temp;
      return { ...prev, paradas: arr };
    });
  };

  // ===== RENDER =====
  return (
    <div className="">
      {/* ENCABEZADO + BOTÓN */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-wide">
            Gestión de Rutas
          </h2>
          <p className="text-neutral-400 text-sm">
            Administra rutas de entrega y optimiza la logística.
          </p>
        </div>

        <button
          onClick={() => openForm()}
          className="mt-3 md:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-5 py-3 rounded-xl shadow-md transition"
        >
          <FiPlus />
          Nueva ruta
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-neutral-900/70 border border-neutral-700 rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex items-center bg-neutral-800/70 border border-neutral-600 rounded-xl px-4 py-3 shadow-md">
          <FiSearch className="text-neutral-400 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Buscar rutas (nombre, zona, domiciliario)..."
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
              <th className="p-3 font-semibold">Ruta</th>
              <th className="p-3 font-semibold">Origen</th>
              <th className="p-3 font-semibold">Destino</th>
              <th className="p-3 font-semibold">Cliente</th>
              <th className="p-3 font-semibold">Fecha</th>
              <th className="p-3 font-semibold">Estado</th>
              <th className="p-3 font-semibold text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-sm text-neutral-200">
            {paginatedRoutes.map((r) => {
              return (
                <tr
                  key={r.id}
                  className="border-t border-neutral-700 hover:bg-neutral-800/50 transition"
                >
                  <td className="p-3">
                    <div className="font-semibold">{r.nombre}</div>
                    <div className="text-xs text-neutral-400">
                      {r.tiempoMin} min · {r.distanciaKm.toFixed(1)} km
                    </div>
                  </td>
                  <td className="p-3">{r.origen || "—"}</td>
                  <td className="p-3">{r.zona || "—"}</td>
                  <td className="p-3">
                    <div className="font-medium">{r.clienteNombre || "—"}</div>
                    <div className="text-xs text-neutral-400">
                      {r.clienteTelefono || ""}
                    </div>
                  </td>
                  <td className="p-3">{r.fechaCreacionStr || "—"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleEstado(r.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow cursor-pointer transition ${estadoClasses(
                        r.estado,
                      )}`}
                    >
                      {r.estado}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      <button
                        className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg shadow text-white"
                        onClick={() => openView(r)}
                      >
                        <FiEye className="text-lg" />
                      </button>

                      <button
                        className="bg-green-600 hover:bg-green-500 text-black p-2 rounded-lg shadow"
                        onClick={() => openForm(r)}
                      >
                        <FiEdit2 className="text-lg" />
                      </button>

                      <button
                        className="bg-red-600 hover:bg-red-500 text-black p-2 rounded-lg shadow"
                        onClick={() => deleteRoute(r.id)}
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {paginatedRoutes.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-neutral-400">
                  No se encontraron rutas.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINACIÓN */}
        <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 border-t border-neutral-800 gap-3 text-sm text-neutral-300">
          <span>
            Mostrando{" "}
            {filteredRoutes.length === 0
              ? "0"
              : `${startIndex + 1}–${Math.min(
                  startIndex + itemsPerPage,
                  filteredRoutes.length,
                )}`}{" "}
            de {filteredRoutes.length} rutas
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
          <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-white">
              {isReadOnly
                ? "Detalle de Ruta"
                : editingId
                  ? "Editar Ruta"
                  : "Registrar Nueva Ruta"}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isReadOnly) {
                  closeForm();
                  return;
                }
                saveRoute();
              }}
              className="space-y-6 text-neutral-200"
            >
              {/* INFORMACIÓN DE LA RUTA */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-200 mb-2 flex items-center gap-2">
                  <span className="text-green-500">▮</span>
                  Información de la Ruta
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-neutral-300">
                      Nombre de la Ruta <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Ruta Norte Mañana"
                      className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                        isReadOnly
                          ? "opacity-70 cursor-not-allowed"
                          : "focus:border-green-500"
                      }`}
                      value={formData.nombreRuta}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nombreRuta: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-neutral-300">
                      Zona Asignada <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Zona Centro"
                      className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                        isReadOnly
                          ? "opacity-70 cursor-not-allowed"
                          : "focus:border-green-500"
                      }`}
                      value={formData.zona}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          zona: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-neutral-300">
                      Tiempo Estimado (minutos)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                        isReadOnly
                          ? "opacity-70 cursor-not-allowed"
                          : "focus:border-green-500"
                      }`}
                      value={formData.tiempoEstimado}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tiempoEstimado: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-neutral-300">
                      Distancia Total (km)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="0"
                      className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                        isReadOnly
                          ? "opacity-70 cursor-not-allowed"
                          : "focus:border-green-500"
                      }`}
                      value={formData.distancia}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          distancia: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-1">
                  <label className="text-sm font-medium text-neutral-300">
                    Descripción <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Descripción de la ruta y objetivos..."
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

              {/* ASIGNACIÓN DE RECURSOS */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-200 mb-2 flex items-center gap-2">
                  <span className="text-green-500">▮</span>
                  Asignación de Recursos
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1 md:col-span-1">
                    <label className="text-sm font-medium text-neutral-300">
                      Domiciliario Asignado
                    </label>
                    <input
                      type="text"
                      placeholder="Sin asignar"
                      className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                        isReadOnly
                          ? "opacity-70 cursor-not-allowed"
                          : "focus:border-green-500"
                      }`}
                      value={formData.domiciliario}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          domiciliario: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1 md:col-span-1">
                    <label className="text-sm font-medium text-neutral-300">
                      Vehículo Asignado
                    </label>
                    <input
                      type="text"
                      placeholder="Sin asignar"
                      className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                        isReadOnly
                          ? "opacity-70 cursor-not-allowed"
                          : "focus:border-green-500"
                      }`}
                      value={formData.vehiculo}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehiculo: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1 md:col-span-1">
                    <label className="text-sm font-medium text-neutral-300">
                      Hora de Inicio
                    </label>
                    <input
                      type="time"
                      className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                        isReadOnly
                          ? "opacity-70 cursor-not-allowed"
                          : "focus:border-green-500"
                      }`}
                      value={formData.horaInicio}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          horaInicio: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1 md:col-span-1">
                    <label className="text-sm font-medium text-neutral-300">
                      Hora de Finalización
                    </label>
                    <input
                      type="time"
                      className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none ${
                        isReadOnly
                          ? "opacity-70 cursor-not-allowed"
                          : "focus:border-green-500"
                      }`}
                      value={formData.horaFin}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          horaFin: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* ORDEN DE VISITA */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-200 mb-2 flex items-center gap-2">
                  <span className="text-green-500">▮</span>
                  Orden de Visita –{" "}
                  {formData.zona
                    ? `${formData.zona} (${formData.paradas.length} tiendas)`
                    : `${formData.paradas.length} tiendas`}
                </h4>

                <div className="bg-neutral-800/70 border border-neutral-700 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-neutral-200">
                        <FiMapPin className="text-green-400" />
                        Secuencia de Entregas
                      </div>
                      <p className="text-xs text-neutral-400">
                        Organiza el orden de visita de las tiendas para
                        optimizar la ruta.
                      </p>
                    </div>

                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={addParada}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black text-sm font-semibold px-3 py-2 rounded-lg"
                      >
                        <FiPlus className="text-sm" />
                        Agregar tienda
                      </button>
                    )}
                  </div>

                  {/* LISTA DE TIENDAS */}
                  <div className="space-y-3">
                    {formData.paradas.map((p, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-neutral-900/70 border border-neutral-700 rounded-xl p-3"
                      >
                        {/* Numero */}
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-black text-sm font-bold">
                          {index + 1}
                        </div>

                        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-xs text-neutral-400">
                              Nombre de la tienda
                            </label>
                            <input
                              type="text"
                              placeholder="Nombre de la tienda"
                              className={`w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-200 outline-none ${
                                isReadOnly
                                  ? "opacity-70 cursor-not-allowed"
                                  : "focus:border-green-500"
                              }`}
                              value={p.nombre}
                              disabled={isReadOnly}
                              onChange={(e) =>
                                updateParada(index, "nombre", e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs text-neutral-400">
                              Dirección
                            </label>
                            <input
                              type="text"
                              placeholder="Dirección completa"
                              className={`w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-200 outline-none ${
                                isReadOnly
                                  ? "opacity-70 cursor-not-allowed"
                                  : "focus:border-green-500"
                              }`}
                              value={p.direccion}
                              disabled={isReadOnly}
                              onChange={(e) =>
                                updateParada(index, "direccion", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        {/* BOTONES ORDEN / BORRAR */}
                        {!isReadOnly && (
                          <div className="flex flex-row md:flex-col gap-2">
                            <button
                              type="button"
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700"
                              onClick={() => moveParada(index, -1)}
                            >
                              <FiArrowUp className="text-xs" />
                            </button>
                            <button
                              type="button"
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700"
                              onClick={() => moveParada(index, 1)}
                            >
                              <FiArrowDown className="text-xs" />
                            </button>
                            <button
                              type="button"
                              className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-black"
                              onClick={() => removeParada(index)}
                            >
                              <FiTrash2 className="text-xs" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
                  placeholder="Observaciones especiales sobre la ruta, horarios, restricciones..."
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
                      {editingId ? "Guardar cambios" : "Crear Ruta"}
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
