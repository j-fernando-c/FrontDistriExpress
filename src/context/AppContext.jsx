/**
 * Contexto de la Aplicación
 * 
 * Maneja el estado global de la aplicación:
 * - Configuración del sidebar
 * - Notificaciones
 * - Tema
 * - Estado de carga global
 */

import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

/**
 * Hook para usar el contexto de la aplicación
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de la aplicación
 */
export const AppProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(false);

  /**
   * Alterna la visibilidad del sidebar
   */
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  /**
   * Abre el sidebar
   */
  const openSidebar = () => {
    setSidebarOpen(true);
  };

  /**
   * Cierra el sidebar
   */
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  /**
   * Agrega una notificación
   */
  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      type: 'info',
      duration: 3000,
      ...notification,
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remover notificación
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  /**
   * Remueve una notificación
   */
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  /**
   * Muestra notificación de éxito
   */
  const showSuccess = (message) => {
    addNotification({
      type: 'success',
      message,
    });
  };

  /**
   * Muestra notificación de error
   */
  const showError = (message) => {
    addNotification({
      type: 'error',
      message,
    });
  };

  /**
   * Muestra notificación de advertencia
   */
  const showWarning = (message) => {
    addNotification({
      type: 'warning',
      message,
    });
  };

  /**
   * Muestra notificación de información
   */
  const showInfo = (message) => {
    addNotification({
      type: 'info',
      message,
    });
  };

  /**
   * Limpia todas las notificaciones
   */
  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    sidebarOpen,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearNotifications,
    globalLoading,
    setGlobalLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
