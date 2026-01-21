import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useApi } from '../../hooks/useApi';
import { useToggle } from '../../hooks/useToggle';
import { getAllProductos, createProducto, updateProducto, deleteProducto } from '../../api/productosService';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

/**
 * Página de gestión de Productos
 * 
 * Permite crear, leer, actualizar y eliminar registros de Productos.
 * Incluye funcionalidad de búsqueda, filtrado y validación de datos.
 * 
 * @component
 * @returns {React.ReactElement} Página completa con tabla, modal y diálogos
 */
const ProductosPage = () => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state for create/edit
  const [showModal, toggleModal] = useToggle(false);
  const [editingId, setEditingId] = useState(null);
  
  // Delete confirmation state
  const [showDeleteConfirm, toggleDeleteConfirm] = useToggle(false);
  const [deletingId, setDeletingId] = useState(null);
  
  // Fetch data
  const { data: items, loading, error, refetch } = useFetch(() => getAllProductos(), {
    autoFetch: true,
  });
  
  // API operations
  const { loading: apiLoading, error: apiError, execute } = useApi();
  
  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    precio: '',
    stock: '',
    categoria: ''
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle create
  const handleCreate = async () => {
    if (!validateForm()) return;
    
    await execute(async () => {
      await createProducto(formData);
      setFormData({ nombre: '', codigo: '', precio: '', stock: '', categoria: '' });
      toggleModal();
      refetch();
    });
  };

  // Handle update
  const handleUpdate = async () => {
    if (!validateForm()) return;
    
    await execute(async () => {
      await updateProducto(editingId, formData);
      setFormData({ nombre: '', codigo: '', precio: '', stock: '', categoria: '' });
      toggleModal();
      refetch();
    });
  };

  // Handle delete
  const handleDelete = async () => {
    await execute(async () => {
      await deleteProducto(deletingId);
      toggleDeleteConfirm();
      refetch();
    });
  };

  // Open edit modal
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      nombre: item.nombre,
      codigo: item.codigo,
      precio: item.precio,
      stock: item.stock,
      categoria: item.categoria
    });
    toggleModal();
  };

  // Open delete confirmation
  const handleDeleteClick = (id) => {
    setDeletingId(id);
    toggleDeleteConfirm();
  };

  // Open create modal
  const handleNewClick = () => {
    setEditingId(null);
    setFormData({ nombre: '', codigo: '', precio: '', stock: '', categoria: '' });
    toggleModal();
  };

  // Form validation
  const validateForm = () => {
    if (!formData.nombre || !formData.codigo || !formData.precio || !formData.stock || !formData.categoria) {
      return false;
    }
    return true;
  };

  // Filter data based on search term
  const filteredData = items?.filter(item =>
    item.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Table columns definition
  const columns = [
    { key: 'codigo', label: 'Código' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'precio', label: 'Precio' },
    { key: 'stock', label: 'Stock' },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, item) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            size="small"
            onClick={() => handleEdit(item)}
            style={{ backgroundColor: '#ffc107', color: '#000' }}
          >
            Editar
          </Button>
          <Button
            size="small"
            onClick={() => handleDeleteClick(item.id)}
            style={{ backgroundColor: '#dc3545', color: '#fff' }}
          >
            Eliminar
          </Button>
        </div>
      )
    }
  ];

  return (
    <Card title="Gestión de Productos">
      {/* Error Alert */}
      {error && <ErrorAlert message={error} />}

      {/* Search Bar */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <Input
          placeholder="Buscar por nombre, código o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button onClick={handleNewClick} style={{ backgroundColor: '#28a745' }}>
          + Nuevo
        </Button>
      </div>

      {/* Loading Spinner */}
      {loading && <LoadingSpinner />}

      {/* Table */}
      {!loading && (
        <Table
          columns={columns}
          data={filteredData}
          loading={loading}
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        title={editingId ? 'Editar Producto' : 'Crear Producto'}
        isOpen={showModal}
        onClose={() => {
          toggleModal();
          setFormData({ nombre: '', codigo: '', precio: '', stock: '', categoria: '' });
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={apiLoading}
          />
          <Input
            label="Código"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            disabled={apiLoading}
          />
          <Input
            label="Precio"
            name="precio"
            type="number"
            value={formData.precio}
            onChange={handleChange}
            disabled={apiLoading}
          />
          <Input
            label="Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            disabled={apiLoading}
          />
          <Input
            label="Categoría"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            disabled={apiLoading}
          />
          
          {apiError && <ErrorAlert message={apiError} />}
          
          <Button
            onClick={editingId ? handleUpdate : handleCreate}
            disabled={apiLoading}
            style={{ backgroundColor: '#007bff', color: '#fff' }}
          >
            {apiLoading ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Confirmar eliminación"
        message="¿Está seguro de que desea eliminar este producto?"
        onConfirm={handleDelete}
        onCancel={toggleDeleteConfirm}
        isLoading={apiLoading}
      />
    </Card>
  );
};

export default ProductosPage;
