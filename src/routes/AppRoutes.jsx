// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// Páginas principales
import Products from "../pages/Products";
import Sales from "../pages/Sales";
import Purchases from "../pages/Purchases";
import Credits from "../pages/Credits";
import Zones from "../pages/Zones";
import Rutas from "../pages/Rutas";
import Pedidos from "../pages/Pedidos";
import Cronograma from "../pages/Cronograma";
import Categories from "../pages/Categories";
import Providers from "../pages/Providers";
import Clients from "../pages/Clients";
import Users from "../pages/Users";
import Roles from "../pages/Roles";
import Access from "../pages/Access";
import Dashboard from "../pages/Dashboard";

// ✅ NUEVO
import EntradasSalidas from "../pages/EntradasSalidas";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Productos */}
      <Route path="/productos" element={<Products />} />

      {/* Ventas */}
      <Route path="/ventas" element={<Sales />} />

      {/* Compras */}
      <Route path="/compras" element={<Purchases />} />

      {/* Pedidos */}
      <Route path="/pedidos" element={<Pedidos />} />

      {/* Clientes */}
      <Route path="/clientes" element={<Clients />} />

      {/* Proveedores */}
      <Route path="/proveedores" element={<Providers />} />

      {/* ✅ Entradas y Salidas */}
      <Route path="/entradas-salidas" element={<EntradasSalidas />} />

      {/* Categorías de productos */}
      <Route path="/categorias" element={<Categories />} />

      {/* Zonas */}
      <Route path="/zonas" element={<Zones />} />

      {/* Rutas */}
      <Route path="/rutas" element={<Rutas />} />

      {/* Usuarios */}
      <Route path="/usuarios" element={<Users />} />

      <Route path="/Roles" element={<Roles />} />

      <Route path="/accesos" element={<Access />} />

      <Route path="/dashboard" element={<Dashboard />} />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/productos" replace />} />
    </Routes>
  );
}
