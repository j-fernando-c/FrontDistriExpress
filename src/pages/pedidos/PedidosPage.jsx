import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useApi } from '../../hooks/useApi';
import { useToggle } from '../../hooks/useToggle';
import { getAllPedidos, createPedido, updatePedido, deletePedido } from '../../api/pedidosService';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

/**
 * Página de gestión de Pedidos
 * 
 * Permite crear, leer, actualizar y eliminar registros de Pedidos.
 * Incluye funcionalidad de búsqueda, filtrado y validación de datos.
 * 
 * @component
 * @returns {React.ReactElement} Página completa con tabla, modal y diálogos
 */
const PedidosPage = () => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state for create/edit
  const [showModal, toggleModal] = useToggle(false);
  const [editingId, setEditingId] = useState(null);
  
  // Delete confirmation state
  const [showDeleteConfirm, toggleDeleteConfirm] = useToggle(false);
  const [deletingId, setDeletingId] = useState(null);
  
  // Fetch data
  const { data: items, loading, error, refetch } = useFetch(() => getAllPedidos(), {
    autoFetch: true,
  });
  
  // API operations
  const { loading: apiLoading, error: apiError, execute } = useApi();
  
  // Form state
  const [formData, setFormData] = useState({
    cliente: '',
    fecha: '',
    total: '',
    estado: ''
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
      await createPedido(formData);
      setFormData({ cliente: '', fecha: '', total: '', estado: '' });
      toggleModal();
      refetch();
    });
  };

  // Handle update
  const handleUpdate = async () => {
    if (!validateForm()) return;
    
    await execute(async () => {
      await updatePedido(editingId, formData);
      setFormData({ cliente: '', fecha: '', total: '', estado: '' });
      toggleModal();
      refetch();
    });
  };

  // Handle delete
  const handleDelete = async () => {
    await execute(async () => {
      await deletePedido(deletingId);
      toggleDeleteConfirm();
      refetch();
    });
  };

  // Open edit modal
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      cliente: item.cliente,
      fecha: item.fecha,
      total: item.total,
      estado: item.estado
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
    setFormData({ cliente: '', fecha: '', total: '', estado: '' });
    toggleModal();
  };

  // Form validation
  const validateForm = () => {
    if (!formData.cliente || !formData.fecha || !formData.total || !formData.estado) {
      return false;
    }
    return true;
  };

  // Filter data based on search term
  const filteredData = items?.filter(item =>
    item.numero?.toString().includes(searchTerm) ||
    item.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.estado?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Table columns definition
  const columns = [
    { key: 'numero', label: 'Número' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'total', label: 'Total' },
    { key: 'estado', label: 'Estado' },
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
    <Card title="Gestión de Pedidos">
      {/* Error Alert */}
      {error && <ErrorAlert message={error} />}

      {/* Search Bar */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <Input
          placeholder="Buscar por número, cliente o estado..."
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
        title={editingId ? 'Editar Pedido' : 'Crear Pedido'}
        isOpen={showModal}
        onClose={() => {
          toggleModal();
          setFormData({ cliente: '', fecha: '', total: '', estado: '' });
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input
            label="Cliente"
            name="cliente"
            value={formData.cliente}
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
          <Input
            label="Total"
            name="total"
            type="number"
            value={formData.total}
            onChange={handleChange}
            disabled={apiLoading}
          />
          <Input
            label="Estado"
            name="estado"
            value={formData.estado}
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
        message="¿Está seguro de que desea eliminar este pedido?"
        onConfirm={handleDelete}
        onCancel={toggleDeleteConfirm}
        isLoading={apiLoading}
      />
    </Card>
  );
};

export default PedidosPage;
