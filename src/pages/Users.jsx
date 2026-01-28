// src/pages/Users.jsx
import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

import { usuariosService } from "../services/usuariosService";
import { rolesService } from "../services/rolesService";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([fetchUsers(), loadRoles()]);
    } catch (err) {
      setError(err.message || "Error al cargar datos");
      console.error("Error cargando datos iniciales:", err);
    } finally {
      setLoading(false);
    }
  };

  const emptyForm = {
    tipo_documento: "",
    documento: "",
    fullName: "",
    email: "",
    password: "",
    role: "",
    roleId: "",
    telefono: "",
    direccion: "",
    estado: "activo",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredUsers = users.filter(
    (u) =>
      (u.fullName || u.nombre || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()),
  );

  const loadRoles = async () => {
    try {
      const response = await rolesService.getAll();
      setRoles(response.data || []);
    } catch (err) {
      console.error("Error cargando roles:", err);
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / itemsPerPage),
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const mapBackendToFrontend = (u) => ({
    id: u.id ?? u._id,
    tipo_documento: u.tipo_documento ?? "",
    documento: u.documento ?? "",
    fullName: u.nombre ?? u.fullName ?? "",
    email: u.email ?? "",
    role: u.rol_nombre ?? u.rol?.name ?? u.role ?? "",
    roleId: u.rol_id ?? "",
    telefono: u.telefono ?? "",
    direccion: u.direccion ?? "",
    // normalize backend estado to only Active/Inactive (capitalize for UI)
    estado:
      typeof u.estado === "string" && u.estado.toLowerCase() === "activo"
        ? "activo"
        : "inactivo",
    // never expose password from backend
    password: "",
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usuariosService.getAll();
      const list = data?.data ?? data ?? [];
      const mapped = Array.isArray(list) ? list.map(mapBackendToFrontend) : [];
      setUsers(mapped);
    } catch (err) {
      console.error(err);
      setError("Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  // roles state is initialized above; loadRoles will populate it

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // ===== Modal helpers =====
  const openCreate = () => {
    setIsViewMode(false);
    setEditingId(null);
    setFormData(emptyForm);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEdit = (user) => {
    setIsViewMode(false);
    setEditingId(user.id);
    setFormData({
      tipo_documento: user.tipo_documento ?? user.tipo_documento ?? "",
      documento: user.documento ?? "",
      fullName: user.fullName,
      email: user.email,
      password: user.password || "",
      role: user.role,
      roleId: user.roleId || user.roleId || user.roleId,
      telefono: user.telefono ?? "",
      direccion: user.direccion ?? "",
      estado: user.estado,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openView = (user) => {
    setIsViewMode(true);
    setEditingId(user.id);
    setFormData({
      tipo_documento: user.tipo_documento ?? "",
      documento: user.documento ?? "",
      fullName: user.fullName,
      email: user.email,
      password: user.password || "",
      role: user.role,
      roleId: user.roleId ?? "",
      telefono: user.telefono ?? "",
      direccion: user.direccion ?? "",
      estado: user.estado,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsViewMode(false);
    setEditingId(null);
    setErrors({});
  };

  // ===== Form =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "roleId") {
      const selected = roles.find((r) => r.id === value);
      setFormData((prev) => ({
        ...prev,
        roleId: value,
        role: selected ? selected.nombre_rol || selected.nombre : "",
      }));
      return;
    }

    if (name === "estado") {
      // keep estado lowercase in state (activo/inactivo)
      setFormData((prev) => ({ ...prev, [name]: String(value).toLowerCase() }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre es obligatorio";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = "El email no es válido";
    }

    // Contraseña: para creación es obligatoria y debe tener al menos 6 caracteres
    if (!editingId) {
      if (!formData.password.trim()) {
        newErrors.password = "La contraseña es obligatoria";
      } else if (formData.password.trim().length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      }
    } else if (formData.password && formData.password.trim().length > 0) {
      if (formData.password.trim().length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      }
    }

    if (!formData.roleId) {
      newErrors.role = "El rol es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return; // por seguridad

    if (!validate()) return;

    setSaving(true);
    try {
      const data = {
        tipo_documento: formData.tipo_documento || undefined,
        documento: formData.documento || undefined,
        nombre: formData.fullName.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono || undefined,
        direccion: formData.direccion || undefined,
        rol_id: formData.roleId,
        estado: formData.estado || "activo",
      };

      // incluir contraseña solo si existe
      if (formData.password && formData.password.trim()) {
        data.contrasena = formData.password.trim();
      }

      // Admin remains protected from toggles/deletes in UI; send estado as lowercase
      if (data.estado) data.estado = data.estado.toLowerCase();

      if (editingId) {
        await usuariosService.update(editingId, data);
      } else {
        // backend requires contrasena for create
        if (!data.contrasena) {
          throw new Error("La contraseña es obligatoria para crear usuario");
        }
        await usuariosService.create(data);
      }

      await fetchUsers();
      closeModal();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Error al guardar usuario");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (id) => {
    const user = users.find((u) => u.id === id);
    if (user && user.role === "Admin") {
      alert("El usuario administrador está protegido y no se puede eliminar.");
      return;
    }

    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await usuariosService.delete(id);
      await fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error eliminando usuario");
    }
  };

  const toggleEstado = async (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    if (
      (user.role || "").toLowerCase() === "administrador" ||
      user.role === "Admin"
    )
      return;

    const newEstado =
      user.estado === "activo" || (user.estado || "").toLowerCase() === "activo"
        ? "inactivo"
        : "activo";
    try {
      // send lowercase to backend (ej. 'activo'/'inactivo')
      await usuariosService.toggleEstado(id, newEstado.toLowerCase());
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, estado: newEstado } : u)),
      );
    } catch (err) {
      console.error(err);
      alert("Error cambiando estado");
    }
  };

  const inputBase =
    "w-full mt-1 p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 outline-none focus:border-green-500";
  const disabledInput = "opacity-70 cursor-not-allowed";

  return (
    <div className="p-6">
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-wide">
            Gestión de Usuarios
          </h2>
          <p className="text-neutral-400 text-sm">
            Administra los usuarios, roles y accesos del sistema.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="mt-3 md:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-5 py-3 rounded-xl shadow-md transition"
        >
          <FiPlus />
          Registrar usuario
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-neutral-900/70 border border-neutral-700 rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex items-center bg-neutral-800/70 border border-neutral-600 rounded-xl px-4 py-3 shadow-md">
          <FiSearch className="text-neutral-400 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Buscar usuarios por nombre o correo..."
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
              <th className="p-3 font-semibold">Usuario</th>
              <th className="p-3 font-semibold">Email</th>
              <th className="p-3 font-semibold">Rol</th>
              <th className="p-3 font-semibold">Estado</th>
              <th className="p-3 font-semibold text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-sm text-neutral-200">
            {loading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-neutral-400">
                  {error ? error : "Cargando usuarios..."}
                </td>
              </tr>
            )}
            {paginatedUsers.map((user) => {
              const isAdmin =
                (user.role || "").toLowerCase() === "administrador" ||
                (user.role || "") === "Admin";

              const estadoIsactivo =
                (user.estado || "").toLowerCase() === "activo" ||
                (user.estado || "") === "activo";

              return (
                <tr
                  key={user.id}
                  className="border-t border-neutral-700 hover:bg-neutral-800/50 transition"
                >
                  <td className="p-3">{user.fullName || user.nombre}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">
                    <button
                      onClick={() => !isAdmin && toggleEstado(user.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow ${isAdmin ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:scale-[1.01] transition"} ${
                        estadoIsactivo
                          ? "bg-green-600 text-black hover:bg-green-500"
                          : "bg-red-600 text-black hover:bg-red-500"
                      }`}
                      disabled={isAdmin}
                    >
                      {user.estado}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      <button
                        className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg shadow text-white"
                        onClick={() => openView(user)}
                      >
                        <FiEye className="text-lg" />
                      </button>

                      <button
                        className="bg-green-600 hover:bg-green-500 text-black p-2 rounded-lg shadow"
                        onClick={() => openEdit(user)}
                      >
                        <FiEdit2 className="text-lg" />
                      </button>

                      <button
                        className={`p-2 rounded-lg shadow text-black ${
                          isAdmin
                            ? "bg-neutral-700 cursor-not-allowed opacity-60"
                            : "bg-red-600 hover:bg-red-500"
                        }`}
                        onClick={() => !isAdmin && deleteUser(user.id)}
                        disabled={isAdmin}
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-neutral-400">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINACIÓN */}
        <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 border-t border-neutral-800 gap-3 text-sm text-neutral-300">
          <span>
            Mostrando{" "}
            {filteredUsers.length === 0
              ? "0"
              : `${startIndex + 1}–${Math.min(
                  startIndex + itemsPerPage,
                  filteredUsers.length,
                )}`}{" "}
            de {filteredUsers.length} usuarios
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto text-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                {isViewMode
                  ? "Ver Usuario"
                  : editingId
                    ? "Editar Usuario"
                    : "Registrar Nuevo Usuario"}
              </h3>
              <button
                onClick={closeModal}
                className="text-neutral-400 hover:text-neutral-200"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Tipo documento */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Tipo Documento
                  </label>
                  <input
                    type="text"
                    name="tipo_documento"
                    className={`${inputBase} ${isViewMode ? disabledInput : ""}`}
                    placeholder="CC, NIT, etc."
                    value={formData.tipo_documento}
                    onChange={handleChange}
                    disabled={isViewMode}
                  />
                </div>

                {/* Documento */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Documento
                  </label>
                  <input
                    type="text"
                    name="documento"
                    className={`${inputBase} ${isViewMode ? disabledInput : ""}`}
                    placeholder="Número de documento"
                    value={formData.documento}
                    onChange={handleChange}
                    disabled={isViewMode}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className={`${inputBase} ${
                      errors.fullName ? "border-red-500" : ""
                    } ${isViewMode ? disabledInput : ""}`}
                    placeholder="Nombre del usuario"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isViewMode}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`${inputBase} ${
                      errors.email ? "border-red-500" : ""
                    } ${isViewMode ? disabledInput : ""}`}
                    placeholder="correo@empresa.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isViewMode}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Contraseña */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    className={`${inputBase} ${
                      errors.password ? "border-red-500" : ""
                    } ${isViewMode ? disabledInput : ""}`}
                    placeholder="Contraseña del usuario"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isViewMode}
                  />
                  {errors.password && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Rol */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Rol <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="roleId"
                    className={`${inputBase} ${errors.role ? "border-red-500" : ""} ${isViewMode ? disabledInput : ""}`}
                    value={formData.roleId}
                    onChange={handleChange}
                    disabled={isViewMode}
                  >
                    <option value="">Seleccionar rol...</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre_rol ?? r.nombre ?? r.nombreRol ?? r.nombreRol}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="text-xs text-red-400 mt-1">{errors.role}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Telefono */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    className={`${inputBase} ${isViewMode ? disabledInput : ""}`}
                    placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    disabled={isViewMode}
                  />
                </div>

                {/* Direccion */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    className={`${inputBase} ${isViewMode ? disabledInput : ""}`}
                    placeholder="Dirección"
                    value={formData.direccion}
                    onChange={handleChange}
                    disabled={isViewMode}
                  />
                </div>
              </div>

              {/* Estado */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Estado
                  </label>
                  <select
                    name="estado"
                    className={`${inputBase} ${
                      isViewMode ? disabledInput : ""
                    }`}
                    value={formData.estado}
                    onChange={handleChange}
                    disabled={
                      isViewMode ||
                      (formData.role || "").toLowerCase() === "administrador" ||
                      formData.role === "Admin"
                    }
                  >
                    <>
                      <option value="activo">activo</option>
                      <option value="inactivo">inactivo</option>
                    </>
                  </select>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-5 py-2 bg-neutral-700 text-neutral-200 hover:bg-neutral-600 rounded-xl transition"
                  onClick={closeModal}
                >
                  {isViewMode ? "Cerrar" : "Cancelar"}
                </button>

                {!isViewMode && (
                  <button
                    type="submit"
                    className="px-5 py-2 bg-green-600 hover:bg-green-500 text-black font-semibold rounded-xl transition disabled:opacity-50"
                    disabled={saving}
                  >
                    {saving
                      ? "Guardando..."
                      : editingId
                        ? "Guardar cambios"
                        : "Registrar usuario"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
