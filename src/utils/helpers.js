/**
 * Funciones auxiliares de la aplicación
 * 
 * Conjunto de funciones de utilidad para:
 * - Formateo de datos
 * - Manejo de fechas
 * - Cálculos
 * - Transformaciones
 */

/**
 * Formatea un número como moneda colombiana
 * @param {number} value - Valor a formatear
 * @returns {string} Valor formateado como moneda
 */
export const formatCurrency = (value) => {
  if (!value && value !== 0) return '$0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
};

/**
 * Formatea una fecha en formato legible
 * @param {string|Date} date - Fecha a formatear
 * @param {boolean} includeTime - Si incluye hora
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  if (includeTime) {
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  
  return `${day}/${month}/${year}`;
};

/**
 * Formatea un número de teléfono
 * @param {string} phone - Número de teléfono
 * @returns {string} Teléfono formateado
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Calcula el total de una lista de items
 * @param {Array} items - Lista de items con precio y cantidad
 * @returns {number} Total calculado
 */
export const calculateTotal = (items) => {
  if (!items || items.length === 0) return 0;
  return items.reduce((total, item) => {
    const precio = parseFloat(item.precio) || 0;
    const cantidad = parseFloat(item.cantidad) || 0;
    return total + (precio * cantidad);
  }, 0);
};

/**
 * Calcula el IVA de un monto
 * @param {number} amount - Monto base
 * @param {number} percentage - Porcentaje de IVA (por defecto 19%)
 * @returns {number} Valor del IVA
 */
export const calculateTax = (amount, percentage = 19) => {
  if (!amount) return 0;
  return (amount * percentage) / 100;
};

/**
 * Genera un color aleatorio para avatares
 * @param {string} str - Cadena base para generar el color
 * @returns {string} Color en formato hexadecimal
 */
export const generateColorFromString = (str) => {
  if (!str) return '#1890ff';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor(Math.abs((Math.sin(hash) * 16777215) % 1) * 16777215);
  return '#' + color.toString(16).padStart(6, '0');
};

/**
 * Obtiene las iniciales de un nombre
 * @param {string} name - Nombre completo
 * @returns {string} Iniciales
 */
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Trunca un texto a un número de caracteres
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Debounce de una función
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función con debounce
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Valida si un objeto está vacío
 * @param {Object} obj - Objeto a validar
 * @returns {boolean} True si está vacío
 */
export const isEmpty = (obj) => {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
};

/**
 * Ordena un array por una propiedad
 * @param {Array} array - Array a ordenar
 * @param {string} key - Propiedad por la cual ordenar
 * @param {string} order - Orden ('asc' o 'desc')
 * @returns {Array} Array ordenado
 */
export const sortByKey = (array, key, order = 'asc') => {
  if (!array || array.length === 0) return [];
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Descarga un archivo desde una URL
 * @param {string} url - URL del archivo
 * @param {string} filename - Nombre del archivo
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise} Promesa de la operación
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    return false;
  }
};
