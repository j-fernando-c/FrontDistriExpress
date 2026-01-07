// src/pages/Users.jsx
import { useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

export default function Users() {
  const [users, setUsers] = useState([
    {
      id: 1,
      fullName: "Juan Pérez",
      email: "juan@empresa.com",
      role: "Admin",
      estado: "Protegido", // <-- admin comienza protegido
      password: "123456",
    },
    {
      id: 2,
      fullName: "María González",
      email: "maria@empresa.com",
      role: "Vendedor",
      estado: "Activo",
      password: "123456",
    },
    {
      id: 3,
      fullName: "Carlos López",
      email: "carlos@empresa.com",
      role: "Empleado",
      estado: "Inactivo",
      password: "123456",
    },
  ]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    fullName: "",
    email: "",
    password: "",
    role: "",
    estado: "Activo",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
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
      fullName: user.fullName,
      email: user.email,
      password: user.password || "",
      role: user.role,
      estado: user.estado,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openView = (user) => {
    setIsViewMode(true);
    setEditingId(user.id);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: user.password || "",
      role: user.role,
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    if (!editingId || !formData.password.trim()) {
      // Si es usuario nuevo, SIEMPRE; si es edición, solo si lo deja vacío
      if (!formData.password.trim()) {
        newErrors.password = "La contraseña es obligatoria";
      }
    }

    if (!formData.role) {
      newErrors.role = "El rol es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isViewMode) return; // por seguridad

    if (!validate()) return;

    const data = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      role: formData.role,
      estado: formData.estado,
    };

    // Forzar protección si el rol es Admin
    if (data.role === "Admin") {
      data.estado = "Protegido";
    }

    if (editingId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingId
            ? {
                ...u,
                ...data,
                // si ya era admin, seguir protegido
                estado:
                  u.role === "Admin" || data.role === "Admin"
                    ? "Protegido"
                    : data.estado,
              }
            : u
        )
      );
    } else {
      const newId = users.length
        ? Math.max(...users.map((u) => u.id)) + 1
        : 1;
      setUsers((prev) => [
        ...prev,
        {
          id: newId,
          ...data,
          estado: data.role === "Admin" ? "Protegido" : data.estado,
        },
      ]);
    }

    closeModal();
  };

  const deleteUser = (id) => {
    const user = users.find((u) => u.id === id);
    if (user && user.role === "Admin") {
      alert("El usuario administrador está protegido y no se puede eliminar.");
      return;
    }

    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const toggleEstado = (id) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        if (u.role === "Admin") {
          // Admin no cambia de estado
          return { ...u, estado: "Protegido" };
        }
        return {
          ...u,
          estado: u.estado === "Activo" ? "Inactivo" : "Activo",
        };
      })
    );
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
            {paginatedUsers.map((user) => {
              const isAdmin = user.role === "Admin";
              const isProtegido = isAdmin || user.estado === "Protegido";

              return (
                <tr
                  key={user.id}
                  className="border-t border-neutral-700 hover:bg-neutral-800/50 transition"
                >
                  <td className="p-3">{user.fullName}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">
                    {isProtegido ? (
                      <span className="px-4 py-1.5 rounded-full text-sm font-semibold shadow bg-neutral-500 text-black cursor-not-allowed">
                        Protegido
                      </span>
                    ) : (
                      <button
                        onClick={() => toggleEstado(user.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow cursor-pointer transition
                      ${
                        user.estado === "Activo"
                          ? "bg-green-600 text-black hover:bg-green-500"
                          : "bg-red-600 text-black hover:bg-red-500"
                      }`}
                      >
                        {user.estado}
                      </button>
                    )}
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
                        onClick={() =>
                          !isAdmin && deleteUser(user.id)
                        }
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
                <td
                  colSpan={5}
                  className="p-4 text-center text-neutral-400"
                >
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
                  filteredUsers.length
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
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Nombre Completo{" "}
                    <span className="text-red-500">*</span>
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
                    <p className="text-xs text-red-400 mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Contraseña */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300">
                    Contraseña{" "}
                    <span className="text-red-500">*</span>
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
                    name="role"
                    className={`${inputBase} ${
                      errors.role ? "border-red-500" : ""
                    } ${isViewMode ? disabledInput : ""}`}
                    value={formData.role}
                    onChange={handleChange}
                    disabled={isViewMode}
                  >
                    <option value="">Seleccionar rol...</option>
                    <option value="Admin">Admin</option>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Repartidor">Repartidor</option>
                    <option value="Gerente">Gerente</option>
                  </select>
                  {errors.role && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.role}
                    </p>
                  )}
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
                    value={formData.role === "Admin" ? "Protegido" : formData.estado}
                    onChange={handleChange}
                    disabled={isViewMode || formData.role === "Admin"}
                  >
                    {/* Para admin mostramos Protegido fijo */}
                    {formData.role === "Admin" ? (
                      <option value="Protegido">Protegido</option>
                    ) : (
                      <>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </>
                    )}
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
                    className="px-5 py-2 bg-green-600 hover:bg-green-500 text-black font-semibold rounded-xl transition"
                  >
                    {editingId ? "Guardar cambios" : "Registrar usuario"}
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
