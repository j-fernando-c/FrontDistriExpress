import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiUser,
  FiUserCheck,
  FiKey,
  FiBox,
  FiShoppingCart,
  FiTrendingUp,
  FiMap,
  FiTruck,
  FiLayers,
  FiPackage,
  FiFileText,
  FiRepeat,
  FiLogOut,
} from "react-icons/fi";

export default function Sidebar() {
  const navigate = useNavigate();
  const linkBase =
    "flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-colors";
  const inactive = "text-neutral-300 hover:bg-neutral-800 hover:text-white";
  const active = "bg-green-600 text-black";

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col min-h-screen">
      {/* LOGO */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-800">
        <span className="text-2xl mr-2">🏬</span>
        <div className="flex flex-col">
          <span className="font-semibold text-white text-lg">
            Sistema de Gestión
          </span>
          <span className="text-xs text-neutral-400">Panel administrativo</span>
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="flex-1 px-3 pt-4 space-y-1 text-sm">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <FiHome />
          <span>Dashboard</span>
        </NavLink>

        {/* Accesos */}
        {/* <NavLink to="/accesos" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
          <FiKey />
          <span>Accesos</span>
        </NavLink> */}

        {/* Roles */}
        <NavLink
          to="/roles"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <FiUserCheck />
          <span>Roles</span>
        </NavLink>

        {/* Usuarios */}
        <NavLink
          to="/usuarios"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <FiUsers />
          <span>Usuarios</span>
        </NavLink>

        {/* Compras */}
        <NavLink
          to="/compras"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <FiShoppingCart />
          <span>Compras</span>
        </NavLink>

        {/* Proveedores */}
        <NavLink
          to="/proveedores"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <FiPackage />
          <span>Proveedores</span>
        </NavLink>

        {/* Ventas */}
        <NavLink
          to="/ventas"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <FiTrendingUp />
          <span>Ventas</span>
        </NavLink>

        {/* Clientes */}
        <NavLink
          to="/clientes"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <FiUser />
          <span>Clientes</span>
        </NavLink>

        {/* Pedidos */}
        <NavLink
          to="/pedidos"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <FiFileText />
          <span>Pedidos</span>
        </NavLink>

        {/* Categorías */}
        <NavLink
          to="/categorias"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <FiLayers />
          <span>Categorías</span>
        </NavLink>

        {/* Productos */}
        <NavLink
          to="/productos"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <FiBox />
          <span>Productos</span>
        </NavLink>

        {/* Entradas y Salidas */}
        <NavLink
          to="/entradas-salidas"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <FiRepeat />
          <span>Entradas y Salidas</span>
        </NavLink>

        {/* Zonas */}
        <NavLink
          to="/zonas"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <FiMap />
          <span>Zonas</span>
        </NavLink>

        {/* Rutas */}
        <NavLink
          to="/rutas"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <FiTruck />
          <span>Rutas</span>
        </NavLink>
      </nav>

      {/* BOTÓN CERRAR SESIÓN */}
      <div className="px-3 pb-4">
        <button
          onClick={() => navigate("/accesos")}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-black font-semibold py-2.5 rounded-xl shadow-md transition"
        >
          <FiLogOut className="text-lg" />
          <span>Cerrar sesión</span>
        </button>
      </div>

      {/* PIE */}
      <div className="px-4 py-3 border-t border-neutral-800 text-xs text-neutral-500">
        © {new Date().getFullYear()} · Gestión
      </div>
    </aside>
  );
}
