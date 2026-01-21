# Common Customization Examples

This file contains code examples for common customizations to the 16 module pages.

## 🎯 Table Customizations

### Example 1: Add Status Badge Styling

```jsx
// In any Page component, customize the columns array:

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { 
    key: 'estado', 
    label: 'Estado',
    render: (value) => {
      const statusColors = {
        'activo': '#28a745',
        'inactivo': '#6c757d',
        'pendiente': '#ffc107',
        'rechazado': '#dc3545'
      };
      return (
        <span style={{
          backgroundColor: statusColors[value?.toLowerCase()] || '#ccc',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {value}
        </span>
      );
    }
  },
  // ... other columns
];
```

### Example 2: Add Formatted Date Column

```jsx
// In pages with date fields (VentasPage, PedidosPage, etc.)

{ 
  key: 'fecha', 
  label: 'Fecha',
  render: (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
}
```

### Example 3: Add Currency Formatting

```jsx
// In ProductosPage, VentasPage, ComprasPage

{ 
  key: 'precio', 
  label: 'Precio',
  render: (value) => {
    if (!value) return '-';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(value);
  }
}
```

### Example 4: Add Stock Level Indicator

```jsx
// In ProductosPage

{ 
  key: 'stock', 
  label: 'Stock',
  render: (value) => {
    let color = '#28a745'; // green
    if (value < 5) color = '#dc3545'; // red
    else if (value < 10) color = '#ffc107'; // yellow
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: color
        }} />
        <span>{value}</span>
      </div>
    );
  }
}
```

### Example 5: Add Edit Date Column

```jsx
// In any page that has fecha_registro or updated_at

{ 
  key: 'fecha_registro', 
  label: 'Registro',
  render: (value) => {
    if (!value) return '-';
    const date = new Date(value);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    return `Hace ${diffDays} días`;
  }
}
```

## 📝 Form Field Customizations

### Example 1: Add Select Input Field

```jsx
// In Modal, add a select dropdown

import Select from '../../components/common/Select';

<Select
  label="Categoría"
  name="categoria"
  value={formData.categoria}
  onChange={handleChange}
  disabled={apiLoading}
  options={[
    { value: 'electrónica', label: 'Electrónica' },
    { value: 'ropa', label: 'Ropa' },
    { value: 'alimentos', label: 'Alimentos' },
  ]}
/>
```

### Example 2: Add Required Field Indicator

```jsx
// Modify Input components to show required status

<Input
  label="Nombre *"
  name="nombre"
  value={formData.nombre}
  onChange={handleChange}
  disabled={apiLoading}
  required
  style={{ borderColor: formData.nombre ? '#ccc' : '#ff6b6b' }}
/>
```

### Example 3: Add Textarea for Descriptions

```jsx
// For pages with description fields

<textarea
  placeholder="Descripción..."
  name="descripcion"
  value={formData.descripcion}
  onChange={handleChange}
  disabled={apiLoading}
  style={{
    width: '100%',
    minHeight: '100px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontFamily: 'Arial, sans-serif'
  }}
/>
```

### Example 4: Add Email Validation

```jsx
// Enhance form validation

const validateForm = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(formData.email)) {
    alert('Por favor ingrese un email válido');
    return false;
  }
  
  return true;
};
```

### Example 5: Add Password Strength Indicator

```jsx
// In UsuariosPage, add password strength visual

const [passwordStrength, setPasswordStrength] = useState(0);

const handlePasswordChange = (e) => {
  const pwd = e.target.value;
  handleChange(e);
  
  let strength = 0;
  if (pwd.length >= 8) strength++;
  if (/[A-Z]/.test(pwd)) strength++;
  if (/[0-9]/.test(pwd)) strength++;
  if (/[^A-Za-z0-9]/.test(pwd)) strength++;
  
  setPasswordStrength(strength);
};

// In render:
{formData.contrasena && (
  <div style={{ marginTop: '8px' }}>
    <div style={{
      height: '4px',
      backgroundColor: '#e0e0e0',
      borderRadius: '2px',
      overflow: 'hidden'
    }}>
      <div style={{
        height: '100%',
        width: `${(passwordStrength / 4) * 100}%`,
        backgroundColor: passwordStrength < 2 ? '#dc3545' : passwordStrength < 3 ? '#ffc107' : '#28a745',
        transition: 'all 0.3s'
      }} />
    </div>
    <small style={{ color: '#666' }}>
      Fuerza: {['Muy débil', 'Débil', 'Media', 'Fuerte'][passwordStrength - 1] || 'Inválida'}
    </small>
  </div>
)}
```

## 🔍 Search Customizations

### Example 1: Add Date Range Filter

```jsx
// In any page, add date filtering to search

const [dateRange, setDateRange] = useState({ start: '', end: '' });

const filteredData = items?.filter(item => {
  const matchesSearch = /* existing search logic */;
  
  if (dateRange.start && dateRange.end) {
    const itemDate = new Date(item.fecha);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    return matchesSearch && itemDate >= startDate && itemDate <= endDate;
  }
  
  return matchesSearch;
}) || [];

// In search section:
<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
  <Input
    type="date"
    value={dateRange.start}
    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
    placeholder="Desde"
  />
  <Input
    type="date"
    value={dateRange.end}
    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
    placeholder="Hasta"
  />
  <Button onClick={() => setDateRange({ start: '', end: '' })}>
    Limpiar filtro
  </Button>
</div>
```

### Example 2: Add Multi-Field Search

