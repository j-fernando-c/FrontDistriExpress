# Componentes Comunes - FrontDistriExpress

Este directorio contiene todos los componentes comunes reutilizables de la aplicación FrontDistriExpress. Todos los componentes están construidos con React, Tailwind CSS y siguen las mejores prácticas de React.

## 📋 Componentes Disponibles

### 1. **Navbar.jsx** - Barra de Navegación Superior
Barra de navegación principal con logo, perfil de usuario y menú hamburguesa.

```jsx
import { Navbar } from '@/components/common';

<Navbar />
```

**Características:**
- Logo y nombre de la aplicación (FDE - FrontDistriExpress)
- Menú desplegable del perfil de usuario
- Botón de cierre de sesión
- Botón hamburguesa para alternar la barra lateral (móvil)
- Gradiente azul con sombra
- Responsivo

**Props:**
- Usa contexto `AppContext` para obtener usuario y funciones de logout/toggleSidebar

---

### 2. **Sidebar.jsx** - Barra Lateral de Navegación
Navegación lateral con menú completo de módulos.

```jsx
import { Sidebar } from '@/components/common';

<Sidebar />
```

**Características:**
- 17 elementos de menú con iconos (emojis)
- Estado activo según ruta actual
- Colapsable en dispositivos móviles
- Overlay para móviles
- Desplazable con altura fija
- Usa `useApp` y `useLocation`

**Módulos incluidos:**
- Dashboard, Productos, Clientes, Ventas, Compras, Pedidos
- Usuarios, Proveedores, Roles, Permisos
- Domiciliarios, Rutas, Zonas, Cronogramas
- Pérdidas, Categorías, Estado Venta

---

### 3. **Table.jsx** - Tabla Reutilizable
Componente de tabla responsiva con soporte para datos y acciones personalizadas.

```jsx
import { Table } from '@/components/common';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'email', label: 'Email', render: (value) => <a href={`mailto:${value}`}>{value}</a> }
];

const data = [
  { id: 1, nombre: 'Juan', email: 'juan@example.com' },
  { id: 2, nombre: 'María', email: 'maria@example.com' }
];

<Table 
  columns={columns} 
  data={data}
  onRowClick={(row) => console.log(row)}
  loading={false}
/>
```

**Props:**
- `columns` (Array): Definiciones de columnas `{key, label, render?, sortable?}`
- `data` (Array): Datos a mostrar
- `onRowClick` (Function): Callback al hacer clic en fila
- `loading` (boolean): Estado de carga

**Características:**
- Filas alternadas (striped)
- Efecto hover
- Estado vacío
- Loader personalizado
- Soporte para render personalizado

---

### 4. **Modal.jsx** - Diálogo Modal
Componente modal reutilizable con portal.

```jsx
import { Modal } from '@/components/common';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Abrir Modal</button>
      <Modal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Título del Modal"
        size="md"
      >
        <p>Contenido del modal</p>
      </Modal>
    </>
  );
}
```

**Props:**
- `isOpen` (boolean): Si el modal está abierto
- `onClose` (Function): Callback para cerrar
- `title` (string): Título del modal
- `children` (ReactNode): Contenido
- `size` (string): 'sm' | 'md' | 'lg' (default: 'md')

**Características:**
- Backdrop con click-to-close
- Botón de cierre (X)
- Portal para renderización
- Previene scroll del body
- Responsivo

---

### 5. **Button.jsx** - Botón Reutilizable
Botón con variantes, tamaños y estado de carga.

```jsx
import { Button } from '@/components/common';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>

<Button variant="danger" loading={isLoading}>
  Eliminar
</Button>
```

**Props:**
- `children` (ReactNode): Contenido del botón
- `variant` (string): 'primary' | 'secondary' | 'success' | 'danger' (default: 'primary')
- `size` (string): 'sm' | 'md' | 'lg' (default: 'md')
- `disabled` (boolean): Si está deshabilitado
- `loading` (boolean): Estado de carga
- `onClick` (Function): Callback al hacer clic
- `type` (string): Tipo HTML (default: 'button')
- `className` (string): Clases adicionales

