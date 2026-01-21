import React from 'react';

/**
 * Input.jsx - Componente de campo de entrada de texto
 * 
 * Componente que proporciona un campo de entrada con:
 * - Props: name, label, type, value, onChange, error, placeholder, required
 * - Visualización de mensajes de error
 * - Etiqueta con indicador de requerido
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} props.name - Nombre del campo
 * @param {string} [props.label] - Etiqueta del campo
 * @param {string} [props.type='text'] - Tipo de input (text, email, password, number, etc.)
 * @param {string} [props.value] - Valor del campo
 * @param {Function} props.onChange - Callback al cambiar el valor
 * @param {string} [props.error] - Mensaje de error
 * @param {string} [props.placeholder] - Placeholder del campo
 * @param {boolean} [props.required] - Si el campo es requerido
 * @param {string} [props.className] - Clases CSS adicionales
 * @returns {JSX.Element} Campo de entrada renderizado
 */
const Input = ({
  name,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  className = '',
  disabled = false,
}) => {
  const inputClasses = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
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
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={inputClasses}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
