/**
 * Hook personalizado para manejo de estados booleanos
 * 
 * Proporciona funcionalidad para alternar estados:
 * - Toggle de estado
 * - Set a true
 * - Set a false
 */

import { useState, useCallback } from 'react';

/**
 * Hook para manejo de estados booleanos
 * @param {boolean} initialValue - Valor inicial
 * @returns {Array} [estado, toggle, setTrue, setFalse]
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  /**
   * Alterna el estado
   */
  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  /**
   * Establece el estado a true
   */
  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  /**
   * Establece el estado a false
   */
  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setTrue, setFalse];
};

export default useToggle;