**Características:**
- Spinner durante carga
- Estados visuales para disabled/loading
- Focus ring
- Transiciones suaves

---

### 6. **Input.jsx** - Campo de Entrada
Componente de input con validación y error display.

```jsx
import { Input } from '@/components/common';
import { useState } from 'react';

function MyComponent() {
  const [formData, setFormData] = useState({ email: '' });
  const [errors, setErrors] = useState({});
  
  return (
    <Input
      name="email"
      label="Correo Electrónico"
      type="email"
      value={formData.email}
      onChange={(e) => setFormData({ email: e.target.value })}
      error={errors.email}
      placeholder="tu@email.com"
      required
    />
  );
}
```

**Props:**
- `name` (string): Nombre del campo
- `label` (string): Etiqueta
- `type` (string): Tipo de input (default: 'text')
- `value` (string): Valor
- `onChange` (Function): Callback onChange
- `error` (string): Mensaje de error
- `placeholder` (string): Placeholder
- `required` (boolean): Campo requerido
- `disabled` (boolean): Deshabilitado
- `className` (string): Clases adicionales

**Características:**
- Indicador de requerido (*)
- Error styling rojo
- Focus ring azul
- Disabled styling

---

### 7. **Select.jsx** - Selector Desplegable
Componente select con opciones y validación.

```jsx
import { Select } from '@/components/common';
import { useState } from 'react';

function MyComponent() {
  const [role, setRole] = useState('');
  
  return (
    <Select
      name="role"
      label="Rol"
      options={[
        { value: 'admin', label: 'Administrador' },
        { value: 'user', label: 'Usuario' },
        { value: 'viewer', label: 'Visor' }
      ]}
      value={role}
      onChange={(e) => setRole(e.target.value)}
      placeholder="Seleccionar rol"
      required
    />
  );
}
```

**Props:**
- `name` (string): Nombre del campo
- `label` (string): Etiqueta
- `options` (Array): Opciones `{value, label}`
- `value` (string|number): Valor seleccionado
- `onChange` (Function): Callback onChange
- `error` (string): Mensaje de error
- `placeholder` (string): Placeholder
- `required` (boolean): Campo requerido
- `disabled` (boolean): Deshabilitado
- `className` (string): Clases adicionales

**Características:**
- Icono de dropdown
- Error styling
- Indicador de requerido (*)
- Appearance none para consistencia

---

### 8. **Card.jsx** - Contenedor de Tarjeta
Componente de tarjeta con encabezado y acciones.

```jsx
import { Card } from '@/components/common';

<Card
  title="Información del Producto"
  actions={[
    { label: 'Editar', onClick: handleEdit },
    { label: 'Eliminar', onClick: handleDelete, variant: 'danger' }
  ]}
>
  <p>Contenido de la tarjeta</p>
</Card>
```

**Props:**
- `title` (string): Título de la tarjeta
- `children` (ReactNode): Contenido
- `actions` (Array): Acciones `{label, onClick, variant?}`
- `className` (string): Clases adicionales

**Características:**
- Encabezado con título
- Botones de acción
- Sombra y esquinas redondeadas
- Borde separador
- Flexibilidad en layout

---

### 9. **LoadingSpinner.jsx** - Indicador de Carga
Spinner de carga animado.

```jsx
import { LoadingSpinner } from '@/components/common';

<LoadingSpinner size="md" color="blue" />
```

**Props:**
- `size` (string): 'sm' | 'md' | 'lg' (default: 'md')
- `color` (string): 'blue' | 'green' | 'red' | 'gray' (default: 'blue')
- `className` (string): Clases adicionales

**Características:**
- Animación de rotación suave
- Tamaños personalizables
- Colores variados
- Centrado

---

### 10. **ErrorAlert.jsx** - Alerta de Error
Componente de alerta para mostrar errores.

