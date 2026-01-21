import React from 'react';

/**
 * Card.jsx - Componente contenedor de tarjeta
 * 
 * Componente que proporciona una tarjeta con:
 * - Props: title, children, actions
 * - Encabezado con título y acciones
 * - Cuerpo con el contenido
 * - Sombra y esquinas redondeadas
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.title] - Título de la tarjeta
 * @param {React.ReactNode} props.children - Contenido de la tarjeta
 * @param {Array} [props.actions] - Array de acciones ({label, onClick, variant?})
 * @param {string} [props.className] - Clases CSS adicionales
 * @returns {JSX.Element} Tarjeta renderizada
 */
const Card = ({ title, children, actions = [], className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Encabezado */}
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {actions && actions.length > 0 && (
            <div className="flex gap-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`text-sm font-medium px-3 py-1 rounded-md transition-colors ${
                    action.variant === 'danger'
                      ? 'text-red-600 hover:bg-red-50'
                      : action.variant === 'success'
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cuerpo */}
      <div className="px-6 py-4">
        {children}
      </div>
    </div>
  );
};

export default Card;
