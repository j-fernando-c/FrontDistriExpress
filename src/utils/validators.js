/**
 * Funciones de validación de formularios
 * 
 * Conjunto de funciones para validar datos de entrada:
 * - Validación de campos requeridos
 * - Validación de formatos (email, teléfono, etc.)
 * - Validación de longitudes
 * - Validación de rangos
 */

import { VALIDATION } from './constants';

/**
 * Valida si un campo está vacío
 * @param {any} value - Valor a validar
 * @returns {boolean} True si el campo es válido
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} True si el email es válido
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  return VALIDATION.EMAIL_REGEX.test(email);
};

/**
 * Valida un número de teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} True si el teléfono es válido
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, '');
  return VALIDATION.PHONE_REGEX.test(cleaned);
};

/**
 * Valida un NIT
 * @param {string} nit - NIT a validar
 * @returns {boolean} True si el NIT es válido
 */
export const isValidNIT = (nit) => {
  if (!nit) return false;
  const cleaned = nit.replace(/\D/g, '');
  return VALIDATION.NIT_REGEX.test(cleaned);
};

/**
 * Valida una contraseña
 * @param {string} password - Contraseña a validar
 * @returns {Object} Resultado de la validación con mensaje
 */
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, message: 'La contraseña es requerida' };
  }
  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return {
      valid: false,
      message: `La contraseña debe tener al menos ${VALIDATION.MIN_PASSWORD_LENGTH} caracteres`
    };
  }
  return { valid: true, message: '' };
};

/**
 * Valida que dos contraseñas coincidan
 * @param {string} password - Contraseña
 * @param {string} confirmPassword - Confirmación de contraseña
 * @returns {boolean} True si las contraseñas coinciden
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Valida la longitud mínima de un campo
 * @param {string} value - Valor a validar
 * @param {number} minLength - Longitud mínima
 * @returns {boolean} True si cumple la longitud mínima
 */
export const minLength = (value, minLength) => {
  if (!value) return false;
  return value.length >= minLength;
};

/**
 * Valida la longitud máxima de un campo
 * @param {string} value - Valor a validar
 * @param {number} maxLength - Longitud máxima
 * @returns {boolean} True si cumple la longitud máxima
 */
export const maxLength = (value, maxLength) => {
  if (!value) return true;
  return value.length <= maxLength;
};

/**
 * Valida un número
 * @param {any} value - Valor a validar
 * @returns {boolean} True si es un número válido
 */
export const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Valida un número positivo
 * @param {any} value - Valor a validar
 * @returns {boolean} True si es un número positivo
 */
export const isPositiveNumber = (value) => {
  return isNumber(value) && parseFloat(value) > 0;
};

/**
 * Valida un rango numérico
 * @param {number} value - Valor a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean} True si está en el rango
 */
export const isInRange = (value, min, max) => {
  if (!isNumber(value)) return false;
  const num = parseFloat(value);
  return num >= min && num <= max;
};

/**
 * Valida una fecha
 * @param {string} date - Fecha a validar
 * @returns {boolean} True si es una fecha válida
 */
export const isValidDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

/**
 * Valida que una fecha sea futura
 * @param {string} date - Fecha a validar
 * @returns {boolean} True si la fecha es futura
 */
export const isFutureDate = (date) => {
  if (!isValidDate(date)) return false;
  return new Date(date) > new Date();
};

/**
 * Valida que una fecha sea pasada
 * @param {string} date - Fecha a validar
 * @returns {boolean} True si la fecha es pasada
 */
export const isPastDate = (date) => {
  if (!isValidDate(date)) return false;
  return new Date(date) < new Date();
};

/**
 * Valida un formulario completo
 * @param {Object} data - Datos del formulario
 * @param {Object} rules - Reglas de validación
 * @returns {Object} Errores encontrados
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];
    
    if (rule.required && !isRequired(value)) {
      errors[field] = rule.requiredMessage || `${field} es requerido`;
      return;
    }
    
    if (rule.email && !isValidEmail(value)) {
      errors[field] = rule.emailMessage || 'Email inválido';
      return;
    }
    
    if (rule.phone && !isValidPhone(value)) {
      errors[field] = rule.phoneMessage || 'Teléfono inválido';
      return;
    }
    
    if (rule.minLength && !minLength(value, rule.minLength)) {
      errors[field] = rule.minLengthMessage || `Mínimo ${rule.minLength} caracteres`;
      return;
    }
    
    if (rule.maxLength && !maxLength(value, rule.maxLength)) {
      errors[field] = rule.maxLengthMessage || `Máximo ${rule.maxLength} caracteres`;
      return;
    }
    
    if (rule.number && !isNumber(value)) {
      errors[field] = rule.numberMessage || 'Debe ser un número';
      return;
    }
    
    if (rule.positive && !isPositiveNumber(value)) {
      errors[field] = rule.positiveMessage || 'Debe ser un número positivo';
      return;
    }
    
    if (rule.custom && !rule.custom(value, data)) {
      errors[field] = rule.customMessage || 'Valor inválido';
    }
  });
  
  return errors;
};
