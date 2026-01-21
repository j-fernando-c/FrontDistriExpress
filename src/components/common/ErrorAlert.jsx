import React, { useEffect } from 'react';

/**
 * ErrorAlert.jsx - Componente de alerta de error
 * 
 * Componente que proporciona una alerta de error con:
 * - Props: message, onClose
 * - Caja de alerta roja
 * - Botón de cierre
 * - Icono
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} props.message - Mensaje de error a mostrar
 * @param {Function} [props.onClose] - Callback al cerrar la alerta
 * @param {number} [props.autoClose] - Tiempo en ms para cerrar automáticamente (0 = no cierra)
 * @param {string} [props.className] - Clases CSS adicionales
 * @returns {JSX.Element} Alerta renderizada
 */
const ErrorAlert = ({ message, onClose, autoClose = 5000, className = '' }) => {
  useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  if (!message) return null;

  return (
    <div
      className={`flex items-center gap-3 p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-800 ${className}`}
      role="alert"
    >
      {/* Icono */}
      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>

      {/* Mensaje */}
      <div className="flex-1">
        <p className="font-medium">{message}</p>
      </div>

      {/* Botón de cierre */}
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-600 hover:text-red-800 transition-colors ml-2"
          aria-label="Close alert"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;
