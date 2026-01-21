import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useApi } from '../../hooks/useApi';
import { useToggle } from '../../hooks/useToggle';
import { getAllPerdidas, createPerdida, updatePerdida, deletePerdida } from '../../api/perdidasService';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

/**
 * Página de gestión de Pérdidas
 * 
 * Permite crear, leer, actualizar y eliminar registros de Pérdidas.
 * Incluye funcionalidad de búsqueda, filtrado y validación de datos.
 * 
 * @component
 * @returns {React.ReactElement} Página completa con tabla, modal y diálogos
 */
const PerdidasPage = () => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state for create/edit
  const [showModal, toggleModal] = useToggle(false);
  const [editingId, setEditingId] = useState(null);
  
  // Delete confirmation state
  const [showDeleteConfirm, toggleDeleteConfirm] = useToggle(false);
  const [deletingId, setDeletingId] = useState(null);
  
  // Fetch data
  const { data: items, loading, error, refetch } = useFetch(() => getAllPerdidas(), {
    autoFetch: true,
  });
  
  // API operations
  const { loading: apiLoading, error: apiError, execute } = useApi();
  
  // Form state
  const [formData, setFormData] = useState({
    producto: '',
    cantidad: '',
    razon: '',
    fecha: ''
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
      await createPerdida(formData);
      setFormData({ producto: '', cantidad: '', razon: '', fecha: '' });
      toggleModal();
      refetch();
    });
  };

  // Handle update
  const handleUpdate = async () => {
    if (!validateForm()) return;
    
    await execute(async () => {
      await updatePerdida(editingId, formData);
      setFormData({ producto: '', cantidad: '', razon: '', fecha: '' });
      toggleModal();
      refetch();
    });
  };

  // Handle delete
  const handleDelete = async () => {
    await execute(async () => {
      await deletePerdida(deletingId);
      toggleDeleteConfirm();
      refetch();
    });
  };

  // Open edit modal
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      producto: item.producto,
      cantidad: item.cantidad,
      razon: item.razon,
      fecha: item.fecha
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
    setFormData({ producto: '', cantidad: '', razon: '', fecha: '' });
    toggleModal();
  };

  // Form validation
  const validateForm = () => {
    if (!formData.producto || !formData.cantidad || !formData.razon || !formData.fecha) {
      return false;
    }
    return true;
  };

  // Filter data based on search term
  const filteredData = items?.filter(item =>
    item.numero?.toString().includes(searchTerm) ||
    item.producto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.razon?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Table columns definition
  const columns = [
    { key: 'numero', label: 'Número' },
    { key: 'producto', label: 'Producto' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'razon', label: 'Razón' },
    { key: 'fecha', label: 'Fecha' },
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
    <Card title="Gestión de Pérdidas">
      {/* Error Alert */}
      {error && <ErrorAlert message={error} />}

      {/* Search Bar */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <Input
          placeholder="Buscar por número, producto o razón..."
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
        title={editingId ? 'Editar Pérdida' : 'Crear Pérdida'}
        isOpen={showModal}
        onClose={() => {
          toggleModal();
          setFormData({ producto: '', cantidad: '', razon: '', fecha: '' });
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input
            label="Producto"
            name="producto"
            value={formData.producto}
            onChange={handleChange}
            disabled={apiLoading}
          />
          <Input
            label="Cantidad"
            name="cantidad"
            type="number"
            value={formData.cantidad}
            onChange={handleChange}
            disabled={apiLoading}
          />
          <Input
            label="Razón"
            name="razon"
            value={formData.razon}
            onChange={handleChange}
            disabled={apiLoading}
          />
          <Input
            label="Fecha"
            name="fecha"
            type="date"
            value={formData.fecha}
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
        message="¿Está seguro de que desea eliminar esta pérdida?"
        onConfirm={handleDelete}
        onCancel={toggleDeleteConfirm}
        isLoading={apiLoading}
      />
    </Card>
  );
};

export default PerdidasPage;
