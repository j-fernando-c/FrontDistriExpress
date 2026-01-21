/**
 * Hook personalizado para manejo de APIs
 * 
 * Proporciona funcionalidad para llamadas a APIs con:
 * - Manejo de estados de carga y error
 * - Gestión automática de respuestas
 * - Integración con notificaciones
 */

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MESSAGES } from '../utils/constants';

/**
 * Hook para manejo de llamadas a API
 * @param {Function} apiFunction - Función de servicio API
 * @param {Object} options - Opciones del hook
 * @returns {Object} Estado y funciones del API
 */
export const useApi = (apiFunction, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useApp();

  const {
    showSuccessMessage = false,
    showErrorMessage = true,
    successMessage = MESSAGES.SUCCESS.CREATE,
    onSuccess,
    onError,
  } = options;

  /**
   * Ejecuta la llamada a la API
   */
  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFunction(...args);
      setData(response);

      if (showSuccessMessage) {
        showSuccess(successMessage);
      }

      if (onSuccess) {
        onSuccess(response);
      }

      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.response?.data?.message || MESSAGES.ERROR.GENERIC;
      setError(errorMessage);

      if (showErrorMessage) {
        showError(errorMessage);
      }

      if (onError) {
        onError(err);
      }

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reinicia el estado del hook
   */
  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

export default useApi;
