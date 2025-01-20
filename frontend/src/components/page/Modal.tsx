import React from 'react';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({
  title, isOpen, onClose, children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-1/3 rounded-lg shadow-lg p-6 relative">
        {/* Botón para cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          type="button"
        >
          &times;
        </button>

        {/* Título */}
        <h2 className="text-2xl font-semibold mb-4 text-center">{title}</h2>

        {/* Contenido */}
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
