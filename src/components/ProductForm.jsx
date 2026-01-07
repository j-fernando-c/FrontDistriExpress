import React, { useState } from "react";

export default function ProductForm({ onSubmit, onCancel }) {

  const [data, setData] = useState({
    name: "",
    category: "",
    content: "",
    price: ""
  });

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();

    if (!data.name || !data.category || !data.price) {
      alert("Los campos con * son obligatorios");
      return;
    }

    onSubmit({
      name: data.name,
      category: data.category,
      content: data.content,
      price: parseFloat(data.price),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">

      <h2 className="text-xl font-bold mb-2">Registrar Producto</h2>

      <div>
        <label className="text-sm">Nombre del Producto *</label>
        <input
          name="name"
          onChange={handleChange}
          value={data.name}
          className="w-full p-2 mt-1 bg-neutral-700 rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Categoría *</label>
          <input
            name="category"
            onChange={handleChange}
            value={data.category}
            className="w-full p-2 mt-1 bg-neutral-700 rounded"
          />
        </div>

        <div>
          <label className="text-sm">Contenido</label>
          <input
            name="content"
            onChange={handleChange}
            value={data.content}
            className="w-full p-2 mt-1 bg-neutral-700 rounded"
          />
        </div>
      </div>

      <div>
        <label className="text-sm">Precio *</label>
        <input
          name="price"
          type="number"
          step="0.01"
          onChange={handleChange}
          value={data.price}
          className="w-full p-2 mt-1 bg-neutral-700 rounded"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-neutral-600 rounded hover:bg-neutral-500"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
        >
          Registrar
        </button>
      </div>

    </form>
  );
}
