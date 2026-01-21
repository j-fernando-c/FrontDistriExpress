/**
 * Página de Dashboard
 * 
 * Panel principal de la aplicación con:
 * - Estadísticas generales
 * - Gráficos de ventas
 * - Información rápida
 * - Accesos directos
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../utils/helpers';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ventas: { total: 0, hoy: 0 },
    pedidos: { total: 0, pendientes: 0 },
    productos: { total: 0, stockBajo: 0 },
    clientes: { total: 0 },
  });

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setStats({
        ventas: { total: 150, hoy: 12 },
        pedidos: { total: 89, pendientes: 15 },
        productos: { total: 245, stockBajo: 8 },
        clientes: { total: 320 },
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ¡Bienvenido, {user?.nombre || 'Usuario'}!
        </h1>
        <p className="text-gray-600">
          {formatDate(new Date(), true)} - Aquí está el resumen de hoy
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ventas */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ventas Totales</p>
              <p className="text-3xl font-bold text-gray-800">{stats.ventas.total}</p>
              <p className="text-sm text-green-600 mt-2">
                +{stats.ventas.hoy} hoy
              </p>
            </div>
            <div className="bg-primary-100 p-4 rounded-full">
              <span className="text-3xl">💰</span>
            </div>
          </div>
        </Card>

        {/* Pedidos */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pedidos</p>
              <p className="text-3xl font-bold text-gray-800">{stats.pedidos.total}</p>
              <p className="text-sm text-warning mt-2">
                {stats.pedidos.pendientes} pendientes
              </p>
            </div>
            <div className="bg-warning/10 p-4 rounded-full">
              <span className="text-3xl">📦</span>
            </div>
          </div>
        </Card>

        {/* Productos */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Productos</p>
              <p className="text-3xl font-bold text-gray-800">{stats.productos.total}</p>
              <p className="text-sm text-error mt-2">
                {stats.productos.stockBajo} stock bajo
              </p>
            </div>
            <div className="bg-success/10 p-4 rounded-full">
              <span className="text-3xl">📊</span>
            </div>
          </div>
        </Card>

        {/* Clientes */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Clientes</p>
              <p className="text-3xl font-bold text-gray-800">{stats.clientes.total}</p>
              <p className="text-sm text-info mt-2">Activos</p>
            </div>
            <div className="bg-info/10 p-4 rounded-full">
              <span className="text-3xl">👥</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Accesos rápidos */}
      <Card title="Accesos Rápidos">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/ventas"
            className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-4xl mb-2">💵</span>
            <span className="text-sm font-medium text-gray-700">Nueva Venta</span>
          </Link>
          
          <Link
            to="/pedidos"
            className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-4xl mb-2">📋</span>
            <span className="text-sm font-medium text-gray-700">Pedidos</span>
          </Link>
          
          <Link
            to="/productos"
            className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-4xl mb-2">📦</span>
            <span className="text-sm font-medium text-gray-700">Productos</span>
          </Link>
          
          <Link
            to="/clientes"
            className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-4xl mb-2">👤</span>
            <span className="text-sm font-medium text-gray-700">Clientes</span>
          </Link>
        </div>
      </Card>

      {/* Actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Ventas Recientes">
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-800">Venta #{1000 + index}</p>
                  <p className="text-sm text-gray-600">Cliente: Juan Pérez</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">
                    {formatCurrency(150000 + index * 10000)}
                  </p>
                  <p className="text-sm text-gray-600">Hace 1 hora</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Productos con Stock Bajo">
          <div className="space-y-4">
            {[
              { nombre: 'Producto A', stock: 5 },
              { nombre: 'Producto B', stock: 3 },
              { nombre: 'Producto C', stock: 2 },
            ].map((producto, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-800">{producto.nombre}</p>
                  <p className="text-sm text-gray-600">Categoría: General</p>
                </div>
                <div className="text-right">
                  <p className="text-error font-bold">
                    Stock: {producto.stock}
                  </p>
                  <Link
                    to="/productos"
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Ver detalle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
