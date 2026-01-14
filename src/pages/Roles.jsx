// src/pages/Roles.jsx
import { useState, useEffect } from "react";
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiLock,
} from "react-icons/fi";
import { rolesService } from "../services/rolesService";

const MODULE_PERMISSIONS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "roles", label: "Roles" },
  { id: "access", label: "Accesos" },
  { id: "users", label: "Usuarios" },
  { id: "categories", label: "Categorías" },
  { id: "products", label: "Productos" },
  { id: "purchases", label: "Compras" },
  { id: "sales", label: "Ventas" },
  { id: "clients", label: "Clientes" },
  { id: "orders", label: "Pedidos" },
  { id: "providers", label: "Proveedores" },
  { id: "credits", label: "Créditos" },
  { id: "zones", label: "Zonas" },
  { id: "routes", label: "Rutas" },
  { id: "schedule", label: "Cronograma" },
  { id: "losses", label: "Pérdidas" },
];

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await rolesService.getAll();
      const rolesData = (response.data || []).map((r) => ({
        id: r.id,
        nombre: r.nombre_rol,
        descripcion: r.descripcion,
        permisos: [],
        estado: r.estado === "ACTIVO" ? "Activo" : "Inactivo",
      }));
      setRoles(rolesData);
    } catch (err) {
      setError(err.message || "Error al cargar roles");
      console.error("Error cargando roles:", err);
    } finally {
      setLoading(false);
    }
  };

  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    permisos: [],
    estado: "Activo",
  });

  // ====== PAGINACIÓN ======
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredRoles = roles.filter(
    (r) =>
      r.nombre.toLowerCase().includes(search.toLowerCase()) ||
      r.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRoles.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoles = filteredRoles.slice(
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

  // ====== MODAL / FORM ======
  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      permisos: [],
      estado: "Activo",
    });
  };

  const openCreateForm = () => {
    setIsViewMode(false);
    setEditingId(null);
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (role) => {
    setIsViewMode(false);
    setEditingId(role.id);
    setFormData({
      nombre: role.nombre,
      descripcion: role.descripcion,
      permisos: role.permisos || [],
      estado: role.estado || "Activo",
    });
    setIsFormOpen(true);
  };

  const openViewForm = (role) => {
    setIsViewMode(true);
    setEditingId(role.id);
    setFormData({
      nombre: role.nombre,
      descripcion: role.descripcion,
      permisos: role.permisos || [],
      estado: role.estado || "Activo",
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const togglePermission = (permId) => {
    if (isViewMode) return; // no cambiar en modo lectura
    setFormData((prev) => {
      const already = prev.permisos.includes(permId);
      return {
        ...prev,
        permisos: already
          ? prev.permisos.filter((p) => p !== permId)
          : [...prev.permisos, permId],
      };
    });
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      alert("El nombre del rol es obligatorio");
      return false;
    }
    if (!formData.descripcion.trim()) {
      alert("La descripción del rol es obligatoria");
      return false;
    }
    if (!formData.permisos.length) {
      alert("Debes seleccionar al menos un permiso para el rol");
      return false;
    }
    return true;
  };

  const saveRole = async () => {
    if (isViewMode) return;
    if (!validateForm()) return;

    const data = {
      nombre_rol: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      permisos: formData.permisos,
    };

    try {
      if (editingId) {
        await rolesService.update(editingId, data);
      } else {
        await rolesService.create(data);
      }
      await loadRoles();
      setIsFormOpen(false);
    } catch (err) {
      alert(err.message || "Error al guardar rol");
    }
  };

  const deleteRole = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este rol?")) return;
    try {
      await rolesService.delete(id);
      setRoles((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.message || "Error al eliminar rol");
    }
  };

  const toggleEstado = async (id) => {
    try {
      await rolesService.toggleEstado(id);
      setRoles((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, estado: r.estado === "Activo" ? "Inactivo" : "Activo" }
            : r
        )
      );
    } catch (err) {
      alert(err.message || "Error al cambiar estado");
    }
  };

  const isPermChecked = (id) => formData.permisos.includes(id);

  const isReadOnly = isViewMode;

  // ====== RENDER ======
  return (
    <div>
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-wide flex items-center gap-2">
            <FiLock />
            Gestión de Roles
          </h2>
          <p className="text-neutral-400 text-sm">
            Administra roles de usuario y sus permisos.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="mt-3 md:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-5 py-3 rounded-xl shadow-md transition"
        >
          <FiPlus />
          Registrar Rol
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-neutral-900/70 border border-neutral-700 rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex items-center bg-neutral-800/70 border border-neutral-600 rounded-xl px-4 py-3 shadow-md">
          <FiSearch className="text-neutral-400 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Buscar roles por nombre o descripción..."
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
              <th className="p-3 font-semibold">Rol</th>
              <th className="p-3 font-semibold">Descripción</th>
              <th className="p-3 font-semibold text-center">Permisos</th>
              <th className="p-3 font-semibold text-center">Estado</th>
              <th className="p-3 font-semibold text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-sm text-neutral-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-neutral-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                    Cargando roles...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-red-400">
                  {error}
                  <button
                    onClick={loadRoles}
                    className="ml-2 text-green-400 hover:underline"
                  >
                    Reintentar
                  </button>
                </td>
              </tr>
            ) : paginatedRoles.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-neutral-400">
                  No se encontraron roles.
                </td>
              </tr>
            ) : (
              paginatedRoles.map((role) => (
                <tr
                  key={role.id}
                  className="border-t border-neutral-700 hover:bg-neutral-800/50 transition"
                >
                  <td className="p-3 font-semibold">{role.nombre}</td>
                  <td className="p-3 text-neutral-300">
                    {role.descripcion || "—"}
                  </td>
                  <td className="p-3 text-center">
                    {role.permisos?.length || 0} permisos
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleEstado(role.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow cursor-pointer transition ${
                        role.estado === "Activo"
                          ? "bg-green-600 text-black hover:bg-green-500"
                          : "bg-red-600 text-black hover:bg-red-500"
                      }`}
                    >
                      {role.estado}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      <button
                        className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg shadow text-white"
                        onClick={() => openViewForm(role)}
                      >
                        <FiEye className="text-lg" />
                      </button>

                      <button
                        className="bg-green-600 hover:bg-green-500 text-black p-2 rounded-lg shadow"
                        onClick={() => openEditForm(role)}
                      >
                        <FiEdit2 className="text-lg" />
                      </button>

                      <button
                        className="bg-red-600 hover:bg-red-500 text-black p-2 rounded-lg shadow"
                        onClick={() => deleteRole(role.id)}
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
            {filteredRoles.length === 0
              ? "0"
              : `${startIndex + 1}–${Math.min(
                  startIndex + itemsPerPage,
                  filteredRoles.length
                )}`}{" "}
            de {filteredRoles.length} roles
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
            <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
              <FiLock />
              {isViewMode
                ? "Detalle del Rol"
                : editingId
                ? "Editar Rol"
                : "Registrar Nuevo Rol"}
            </h3>

            {/* INFORMACIÓN DEL ROL */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-300">
                  Nombre del Rol <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500 disabled:opacity-60"
                  value={formData.nombre}
                  disabled={isReadOnly}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      nombre: e.target.value,
                    }))
                  }
                  placeholder="Ej: Administrador, Supervisor..."
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-300">
                  Estado
                </label>
                <select
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500 disabled:opacity-60"
                  value={formData.estado}
                  disabled={isReadOnly}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      estado: e.target.value,
                    }))
                  }
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-neutral-300">
                Descripción del Rol <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                className="w-full mt-1 p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500 disabled:opacity-60"
                value={formData.descripcion}
                disabled={isReadOnly}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    descripcion: e.target.value,
                  }))
                }
                placeholder="Describe brevemente las responsabilidades y alcance de este rol..."
              />
            </div>

            {/* PERMISOS */}
            <div className="mb-2">
              <h4 className="text-neutral-200 font-semibold mb-2 flex items-center gap-2">
                Permisos del Rol <span className="text-red-500">*</span>
              </h4>
              <p className="text-xs text-neutral-400 mb-3">
                Selecciona los módulos a los que este rol tendrá acceso.
              </p>

              <div className="bg-neutral-800/70 border border-neutral-700 rounded-2xl p-4 grid md:grid-cols-2 gap-3">
                {MODULE_PERMISSIONS.map((perm) => (
                  <label
                    key={perm.id}
                    className="flex items-start gap-2 text-sm text-neutral-200 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 accent-green-500"
                      checked={isPermChecked(perm.id)}
                      disabled={isReadOnly}
                      onChange={() => togglePermission(perm.id)}
                    />
                    <span>{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-5 py-2 bg-neutral-700 text-neutral-200 hover:bg-neutral-600 rounded-xl transition"
                onClick={closeForm}
              >
                {isViewMode ? "Cerrar" : "Cancelar"}
              </button>

              {!isViewMode && (
                <button
                  className="px-5 py-2 bg-green-600 hover:bg-green-500 text-black font-semibold rounded-xl transition"
                  onClick={saveRole}
                >
                  {editingId ? "Actualizar Rol" : "Registrar Rol"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
