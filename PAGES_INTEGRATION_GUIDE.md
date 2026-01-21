# Pages Integration Guide

## 📋 Quick Reference

This guide shows you how to integrate the 16 newly created module pages into your application.

## 🔧 Integration Steps

### Step 1: Import Pages in Your Router/App.jsx

```jsx
// src/App.jsx or src/routes/AppRouter.jsx

// Import all pages
import ProductosPage from './pages/productos/ProductosPage';
import ClientesPage from './pages/clientes/ClientesPage';
import VentasPage from './pages/ventas/VentasPage';
import ComprasPage from './pages/compras/ComprasPage';
import PedidosPage from './pages/pedidos/PedidosPage';
import UsuariosPage from './pages/usuarios/UsuariosPage';
import ProveedoresPage from './pages/proveedores/ProveedoresPage';
import RolesPage from './pages/roles/RolesPage';
import PermisosPage from './pages/permisos/PermisosPage';
import DomiciliariosPage from './pages/domiciliarios/DomiciliariosPage';
import RutasPage from './pages/rutas/RutasPage';
import ZonasPage from './pages/zonas/ZonasPage';
import CronogramasPage from './pages/cronogramas/CronogramasPage';
import PerdidasPage from './pages/perdidas/PerdidasPage';
import CategoriasPage from './pages/categorias/CategoriasPage';
import EstadoVentaPage from './pages/estado-venta/EstadoVentaPage';
```

### Step 2: Add Routes in Your Router

```jsx
// Using React Router
<Routes>
  {/* Productos */}
  <Route path="/productos" element={<ProductosPage />} />
  
  {/* Clientes */}
  <Route path="/clientes" element={<ClientesPage />} />
  
  {/* Ventas */}
  <Route path="/ventas" element={<VentasPage />} />
  
  {/* Compras */}
  <Route path="/compras" element={<ComprasPage />} />
  
  {/* Pedidos */}
  <Route path="/pedidos" element={<PedidosPage />} />
  
  {/* Usuarios */}
  <Route path="/usuarios" element={<UsuariosPage />} />
  
  {/* Proveedores */}
  <Route path="/proveedores" element={<ProveedoresPage />} />
  
  {/* Roles */}
  <Route path="/roles" element={<RolesPage />} />
  
  {/* Permisos */}
  <Route path="/permisos" element={<PermisosPage />} />
  
  {/* Domiciliarios */}
  <Route path="/domiciliarios" element={<DomiciliariosPage />} />
  
  {/* Rutas */}
  <Route path="/rutas" element={<RutasPage />} />
  
  {/* Zonas */}
  <Route path="/zonas" element={<ZonasPage />} />
  
  {/* Cronogramas */}
  <Route path="/cronogramas" element={<CronogramasPage />} />
  
  {/* Pérdidas */}
  <Route path="/perdidas" element={<PerdidasPage />} />
  
  {/* Categorías */}
  <Route path="/categorias" element={<CategoriasPage />} />
  
  {/* Estado Venta */}
  <Route path="/estado-venta" element={<EstadoVentaPage />} />
</Routes>
```

### Step 3: Update Your Navigation Menu

Add links in your Navbar or Sidebar component:

```jsx
// src/components/common/Sidebar.jsx or Navbar.jsx

const menuItems = [
  {
    label: 'Módulos',
    submenu: [
      { label: 'Productos', href: '/productos' },
      { label: 'Clientes', href: '/clientes' },
      { label: 'Ventas', href: '/ventas' },
      { label: 'Compras', href: '/compras' },
      { label: 'Pedidos', href: '/pedidos' },
      { label: 'Usuarios', href: '/usuarios' },
      { label: 'Proveedores', href: '/proveedores' },
    ]
  },
  {
    label: 'Configuración',
    submenu: [
      { label: 'Roles', href: '/roles' },
      { label: 'Permisos', href: '/permisos' },
      { label: 'Categorías', href: '/categorias' },
      { label: 'Estado Venta', href: '/estado-venta' },
    ]
  },
  {
    label: 'Logística',
    submenu: [
      { label: 'Domiciliarios', href: '/domiciliarios' },
      { label: 'Rutas', href: '/rutas' },
      { label: 'Zonas', href: '/zonas' },
      { label: 'Cronogramas', href: '/cronogramas' },
    ]
  },
  {
    label: 'Control',
    submenu: [
      { label: 'Pérdidas', href: '/perdidas' },
    ]
  },
];
```

## 📊 Page Features Summary

| Page | Route | Service | Search Fields | Key Fields |
|------|-------|---------|---|---|
| Productos | `/productos` | productosService | nombre, código | precio, stock, categoría |
| Clientes | `/clientes` | clientesService | nombre, email | teléfono, ciudad, dirección |
| Ventas | `/ventas` | ventasService | número, cliente | fecha, total, estado |
| Compras | `/compras` | comprasService | número, proveedor | fecha, total, estado |
| Pedidos | `/pedidos` | pedidosService | número, cliente | fecha, total, estado |
| Usuarios | `/usuarios` | usuariosService | nombre, email | rol, estado, fecha_registro |
| Proveedores | `/proveedores` | proveedoresService | nombre, email | teléfono, ciudad, contacto |
| Roles | `/roles` | rolesService | nombre | descripción, estado |
| Permisos | `/permisos` | permisosService | nombre | descripción, módulo |
| Domiciliarios | `/domiciliarios` | domiciliariosService | nombre, email | teléfono, ciudad, estado |
| Rutas | `/rutas` | rutasService | nombre, origen | destino, distancia, estado |
| Zonas | `/zonas` | zonasService | nombre, descripción | ciudad, estado |
| Cronogramas | `/cronogramas` | cronogramasService | nombre | descripción, fecha_inicio, fecha_fin, estado |
| Pérdidas | `/perdidas` | perdidasService | número, producto | cantidad, razón, fecha |
| Categorías | `/categorias` | categoriaProductosService | nombre | descripción, estado |
| Estado Venta | `/estado-venta` | estadoVentaService | nombre | descripción, estado |

