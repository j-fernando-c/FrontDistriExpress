import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLocation, Link } from 'react-router-dom';

/**
 * Sidebar.jsx - Barra lateral de navegación
 * 
 * Componente de navegación lateral que incluye:
 * - Elementos de menú para todos los módulos
 * - Estado activo según la ruta actual
 * - Iconos (emojis)
 * - Colapsable en dispositivos móviles
 * - Usa contexto AppContext para el estado
 * 
 * @component
 * @returns {JSX.Element} Barra lateral renderizada
 */
const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useApp();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Productos', path: '/productos', icon: '📦' },
    { label: 'Clientes', path: '/clientes', icon: '👥' },
    { label: 'Ventas', path: '/ventas', icon: '💰' },
    { label: 'Compras', path: '/compras', icon: '🛒' },
    { label: 'Pedidos', path: '/pedidos', icon: '📋' },
    { label: 'Usuarios', path: '/usuarios', icon: '👤' },
    { label: 'Proveedores', path: '/proveedores', icon: '🏭' },
    { label: 'Roles', path: '/roles', icon: '🔑' },
    { label: 'Permisos', path: '/permisos', icon: '🔐' },
    { label: 'Domiciliarios', path: '/domiciliarios', icon: '🚚' },
    { label: 'Rutas', path: '/rutas', icon: '🗺️' },
    { label: 'Zonas', path: '/zonas', icon: '📍' },
    { label: 'Cronogramas', path: '/cronogramas', icon: '⏰' },
    { label: 'Pérdidas', path: '/perdidas', icon: '📉' },
    { label: 'Categorías', path: '/categorias', icon: '🏷️' },
    { label: 'Estado Venta', path: '/estado-venta', icon: '📊' },
  ];

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700 text-white' : 'text-gray-200 hover:bg-blue-600';
  };

  return (
    <>
      {/* Overlay para dispositivos móviles */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Barra lateral */}
      <div
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl transform transition-transform duration-300 z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:relative lg:w-64 w-64`}
      >
        {/* Encabezado de la barra lateral */}
        <div className="p-6 border-b border-blue-700">
          <h2 className="text-xl font-bold">Menú</h2>
          <button
            onClick={toggleSidebar}
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-blue-700 rounded-lg"
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Elementos del menú */}
        <nav className="mt-6 px-4 space-y-2 overflow-y-auto h-[calc(100vh-120px)]">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                // Cerrar sidebar en dispositivos móviles después de seleccionar
                if (window.innerWidth < 1024) {
                  toggleSidebar();
                }
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(
                item.path
              )}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
