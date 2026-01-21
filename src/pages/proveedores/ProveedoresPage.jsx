import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useApi } from '../../hooks/useApi';
import { useToggle } from '../../hooks/useToggle';
import { getAllProveedores, createProveedor, updateProveedor, deleteProveedor } from '../../api/proveedoresService';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

/**
 * Página de gestión de Proveedores
 * 
 * Permite crear, leer, actualizar y eliminar registros de Proveedores.
 * Incluye funcionalidad de búsqueda, filtrado y validación de datos.
 * 
 * @component
 * @returns {React.ReactElement} Página completa con tabla, modal y diálogos
 */
const ProveedoresPage = () => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state for create/edit
  const [showModal, toggleModal] = useToggle(false);
  const [editingId, setEditingId] = useState(null);
  
  // Delete confirmation state
  const [showDeleteConfirm, toggleDeleteConfirm] = useToggle(false);
  const [deletingId, setDeletingId] = useState(null);
  
  // Fetch data
  const { data: items, loading, error, refetch } = useFetch(() => getAllProveedores(), {
    autoFetch: true,
  });
  
  // API operations
  const { loading: apiLoading, error: apiError, execute } = useApi();
  
  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    ciudad: '',
    contacto: ''
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
      await createProveedor(formData);
      setFormData({ nombre: '', email: '', telefono: '', ciudad: '', contacto: '' });
      toggleModal();
      refetch();
    });
  };

  // Handle update
  const handleUpdate = async () => {
    if (!validateForm()) return;
    
    await execute(async () => {
      await updateProveedor(editingId, formData);
      setFormData({ nombre: '', email: '', telefono: '', ciudad: '', contacto: '' });
      toggleModal();
      refetch();
    });
  };

  // Handle delete
  const handleDelete = async () => {
    await execute(async () => {
      await deleteProveedor(deletingId);
      toggleDeleteConfirm();
      refetch();
    });
  };

  // Open edit modal
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      nombre: item.nombre,
      email: item.email,
      telefono: item.telefono,
      ciudad: item.ciudad,
      contacto: item.contacto
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
    setFormData({ nombre: '', email: '', telefono: '', ciudad: '', contacto: '' });
    toggleModal();
  };

  // Form validation
  const validateForm = () => {
    if (!formData.nombre || !formData.email || !formData.telefono || !formData.ciudad || !formData.contacto) {
      return false;
    }
    return true;
  };

  // Filter data based on search term
  const filteredData = items?.filter(item =>
    item.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ciudad?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Table columns definition
  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'ciudad', label: 'Ciudad' },
    { key: 'contacto', label: 'Contacto' },
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
    <Card title="Gestión de Proveedores">
      {/* Error Alert */}
      {error && <ErrorAlert message={error} />}

      {/* Search Bar */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <Input
          placeholder="Buscar por nombre, email o ciudad..."
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
        title={editingId ? 'Editar Proveedor' : 'Crear Proveedor'}
        isOpen={showModal}
        onClose={() => {
          toggleModal();
          setFormData({ nombre: '', email: '', telefono: '', ciudad: '', contacto: '' });
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
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={apiLoading}
          />
          <Input
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            disabled={apiLoading}
          />
          <Input
            label="Ciudad"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            disabled={apiLoading}
          />
          <Input
            label="Contacto"
            name="contacto"
            value={formData.contacto}
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
        message="¿Está seguro de que desea eliminar este proveedor?"
        onConfirm={handleDelete}
        onCancel={toggleDeleteConfirm}
        isLoading={apiLoading}
      />
    </Card>
  );
};

export default ProveedoresPage;
