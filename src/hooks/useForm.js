/**
 * Hook personalizado para manejo de formularios
 * 
 * Proporciona funcionalidad para formularios:
 * - Manejo de estado de campos
 * - Validación de campos
 * - Manejo de errores
 * - Reset de formulario
 */

import { useState } from 'react';
import { validateForm } from '../utils/validators';

/**
 * Hook para manejo de formularios
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Object} validationRules - Reglas de validación
 * @param {Function} onSubmit - Función a ejecutar al enviar
 * @returns {Object} Estado y funciones del formulario
 */
export const useForm = (initialValues = {}, validationRules = {}, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Maneja el cambio de un campo
   */
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Limpiar error del campo al modificarlo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  /**
   * Maneja el blur de un campo
   */
  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validar el campo al perder foco
    if (validationRules[name]) {
      const fieldErrors = validateForm(values, { [name]: validationRules[name] });
      if (fieldErrors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: fieldErrors[name],
        }));
      }
    }
  };

  /**
   * Establece el valor de un campo manualmente
   */
  const setFieldValue = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Establece el error de un campo manualmente
   */
  const setFieldError = (name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  /**
   * Establece múltiples valores
   */
  const setFieldsValue = (newValues) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  };

  /**
   * Valida todos los campos
   */
  const validate = () => {
    const formErrors = validateForm(values, validationRules);
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

    // Marcar todos los campos como touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validar formulario
    const isValid = validate();

    if (isValid && onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Error al enviar formulario:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  /**
   * Reinicia el formulario
   */
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  /**
   * Verifica si un campo tiene error y ha sido touched
   */
  const hasError = (name) => {
    return touched[name] && errors[name];
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldsValue,
    reset,
    hasError,
  };
};

export default useForm;