```jsx
// Enhanced search that matches multiple fields

const [searchFields, setSearchFields] = useState({
  nombre: '',
  email: '',
  estado: ''
});

const filteredData = items?.filter(item =>
  (!searchFields.nombre || item.nombre?.toLowerCase().includes(searchFields.nombre.toLowerCase())) &&
  (!searchFields.email || item.email?.toLowerCase().includes(searchFields.email.toLowerCase())) &&
  (!searchFields.estado || item.estado?.toLowerCase() === searchFields.estado.toLowerCase())
) || [];

// In search section:
<div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
  <Input
    placeholder="Buscar por nombre..."
    value={searchFields.nombre}
    onChange={(e) => setSearchFields({...searchFields, nombre: e.target.value})}
    style={{ flex: 1, minWidth: '200px' }}
  />
  <Input
    placeholder="Buscar por email..."
    value={searchFields.email}
    onChange={(e) => setSearchFields({...searchFields, email: e.target.value})}
    style={{ flex: 1, minWidth: '200px' }}
  />
  <Button onClick={() => setSearchFields({nombre: '', email: '', estado: ''})}>
    Limpiar
  </Button>
</div>
```

### Example 3: Add Quick Filters

```jsx
// Add quick status filters

const [activeFilter, setActiveFilter] = useState(null);

const filteredData = items?.filter(item => {
  const matchesSearch = /* existing search logic */;
  
  if (activeFilter === 'activo') {
    return matchesSearch && item.estado === 'activo';
  }
  if (activeFilter === 'inactivo') {
    return matchesSearch && item.estado === 'inactivo';
  }
  
  return matchesSearch;
}) || [];

// In render:
<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
  <Button
    onClick={() => setActiveFilter(null)}
    style={{ backgroundColor: !activeFilter ? '#007bff' : '#ccc' }}
  >
    Todos
  </Button>
  <Button
    onClick={() => setActiveFilter('activo')}
    style={{ backgroundColor: activeFilter === 'activo' ? '#28a745' : '#ccc' }}
  >
    Activos
  </Button>
  <Button
    onClick={() => setActiveFilter('inactivo')}
    style={{ backgroundColor: activeFilter === 'inactivo' ? '#dc3545' : '#ccc' }}
  >
    Inactivos
  </Button>
</div>
```

## 🔐 Validation Customizations

### Example 1: Add Conditional Validation

```jsx
// Validate based on field dependencies

const validateForm = () => {
  // Base validation
  if (!formData.nombre) {
    alert('El nombre es requerido');
    return false;
  }
  
  // Conditional validation
  if (formData.tipo === 'empresa') {
    if (!formData.nit) {
      alert('El NIT es requerido para empresas');
      return false;
    }
  }
  
  return true;
};
```

### Example 2: Add Duplicate Check

```jsx
// Check if item already exists before creating

const handleCreate = async () => {
  // Check for duplicates
  const exists = items?.some(item => 
    item.nombre?.toLowerCase() === formData.nombre?.toLowerCase()
  );
  
  if (exists) {
    alert('Ya existe un registro con este nombre');
    return;
  }
  
  if (!validateForm()) return;
  
  await execute(async () => {
    await createX(formData);
    // ... rest of logic
  });
};
```

### Example 3: Add Async Field Validation

```jsx
// Validate email uniqueness against API

const validateEmail = async (email) => {
  try {
    const response = await axiosInstance.get(`/usuarios/check-email`, {
      params: { email }
    });
    return !response.data.exists;
  } catch {
    return true; // If check fails, allow form submission
  }
};

// In form submission:
const handleCreate = async () => {
  const isEmailValid = await validateEmail(formData.email);
  if (!isEmailValid) {
    alert('Este email ya está registrado');
    return;
  }
  
  // ... rest of logic
};
```

## 📊 Advanced Features

### Example 1: Add Batch Operations

```jsx
// Add checkbox column and bulk delete

const [selectedIds, setSelectedIds] = useState([]);

const handleSelectAll = (e) => {
  if (e.target.checked) {
    setSelectedIds(items.map(item => item.id));
  } else {
    setSelectedIds([]);
  }
};

const handleSelectOne = (id) => {
  setSelectedIds(prev => 
    prev.includes(id) 
      ? prev.filter(i => i !== id)
      : [...prev, id]
  );
};

// Update columns to include checkbox
const columns = [
  {
    key: 'select',
    label: <input type="checkbox" onChange={handleSelectAll} />,
    render: (_, item) => (
      <input
        type="checkbox"
        checked={selectedIds.includes(item.id)}
        onChange={() => handleSelectOne(item.id)}
      />
    )
  },
  // ... other columns
];
```

### Example 2: Add Export to CSV

```jsx
// Add export functionality

const exportToCSV = () => {
  const headers = columns
    .filter(col => col.key !== 'actions')
    .map(col => col.label)
    .join(',');
  
  const rows = filteredData.map(item =>
    columns
      .filter(col => col.key !== 'actions')
      .map(col => {
        const value = item[col.key];
        return `"${value}"`;
      })
      .join(',')
  );
  
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'export.csv';
  a.click();
};

// Add button in search section:
<Button onClick={exportToCSV}>
  📥 Exportar CSV
</Button>
```

### Example 3: Add Pagination

```jsx
// Implement pagination for large datasets

const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

const paginatedData = filteredData.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

const totalPages = Math.ceil(filteredData.length / itemsPerPage);

// In render, after table:
{totalPages > 1 && (
  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
    <Button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(prev => prev - 1)}
    >
      Anterior
    </Button>
    <span style={{ display: 'flex', alignItems: 'center' }}>
      Página {currentPage} de {totalPages}
    </span>
    <Button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(prev => prev + 1)}
    >
      Siguiente
    </Button>
  </div>
)}
```

---

**Note:** These are template examples. Adjust them according to your specific needs and API structure.

**Last Updated:** January 2025
