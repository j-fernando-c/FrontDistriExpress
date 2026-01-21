import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Modal.jsx - Componente de diálogo modal
 * 
 * Componente que proporciona un modal con:
 * - Props: isOpen, onClose, title, children, size
 * - Cierre al hacer clic en el backdrop
 * - Botón de cierre
 * - Portal para renderización
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {string} [props.title] - Título del modal
 * @param {React.ReactNode} props.children - Contenido del modal
 * @param {string} [props.size='md'] - Tamaño del modal (sm, md, lg)
 * @returns {JSX.Element|null} Modal renderizado o null
 */
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  // Prevenir scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-11/12 max-h-[90vh] overflow-y-auto z-50`}
      >
        {/* Encabezado */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Contenido */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
