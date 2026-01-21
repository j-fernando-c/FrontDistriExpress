import React from 'react';

/**
 * Select.jsx - Componente de selector desplegable
 * 
 * Componente que proporciona un selector con:
 * - Props: name, label, options, value, onChange, error, placeholder, required
 * - Visualización de mensajes de error
 * - Etiqueta con indicador de requerido
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} props.name - Nombre del campo
 * @param {string} [props.label] - Etiqueta del campo
 * @param {Array} props.options - Array de opciones ({value, label})
 * @param {string|number} [props.value] - Valor seleccionado
 * @param {Function} props.onChange - Callback al cambiar el valor
 * @param {string} [props.error] - Mensaje de error
 * @param {string} [props.placeholder] - Placeholder del campo
 * @param {boolean} [props.required] - Si el campo es requerido
 * @param {string} [props.className] - Clases CSS adicionales
 * @returns {JSX.Element} Selector renderizado
 */
const Select = ({
  name,
  label,
  options = [],
  value,
  onChange,
  error,
  placeholder,
  required = false,
  className = '',
  disabled = false,
}) => {
  const selectClasses = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all appearance-none ${
    error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
  } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={selectClasses}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
