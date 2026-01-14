// src/pages/Cronograma.jsx
import { useState, useEffect } from "react";
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import { cronogramasService } from "../services/cronogramasService";

export default function Cronograma() {
  // ====== DATOS INICIALES ======
  const [cronogramas, setCronogramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Búsqueda
  const [search, setSearch] = useState("");

  // Modal formulario
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Modal ver detalle
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Formulario
  const emptyForm = {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    responsible: "",
    priority: "Alta",
    category: "",
    location: "",
    status: "Pendiente",
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    loadCronogramas();
  }, []);

  const loadCronogramas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cronogramasService.getAll();
      const cronosData = (response.data || []).map((c) => ({
        id: c.id,
        title: c.nombre || "Sin título",
        description: c.descripcion || "",
        startDate: c.fecha_inicio ? c.fecha_inicio.split("T")[0] : "",
        endDate: c.fecha_fin ? c.fecha_fin.split("T")[0] : "",
        startTime: "",
        endTime: "",
        responsible: "",
        priority: "Alta",
        category: "",
        location: "",
        status: "Pendiente",
      }));
      setCronogramas(cronosData);
    } catch (err) {
      setError(err.message || "Error al cargar cronogramas");
      console.error("Error cargando cronogramas:", err);
    } finally {
      setLoading(false);
    }
  };

  // ====== FILTRO + PAGINACIÓN ======
  const filteredCronos = cronogramas.filter((item) => {
    const text = (
      item.title +
      " " +
      item.responsible +
      " " +
      item.category
    ).toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCronos.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCronos = filteredCronos.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // ====== PRIORIDAD CLICABLE ======
  const togglePriority = (id) => {
    setCronogramas((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        let nextPriority;
        switch (item.priority) {
          case "Alta":
            nextPriority = "Media";
            break;
          case "Media":
            nextPriority = "Baja";
            break;
          default:
            nextPriority = "Alta";
        }

        return { ...item, priority: nextPriority };
      })
    );
  };

  // ====== MODALES ======
  const openForm = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        description: item.description,
        startDate: item.startDate,
        endDate: item.endDate,
        startTime: item.startTime,
        endTime: item.endTime,
        responsible: item.responsible,
        priority: item.priority,
        category: item.category,
        location: item.location,
        status: item.status,
      });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const openView = (item) => {
    setViewItem(item);
    setIsViewOpen(true);
  };

  const closeView = () => {
    setIsViewOpen(false);
    setViewItem(null);
  };

  // ====== VALIDACIONES Y GUARDADO ======
  const validateForm = () => {
    if (!formData.title.trim()) {
      alert("El título es obligatorio");
      return false;
    }
    if (!formData.description.trim()) {
      alert("La descripción es obligatoria");
      return false;
    }
    if (!formData.startDate) {
      alert("La fecha de inicio es obligatoria");
      return false;
    }
    if (!formData.endDate) {
      alert("La fecha de fin es obligatoria");
      return false;
    }
    if (!formData.startTime) {
      alert("La hora de inicio es obligatoria");
      return false;
    }
    if (!formData.endTime) {
      alert("La hora de fin es obligatoria");
      return false;
    }
    if (!formData.responsible.trim()) {
      alert("El responsable es obligatorio");
      return false;
    }
    if (!formData.category.trim()) {
      alert("La categoría es obligatoria");
      return false;
    }

    if (formData.endDate < formData.startDate) {
      alert("La fecha de fin no puede ser anterior a la fecha de inicio");
      return false;
    }

    return true;
  };

  const saveCronograma = async () => {
    if (!validateForm()) return;

    const data = {
      nombre: formData.title.trim(),
      descripcion: formData.description.trim(),
      fecha_inicio: formData.startDate,
      fecha_fin: formData.endDate,
      observaciones: formData.observaciones || "",
    };

    try {
      if (editingId) {
        await cronogramasService.update(editingId, data);
      } else {
        await cronogramasService.create(data);
      }
      await loadCronogramas();
      setIsFormOpen(false);
    } catch (err) {
      alert(err.message || "Error al guardar cronograma");
    }
  };

  const deleteCronograma = async (id) => {
    if (!confirm("¿Eliminar este cronograma?")) return;
    try {
      await cronogramasService.delete(id);
      setCronogramas((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message || "Error al eliminar cronograma");
    }
  };

  // ====== RENDER ======
  return (
    <div className="p-6">
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-wide">
            Gestión de Cronograma
          </h2>
          <p className="text-neutral-400 text-sm">
            Planifica y organiza actividades y eventos.
          </p>
        </div>

        <button
          onClick={() => openForm()}
          className="mt-3 md:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-5 py-3 rounded-xl shadow-md transition"
        >
          <FiPlus />
          Registrar cronograma
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-neutral-900/70 border border-neutral-700 rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex items-center bg-neutral-800/70 border border-neutral-600 rounded-xl px-4 py-3 shadow-md">
          <FiSearch className="text-neutral-400 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Buscar cronogramas por título, responsable o categoría..."
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
              <th className="p-3 font-semibold">Cronograma</th>
              <th className="p-3 font-semibold">Fechas</th>
              <th className="p-3 font-semibold">Horario</th>
              <th className="p-3 font-semibold">Responsable</th>
              <th className="p-3 font-semibold">Categoría</th>
              <th className="p-3 font-semibold">Prioridad</th>
              <th className="p-3 font-semibold">Estado</th>
              <th className="p-3 font-semibold text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-sm text-neutral-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-neutral-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                    Cargando cronogramas...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-red-400">
                  {error}
                  <button
                    onClick={loadCronogramas}
                    className="ml-2 text-green-400 hover:underline"
                  >
                    Reintentar
                  </button>
                </td>
              </tr>
            ) : paginatedCronos.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-neutral-400">
                  No se encontraron cronogramas.
                </td>
              </tr>
            ) : (
              paginatedCronos.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-neutral-700 hover:bg-neutral-800/50 transition"
                >
                  {/* Título + ubicación */}
                  <td className="p-3">
                    <div className="font-semibold">{c.title}</div>
                    {c.location && (
                      <div className="text-xs text-neutral-400">
                        {c.location}
                      </div>
                    )}
                  </td>

                  {/* Fechas */}
                  <td className="p-3 text-xs">
                    <div>{c.startDate}</div>
                    <div className="text-neutral-400">
                      {c.endDate !== c.startDate && `→ ${c.endDate}`}
                    </div>
                  </td>

                  {/* Horario */}
                  <td className="p-3 text-xs">
                    {c.startTime} - {c.endTime}
                  </td>

                  {/* Responsable */}
                  <td className="p-3">{c.responsible}</td>

                  {/* Categoría */}
                  <td className="p-3">{c.category}</td>

                  {/* PRIORIDAD CLICABLE */}
                  <td className="p-3">
                    <button
                      onClick={() => togglePriority(c.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow cursor-pointer border
                        ${
                          c.priority === "Alta"
                            ? "bg-red-600 text-white border-red-700"
                            : c.priority === "Media"
                            ? "bg-yellow-500 text-black border-yellow-600"
                            : "bg-green-600 text-black border-green-700"
                        }`}
                    >
                      {c.priority}
                    </button>
                  </td>

                  {/* ESTADO */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          c.status === "Completado"
                            ? "bg-green-600 text-black"
                            : c.status === "Pendiente"
                            ? "bg-yellow-500 text-black"
                            : "bg-red-600 text-white"
                        }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  {/* ACCIONES */}
                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      <button
                        className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg shadow text-white"
                        onClick={() => openView(c)}
                      >
                        <FiEye className="text-lg" />
                      </button>

                      <button
                        className="bg-green-600 hover:bg-green-500 text-black p-2 rounded-lg shadow"
                        onClick={() => openForm(c)}
                      >
                        <FiEdit2 className="text-lg" />
                      </button>

                      <button
                        className="bg-red-600 hover:bg-red-500 text-black p-2 rounded-lg shadow"
                        onClick={() => deleteCronograma(c.id)}
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
            {filteredCronos.length === 0
              ? "0"
              : `${startIndex + 1}–${Math.min(
                  startIndex + itemsPerPage,
                  filteredCronos.length
                )}`}{" "}
            de {filteredCronos.length} cronogramas
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
          <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-white">
              {editingId ? "Editar Cronograma" : "Registrar Cronograma"}
            </h3>

            <div className="space-y-5 text-neutral-200">
              {/* Título y descripción */}
              <div>
                <label className="block text-sm font-medium text-neutral-300">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl outline-none focus:border-green-500"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  className="mt-1 w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl outline-none focus:border-green-500"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              {/* Fechas y horas */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Fecha de Inicio{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="mt-1 w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl outline-none focus:border-green-500"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Fecha de Fin{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="mt-1 w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl outline-none focus:border-green-500"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Hora de Inicio{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    className="mt-1 w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl outline-none focus:border-green-500"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startTime: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Hora de Fin{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    className="mt-1 w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl outline-none focus:border-green-500"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        endTime: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Responsable, prioridad, estado */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Responsable{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl outline-none focus:border-green-500"
                    value={formData.responsible}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        responsible: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Prioridad{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="mt-1 w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl outline-none focus:border-green-500"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value,
                      })
                    }
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Estado{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="mt-1 w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl outline-none focus:border-green-500"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Completado">Completado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Categoría y ubicación */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Categoría{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl outline-none focus:border-green-500"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl outline-none focus:border-green-500"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-5 py-2 bg-neutral-700 text-neutral-200 hover:bg-neutral-600 rounded-xl transition"
                onClick={closeForm}
              >
                Cancelar
              </button>

              <button
                className="px-5 py-2 bg-green-600 hover:bg-green-500 text-black font-semibold rounded-xl transition"
                onClick={saveCronograma}
              >
                {editingId ? "Guardar cambios" : "Registrar Cronograma"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VER DETALLE */}
      {isViewOpen && viewItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto text-neutral-200">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Detalle del cronograma
            </h3>

            <div className="space-y-2 text-sm mb-4">
              <p>
                <span className="font-semibold">Título: </span>
                {viewItem.title}
              </p>
              <p>
                <span className="font-semibold">Descripción: </span>
                {viewItem.description}
              </p>
              <p>
                <span className="font-semibold">Fechas: </span>
                {viewItem.startDate} - {viewItem.endDate}
              </p>
              <p>
                <span className="font-semibold">Horario: </span>
                {viewItem.startTime} - {viewItem.endTime}
              </p>
              <p>
                <span className="font-semibold">Responsable: </span>
                {viewItem.responsible}
              </p>
              <p>
                <span className="font-semibold">Categoría: </span>
                {viewItem.category}
              </p>
              <p>
                <span className="font-semibold">Ubicación: </span>
                {viewItem.location || "—"}
              </p>
              <p>
                <span className="font-semibold">Prioridad: </span>
                {viewItem.priority}
              </p>
              <p>
                <span className="font-semibold">Estado: </span>
                {viewItem.status}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                className="px-5 py-2 bg-neutral-700 text-neutral-200 hover:bg-neutral-600 rounded-xl transition"
                onClick={closeView}
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
