import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useApi } from '../../hooks/useApi';
import { useToggle } from '../../hooks/useToggle';
import { getAllCronogramas, createCronograma, updateCronograma, deleteCronograma } from '../../api/cronogramasService';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

/**
 * Página de gestión de Cronogramas
 * 
 * Permite crear, leer, actualizar y eliminar registros de Cronogramas.
 * Incluye funcionalidad de búsqueda, filtrado y validación de datos.
 * 
 * @component
 * @returns {React.ReactElement} Página completa con tabla, modal y diálogos
 */
const CronogramasPage = () => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state for create/edit
  const [showModal, toggleModal] = useToggle(false);
  const [editingId, setEditingId] = useState(null);
  
  // Delete confirmation state
  const [showDeleteConfirm, toggleDeleteConfirm] = useToggle(false);
  const [deletingId, setDeletingId] = useState(null);
  
  // Fetch data
  const { data: items, loading, error, refetch } = useFetch(() => getAllCronogramas(), {
    autoFetch: true,
  });
  
  // API operations
  const { loading: apiLoading, error: apiError, execute } = useApi();
  
  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
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
      await createCronograma(formData);
      setFormData({ nombre: '', descripcion: '', fecha_inicio: '', fecha_fin: '', estado: '' });
      toggleModal();
      refetch();
    });
  };

  // Handle update
  const handleUpdate = async () => {
    if (!validateForm()) return;
    
    await execute(async () => {
      await updateCronograma(editingId, formData);
      setFormData({ nombre: '', descripcion: '', fecha_inicio: '', fecha_fin: '', estado: '' });
      toggleModal();
      refetch();
    });
  };

  // Handle delete
  const handleDelete = async () => {
    await execute(async () => {
      await deleteCronograma(deletingId);
      toggleDeleteConfirm();
      refetch();
    });
  };

  // Open edit modal
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      nombre: item.nombre,
      descripcion: item.descripcion,
      fecha_inicio: item.fecha_inicio,
      fecha_fin: item.fecha_fin,
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
    setFormData({ nombre: '', descripcion: '', fecha_inicio: '', fecha_fin: '', estado: '' });
    toggleModal();
  };

  // Form validation
  const validateForm = () => {
    if (!formData.nombre || !formData.descripcion || !formData.fecha_inicio || !formData.fecha_fin || !formData.estado) {
      return false;
    }
    return true;
  };

  // Filter data based on search term
  const filteredData = items?.filter(item =>
    item.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Table columns definition
  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'fecha_inicio', label: 'Fecha Inicio' },
    { key: 'fecha_fin', label: 'Fecha Fin' },
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
    <Card title="Gestión de Cronogramas">
      {/* Error Alert */}
      {error && <ErrorAlert message={error} />}

      {/* Search Bar */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <Input
          placeholder="Buscar por nombre o descripción..."
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
        title={editingId ? 'Editar Cronograma' : 'Crear Cronograma'}
        isOpen={showModal}
        onClose={() => {
          toggleModal();
          setFormData({ nombre: '', descripcion: '', fecha_inicio: '', fecha_fin: '', estado: '' });
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
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            disabled={apiLoading}
          />
          <Input
            label="Fecha Inicio"
            name="fecha_inicio"
            type="date"
            value={formData.fecha_inicio}
            onChange={handleChange}
            disabled={apiLoading}
          />
          <Input
            label="Fecha Fin"
            name="fecha_fin"
            type="date"
            value={formData.fecha_fin}
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
        message="¿Está seguro de que desea eliminar este cronograma?"
        onConfirm={handleDelete}
        onCancel={toggleDeleteConfirm}
        isLoading={apiLoading}
      />
    </Card>
  );
};

export default CronogramasPage;