## 🎨 Customization Examples

### Example 1: Adding a Custom Column with Formatting

Each page's table columns can be customized in the component:

```jsx
// In ProductosPage.jsx
const columns = [
  { key: 'codigo', label: 'Código' },
  { key: 'nombre', label: 'Nombre' },
  { 
    key: 'precio', 
    label: 'Precio',
    render: (value) => `$${parseFloat(value).toFixed(2)}`
  },
  { 
    key: 'stock', 
    label: 'Stock',
    render: (value) => (
      <span style={{ color: value < 10 ? 'red' : 'green' }}>
        {value}
      </span>
    )
  },
  // ... rest of columns
];
```

### Example 2: Adding Validation Rules

Each page has a `validateForm()` function you can enhance:

```jsx
// In ProductosPage.jsx
const validateForm = () => {
  if (!formData.nombre?.trim()) {
    alert('El nombre es requerido');
    return false;
  }
  
  if (formData.precio <= 0) {
    alert('El precio debe ser mayor a 0');
    return false;
  }
  
  if (formData.stock < 0) {
    alert('El stock no puede ser negativo');
    return false;
  }
  
  return true;
};
```

### Example 3: Adding More Form Fields

Each page's form can be extended with additional Input components:

```jsx
// In Modal
<Input
  label="Nuevo Campo"
  name="nuevocampo"
  value={formData.nuevocamp}
  onChange={handleChange}
  disabled={apiLoading}
/>
```

## 🔄 CRUD Operations Flow

Each page implements the following flow:

### Create Flow
1. User clicks "Nuevo" button
2. Modal opens with empty form
3. User fills form fields
4. User clicks "Crear"
5. Form validates
6. API call creates record
7. Table refreshes automatically
8. Modal closes
9. Success notification (if configured)

### Read Flow
1. Page component loads
2. `useFetch` hook automatically fetches data
3. Data displays in table
4. User can search to filter data

### Update Flow
1. User clicks "Editar" on a record
2. Modal opens with pre-populated form
3. User modifies fields
4. User clicks "Actualizar"
5. Form validates
6. API call updates record
7. Table refreshes automatically
8. Modal closes
9. Success notification (if configured)

### Delete Flow
1. User clicks "Eliminar" on a record
2. Confirmation dialog appears
3. User confirms deletion
4. API call deletes record
5. Table refreshes automatically
6. Dialog closes
7. Success notification (if configured)

## 🛡️ Error Handling

All pages handle errors gracefully:

- **Fetch Errors:** Display ErrorAlert component
- **API Errors:** Show error message during CRUD operations
- **Validation Errors:** Prevent form submission
- **Loading States:** Disable inputs during API calls

## 📱 Responsive Design

All pages use flexbox and responsive CSS:

- Mobile: Single column layout
- Tablet: Optimized spacing
- Desktop: Full width with padding

## 🔐 Security Considerations

- Form validation before submission
- Confirmation dialogs for destructive actions
- Error messages don't expose sensitive info
- Loading states prevent double-submission
- API errors handled gracefully

## 🚀 Performance Optimization

Each page optimizes performance through:

- Lazy filtering (search on client-side)
- Memoized callbacks via `useToggle`
- Conditional rendering for modals
- Auto-refetch only after successful operations

## 📚 Next Steps

1. **Connect to Backend:** Ensure all service functions match your API endpoints
2. **Add Notifications:** Integrate toast/snackbar for success messages
3. **Implement Permissions:** Add role-based access control if needed
4. **Add Exports:** Implement CSV/Excel export functionality
5. **Advanced Filtering:** Add date range filters, multi-select filters
6. **Bulk Operations:** Add bulk delete or bulk update features

## 🐛 Troubleshooting

### Issue: Table is empty
- Check API service functions return data correctly
- Check browser console for fetch errors
- Verify backend API is running

### Issue: Modal doesn't close after save
- Ensure `refetch()` completes successfully
- Check if API returns success status
- Verify `toggleModal()` is being called

### Issue: Search not working
- Check search field names match data keys
- Verify `searchTerm` state is updating
- Ensure filter logic includes all desired fields

### Issue: Form validation always fails
- Check form field names match state keys
- Verify validation logic is correct
- Ensure all required fields are populated

## 📞 Support

For issues or questions about these pages:

1. Check the PAGES_CREATED.md file in `/src/pages/`
2. Review the example page implementations
3. Check component documentation in `/src/components/common/`
4. Review hook documentation in `/src/hooks/`

---

**Version:** 1.0
**Last Updated:** January 2025
**Status:** Ready for Production
