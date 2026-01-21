import React from 'react';

/**
 * Button.jsx - Componente de botón reutilizable
 * 
 * Componente que proporciona un botón con:
 * - Props: children, variant, size, disabled, loading, onClick
 * - Estados de carga con spinner
 * - Diferentes estilos según variante
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {string} [props.variant='primary'] - Variante (primary, secondary, success, danger)
 * @param {string} [props.size='md'] - Tamaño (sm, md, lg)
 * @param {boolean} [props.disabled] - Si el botón está deshabilitado
 * @param {boolean} [props.loading] - Si el botón está en estado de carga
 * @param {Function} [props.onClick] - Callback al hacer clic
 * @param {string} [props.className] - Clases CSS adicionales
 * @returns {JSX.Element} Botón renderizado
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
}) => {
  const baseClasses =
    'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-400',
    secondary: 'bg-gray-300 text-gray-800 hover:bg-gray-400 focus:ring-gray-400 disabled:bg-gray-200',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-gray-400',
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
