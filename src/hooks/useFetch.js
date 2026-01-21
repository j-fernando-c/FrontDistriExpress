/**
 * Hook personalizado para fetch de datos
 * 
 * Proporciona funcionalidad para obtener datos automáticamente:
 * - Carga automática al montar el componente
 * - Manejo de estados de carga y error
 * - Función de refetch
 */

import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MESSAGES } from '../utils/constants';

/**
 * Hook para fetch automático de datos
 * @param {Function} fetchFunction - Función para obtener datos
 * @param {Object} options - Opciones del hook
 * @returns {Object} Estado y funciones del fetch
 */
export const useFetch = (fetchFunction, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError } = useApp();

  const {
    autoFetch = true,
    showErrorMessage = true,
    dependencies = [],
    onSuccess,
    onError,
  } = options;

  /**
   * Obtiene los datos
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchFunction();
      setData(response);

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || MESSAGES.ERROR.GENERIC;
      setError(errorMessage);

      if (showErrorMessage) {
        showError(errorMessage);
      }

      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refetch de datos
   */
  const refetch = () => {
    fetchData();
  };

  // Auto-fetch al montar o cambiar dependencias
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

export default useFetch;