```jsx
import { ErrorAlert } from '@/components/common';
import { useState } from 'react';

function MyComponent() {
  const [error, setError] = useState('');
  
  return (
    <ErrorAlert
      message={error}
      onClose={() => setError('')}
      autoClose={5000}
    />
  );
}
```

**Props:**
- `message` (string): Mensaje de error
- `onClose` (Function): Callback para cerrar
- `autoClose` (number): Tiempo en ms para cerrar automáticamente (0 = no cierra) (default: 5000)
- `className` (string): Clases adicionales

**Características:**
- Ícono de error
- Fondo rojo claro
- Botón de cierre manual
- Auto-cierre opcional
- Rol de alerta para accesibilidad

---

### 11. **ConfirmDialog.jsx** - Diálogo de Confirmación
Componente de diálogo para confirmar acciones.

```jsx
import { ConfirmDialog } from '@/components/common';
import { useState } from 'react';

function MyComponent() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleDelete = async () => {
    setLoading(true);
    // ... hacer algo
    setLoading(false);
    setShowConfirm(false);
  };
  
  return (
    <>
      <button onClick={() => setShowConfirm(true)}>Eliminar</button>
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Eliminar Producto"
        message="¿Estás seguro de que deseas eliminar este producto?"
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loading={loading}
      />
    </>
  );
}
```

**Props:**
- `isOpen` (boolean): Si el diálogo está abierto
- `onClose` (Function): Callback al cancelar
- `onConfirm` (Function): Callback al confirmar
- `title` (string): Título (default: '¿Estás seguro?')
- `message` (string): Mensaje (default: '¿Deseas continuar con esta acción?')
- `confirmText` (string): Texto del botón confirmar (default: 'Confirmar')
- `cancelText` (string): Texto del botón cancelar (default: 'Cancelar')
- `loading` (boolean): Estado de carga

**Características:**
- Usa Modal internamente
- Botones de cancelar/confirmar
- Estado de carga en botón confirmar
- Confirmación visual con colores

---

## 🎨 Estilos y Tailwind CSS

Todos los componentes utilizan **Tailwind CSS** para estilos. Los colores principales son:
- **Azul** (primary): `from-blue-600 to-blue-800`
- **Rojo** (danger): `red-600/700`
- **Verde** (success): `green-600/700`
- **Gris** (secondary): `gray-300/400`

## 🔗 Importación

Puedes importar componentes de dos formas:

```jsx
// Opción 1: Importar desde index
import { Navbar, Sidebar, Table, Button } from '@/components/common';

// Opción 2: Importar directamente
import Navbar from '@/components/common/Navbar';
import Button from '@/components/common/Button';
```

## 📝 Convenciones

Todos los componentes siguen estas convenciones:
- Componentes funcionales con Hooks
- JSDoc comments en español
- Tailwind CSS para estilos
- Props con valores por defecto
- Destructuring de props
- Manejo de estados locales con `useState`
- Callbacks nombrados (handleXxx, onXxx)

## 🚀 Uso en Contexto

Algunos componentes usan el contexto `AppContext`:
- **Navbar**: Obtiene user, logout, toggleSidebar
- **Sidebar**: Obtiene sidebarOpen, toggleSidebar

Asegúrate de que el contexto esté disponible en tu aplicación:

```jsx
import { AppProvider } from '@/context/AppContext';

function App() {
  return (
    <AppProvider>
      <YourApp />
    </AppProvider>
  );
}
```

## 📱 Responsividad

Los componentes son completamente responsivos:
- **Móvil**: Los menús se cierran automáticamente
- **Tablet**: Interfaz adaptada
- **Desktop**: Experiencia completa

## ♿ Accesibilidad

Los componentes incluyen:
- Atributos `aria-label` en botones
- Roles ARIA (`role="alert"`)
- Labels asociados a inputs
- Navegación por teclado

## 🔒 Seguridad

- Validación de props
- Sanitización de contenido
- Manejo seguro de eventos
- Sin eval() o innerHTML

---

**Versión**: 1.0.0
**Última actualización**: 2024
**Compatibilidad**: React 18+, Tailwind CSS 3+
