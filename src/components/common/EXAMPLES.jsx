/**
 * GUÍA DE IMPLEMENTACIÓN - Cómo usar los componentes comunes
 * 
 * Este archivo muestra ejemplos prácticos de cómo integrar
 * los componentes comunes en tus páginas y módulos
 */

// ============================================================================
// EJEMPLO 1: Layout principal con Navbar y Sidebar
// ============================================================================

import { useState } from 'react';
import { Navbar, Sidebar, ErrorAlert, LoadingSpinner } from '@/components/common';

function MainLayout({ children }) {
  const [error, setError] = useState('');

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Navbar en la parte superior */}
      <Navbar />
      
      {/* Contenedor principal */}
      <div className="flex w-full pt-16">
        {/* Sidebar a la izquierda */}
        <Sidebar />
        
        {/* Contenido principal */}
        <main className="flex-1 overflow-auto">
          {error && (
            <div className="p-4">
              <ErrorAlert 
                message={error}
                onClose={() => setError('')}
                autoClose={5000}
              />
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// EJEMPLO 2: Tabla con datos y acciones
// ============================================================================

import { Table, Button, Modal, Input, Select } from '@/components/common';

function ListadoProductos() {
  const [productos, setProductos] = useState([
    { id: 1, nombre: 'Producto A', precio: 100, stock: 50 },
    { id: 2, nombre: 'Producto B', precio: 200, stock: 30 },
  ]);
  
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', precio: '', stock: '' });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'precio', label: 'Precio', render: (val) => `$${val}` },
    { key: 'stock', label: 'Stock' },
    { 
      key: 'acciones', 
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={() => handleEdit(row)}>
            Editar
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(row.id)}>
            Eliminar
          </Button>
        </div>
      )
    },
  ];

  const handleEdit = (producto) => {
    setEditingId(producto.id);
    setFormData(producto);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setProductos(productos.filter(p => p.id !== id));
  };

  const handleSave = () => {
    if (editingId) {
      setProductos(productos.map(p => p.id === editingId ? formData : p));
    } else {
      setProductos([...productos, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setFormData({ nombre: '', precio: '', stock: '' });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button variant="success" onClick={() => {
          setEditingId(null);
          setFormData({ nombre: '', precio: '', stock: '' });
          setIsModalOpen(true);
        }}>
          Agregar Producto
        </Button>
      </div>

      <Table 
        columns={columns}
        data={productos}
        onRowClick={(row) => handleEdit(row)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <div className="space-y-4">
          <Input
            name="nombre"
            label="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Nombre del producto"
            required
          />
          <Input
            name="precio"
            label="Precio"
            type="number"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            placeholder="0.00"
            required
          />
          <Input
            name="stock"
            label="Stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            placeholder="0"
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="success" onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================================
// EJEMPLO 3: Formulario con validación
// ============================================================================

import { Input, Select, Button, ErrorAlert } from '@/components/common';

function FormularioCliente() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    ciudad: '',
    estado: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.ciudad) newErrors.ciudad = 'Seleccione una ciudad';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      // Aquí irría la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Cliente guardado exitosamente');
      setFormData({ nombre: '', email: '', ciudad: '', estado: '' });
    } catch (error) {
      setSubmitError('Error al guardar el cliente: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6">Nuevo Cliente</h2>

      {submitError && (
        <ErrorAlert 
          message={submitError}
          onClose={() => setSubmitError('')}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="nombre"
          label="Nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          error={errors.nombre}
          placeholder="Juan Pérez"
          required
        />

        <Input
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          placeholder="juan@example.com"
          required
        />

        <Select
          name="ciudad"
          label="Ciudad"
          options={[
            { value: 'bogota', label: 'Bogotá' },
            { value: 'medellin', label: 'Medellín' },
            { value: 'cali', label: 'Cali' },
          ]}
          value={formData.ciudad}
          onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
          error={errors.ciudad}
          placeholder="Seleccione una ciudad"
          required
        />

        <Select
          name="estado"
          label="Estado"
          options={[
            { value: 'activo', label: 'Activo' },
            { value: 'inactivo', label: 'Inactivo' },
          ]}
          value={formData.estado}
          onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
          placeholder="Seleccione un estado"
        />

        <Button 
          type="submit" 
          variant="success"
          loading={loading}
          className="w-full"
        >
          Guardar Cliente
        </Button>
      </form>
    </div>
  );
}

// ============================================================================
// EJEMPLO 4: Dashboard con tarjetas y estadísticas
// ============================================================================

import { Card, LoadingSpinner, Button } from '@/components/common';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVentas: 150000,
    totalClientes: 350,
    productosAgotados: 12,
    ordenesPendientes: 28,
  });

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="secondary" onClick={handleRefresh}>
          Actualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Ventas Totales">
          <p className="text-3xl font-bold text-green-600">
            ${stats.totalVentas.toLocaleString()}
          </p>
          <p className="text-gray-600 text-sm">Este mes</p>
        </Card>

        <Card title="Total Clientes">
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalClientes}
          </p>
          <p className="text-gray-600 text-sm">Clientes activos</p>
        </Card>

        <Card title="Productos Agotados">
          <p className="text-3xl font-bold text-red-600">
            {stats.productosAgotados}
          </p>
          <p className="text-gray-600 text-sm">Requieren reorden</p>
        </Card>

        <Card title="Órdenes Pendientes">
          <p className="text-3xl font-bold text-yellow-600">
            {stats.ordenesPendientes}
          </p>
          <p className="text-gray-600 text-sm">Esperando procesar</p>
        </Card>
      </div>

      <Card
        title="Acciones Rápidas"
        actions={[
          { label: 'Editar', onClick: () => {} },
          { label: 'Eliminar', onClick: () => {}, variant: 'danger' },
        ]}
      >
        <div className="flex gap-4">
          <Button variant="primary">Nueva Venta</Button>
          <Button variant="secondary">Ver Reportes</Button>
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// EJEMPLO 5: Confirmación de eliminación
// ============================================================================

import { Button, ConfirmDialog } from '@/components/common';

function ElementoConBorrado() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Elemento eliminado');
      setShowConfirm(false);
    } catch (error) {
      alert('Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="danger" onClick={() => setShowConfirm(true)}>
        Eliminar Elemento
      </Button>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Eliminar Elemento"
        message="¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loading={loading}
      />
    </>
  );
}

// ============================================================================
// EJEMPLO 6: Composición de componentes
// ============================================================================

import { Card, Table, Button, Modal, Input } from '@/components/common';

function ModuloCompleto() {
  const [data, setData] = useState([
    { id: 1, nombre: 'Item 1', estado: 'Activo' },
    { id: 2, nombre: 'Item 2', estado: 'Inactivo' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', estado: '' });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'estado', label: 'Estado' },
  ];

  return (
    <Card
      title="Gestión de Elementos"
      actions={[
        { 
          label: 'Agregar', 
          onClick: () => setIsModalOpen(true),
          variant: 'success'
        },
      ]}
    >
      <Table 
        columns={columns}
        data={data}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo Elemento"
      >
        <Input
          name="nombre"
          label="Nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={() => setIsModalOpen(false)}>
            Guardar
          </Button>
        </div>
      </Modal>
    </Card>
  );
}

export default {
  MainLayout,
  ListadoProductos,
  FormularioCliente,
  Dashboard,
  ElementoConBorrado,
  ModuloCompleto,
};
