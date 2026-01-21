/**
 * Contexto de Autenticación
 * 
 * Maneja el estado global de autenticación:
 * - Estado del usuario autenticado
 * - Token de autenticación
 * - Funciones de login y logout
 * - Verificación de permisos
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getProfile } from '../api/usuariosService';

const AuthContext = createContext();

/**
 * Hook para usar el contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de autenticación
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay sesión activa al montar el componente
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Verifica si hay una sesión activa
   */
  const checkAuth = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        
        // Verificar que el token sea válido
        try {
          const profile = await getProfile();
          setUser(profile);
        } catch (error) {
          // Token inválido, limpiar sesión
          await logout();
        }
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inicia sesión de usuario
   */
  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      const { token, usuario } = response;

      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));

      // Actualizar estado
      setToken(token);
      setUser(usuario);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al iniciar sesión'
      };
    }
  };

  /**
   * Cierra sesión de usuario
   */
  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar estado y localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Actualiza los datos del usuario
   */
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  const hasPermission = (permission) => {
    if (!user || !user.permisos) return false;
    return user.permisos.includes(permission);
  };

  /**
   * Verifica si el usuario tiene un rol específico
   */
  const hasRole = (role) => {
    if (!user || !user.rol) return false;
    return user.rol === role;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
