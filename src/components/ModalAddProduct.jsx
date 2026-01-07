import { useState } from "react";

export default function ModalAddProduct({ onClose }) {
  const [form, setForm] = useState({
    nombre: "",
    marca: "",
    cantidad: "",
    precio: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Producto agregado:", form);
    onClose(); 
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      
      <div className="bg-neutral-800 w-full max-w-lg p-6 rounded-xl shadow-xl animate-fade-in">
        
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Agregar Producto
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm mb-1">Nombre del producto</label>
            <input
              type="text"
              name="nombre"
              onChange={handleChange}
              className="w-full bg-neutral-700 p-2 rounded-lg outline-none border border-neutral-600 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Marca</label>
            <input
              type="text"
              name="marca"
              onChange={handleChange}
              className="w-full bg-neutral-700 p-2 rounded-lg outline-none border border-neutral-600 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              onChange={handleChange}
              className="w-full bg-neutral-700 p-2 rounded-lg outline-none border border-neutral-600 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Precio</label>
            <input
              type="number"
              name="precio"
              onChange={handleChange}
              className="w-full bg-neutral-700 p-2 rounded-lg outline-none border border-neutral-600 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-600 hover:bg-neutral-700 rounded-lg transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-md transition"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
