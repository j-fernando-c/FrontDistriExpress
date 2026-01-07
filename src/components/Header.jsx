import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded ${isActive ? "bg-green-600" : "hover:bg-neutral-700"}`;

  return (
    <header className="bg-neutral-800 p-4 shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold">📦 Gestión</div>
          <nav className="flex items-center gap-2">
            <NavLink to="/productos" className={linkClass}>Productos</NavLink>
            <NavLink to="/ventas" className={linkClass}>Ventas</NavLink>
            <NavLink to="/compras" className={linkClass}>Compras</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
