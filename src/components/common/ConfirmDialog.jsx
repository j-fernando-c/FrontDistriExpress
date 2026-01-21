import React from 'react';
import Modal from './Modal';
import Button from './Button';

/**
 * ConfirmDialog.jsx - Componente de diálogo de confirmación
 * 
 * Componente que proporciona un diálogo de confirmación con:
 * - Props: isOpen, onClose, onConfirm, title, message
 * - Botones de cancelar y confirmar
 * - Usa el componente Modal
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Si el diálogo está abierto
 * @param {Function} props.onClose - Callback al cancelar o cerrar
 * @param {Function} props.onConfirm - Callback al confirmar
 * @param {string} [props.title] - Título del diálogo
 * @param {string} [props.message] - Mensaje del diálogo
 * @param {string} [props.confirmText] - Texto del botón de confirmación
 * @param {string} [props.cancelText] - Texto del botón de cancelación
 * @param {boolean} [props.loading] - Si está en estado de carga
 * @returns {JSX.Element} Diálogo de confirmación renderizado
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message = '¿Deseas continuar con esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        {/* Mensaje */}
        <p className="text-gray-600">{message}</p>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
