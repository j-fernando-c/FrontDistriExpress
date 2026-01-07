import { useState } from "react";
import ModalAddProduct from "../components/ModalAddProduct";

export default function ProductModule() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Gestión de Productos</h1>

      {/* Botón para abrir el modal */}
      <button
        onClick={() => setOpenModal(true)}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold shadow-lg transition"
      >
        + Agregar Producto
      </button>

      {/* Modal */}
      {openModal && (
        <ModalAddProduct onClose={() => setOpenModal(false)} />
      )}
    </div>
  );
}
