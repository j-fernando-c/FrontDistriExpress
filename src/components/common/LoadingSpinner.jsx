import React from 'react';

/**
 * LoadingSpinner.jsx - Componente de spinner de carga
 * 
 * Componente que proporciona un indicador de carga con:
 * - Props: size (sm, md, lg), color
 * - Animación de spinner centrada
 * - Diferentes tamaños y colores
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.size='md'] - Tamaño (sm, md, lg)
 * @param {string} [props.color='blue'] - Color (blue, green, red, gray)
 * @param {string} [props.className] - Clases CSS adicionales
 * @returns {JSX.Element} Spinner renderizado
 */
const LoadingSpinner = ({ size = 'md', color = 'blue', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const colorClasses = {
    blue: 'border-blue-200 border-t-blue-600',
    green: 'border-green-200 border-t-green-600',
    red: 'border-red-200 border-t-red-600',
    gray: 'border-gray-200 border-t-gray-600',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-4 rounded-full animate-spin`}
      />
    </div>
  );
};

export default LoadingSpinner;
