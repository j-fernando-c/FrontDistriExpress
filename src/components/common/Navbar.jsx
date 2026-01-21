import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

/**
 * Navbar.jsx - Barra de navegación superior
 * 
 * Componente de navegación principal que incluye:
 * - Logo y nombre de la aplicación
 * - Menú desplegable del perfil de usuario
 * - Botón de cierre de sesión
 * - Botón para alternar la barra lateral (hamburguesa)
 * 
 * @component
 * @returns {JSX.Element} Barra de navegación renderizada
 */
const Navbar = () => {
  const { toggleSidebar } = useApp();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Logo y nombre */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-blue-700 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-white text-blue-600 p-2 rounded-lg font-bold">
              FDE
            </div>
            <span className="text-lg font-bold hidden sm:inline">FrontDistriExpress</span>
          </div>
        </div>

        {/* Perfil de usuario y cierre de sesión */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold">
                  {user.nombre?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline text-sm">{user.nombre || 'Usuario'}</span>
              </button>

              {/* Dropdown de perfil */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b">
                    <p className="font-semibold">{user.nombre || 'Usuario'}</p>
                    <p className="text-xs text-gray-600">{user.email || 'correo@ejemplo.com'}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-red-600 font-semibold"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
