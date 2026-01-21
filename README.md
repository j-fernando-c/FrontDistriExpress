# FrontDistriExpress

Sistema de gestión de distribución y ventas desarrollado con React + Vite. Aplicación frontend moderna para la gestión completa de productos, clientes, ventas, pedidos, rutas de distribución y más.

## 🚀 Características

- **Gestión de Productos**: Control de inventario, categorías y stock
- **Gestión de Clientes**: Administración de clientes y sus datos
- **Ventas y Pedidos**: Registro y seguimiento de ventas y pedidos
- **Rutas y Domicilios**: Gestión de rutas de distribución y domiciliarios
- **Usuarios y Permisos**: Sistema de autenticación con roles y permisos
- **Proveedores y Compras**: Administración de proveedores y compras
- **Reportes**: Estadísticas y reportes de ventas, pérdidas y más
- **Responsive**: Diseño adaptable a todos los dispositivos
- **Interfaz Moderna**: UI/UX intuitiva con Tailwind CSS

## 📋 Requisitos Previos

- Node.js >= 16.0.0
- npm >= 8.0.0
- Backend API ejecutándose en http://localhost:3000

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd FrontDistriExpress
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz del proyecto:
```bash
cp .env.example .env
```

Editar el archivo `.env` con la configuración adecuada:
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=FrontDistriExpress
VITE_APP_VERSION=1.0.0
```

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter para verificar código

## 📁 Estructura del Proyecto

```
FrontDistriExpress/
├── public/                 # Archivos estáticos
├── src/
│   ├── api/               # Servicios API (21 servicios)
│   │   ├── axiosConfig.js
│   │   ├── categoriaProductosService.js
│   │   ├── clientesService.js
│   │   ├── comprasService.js
│   │   ├── cronogramasService.js
│   │   ├── detalleCompraService.js
│   │   ├── detallePedidosService.js
│   │   ├── detallePermisosService.js
│   │   ├── detalleVentasService.js
│   │   ├── domiciliariosService.js
│   │   ├── entradasSalidasService.js
│   │   ├── estadoVentaService.js
│   │   ├── pedidosService.js
│   │   ├── perdidasService.js
│   │   ├── permisosService.js
│   │   ├── productosService.js
│   │   ├── proveedoresService.js
│   │   ├── rolesService.js
│   │   ├── rutasService.js
│   │   ├── usuariosService.js
│   │   ├── ventasService.js
│   │   └── zonasService.js
│   │
│   ├── components/
│   │   ├── common/       # Componentes reutilizables (11 componentes)
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── ErrorAlert.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Table.jsx
│   │   │
│   │   └── modules/      # Componentes específicos de módulos
│   │
│   ├── context/          # Contextos de React
│   │   ├── AuthContext.jsx
│   │   └── AppContext.jsx
│   │
│   ├── hooks/            # Custom hooks (4 hooks)
│   │   ├── useApi.js
│   │   ├── useFetch.js
│   │   ├── useForm.js
│   │   └── useToggle.js
│   │
│   ├── pages/            # Páginas de la aplicación (18 páginas)
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── productos/
│   │   │   └── ProductosPage.jsx
│   │   ├── clientes/
│   │   │   └── ClientesPage.jsx
│   │   ├── ventas/
│   │   │   └── VentasPage.jsx
│   │   ├── compras/
│   │   │   └── ComprasPage.jsx
│   │   ├── pedidos/
│   │   │   └── PedidosPage.jsx
│   │   ├── usuarios/
│   │   │   └── UsuariosPage.jsx
│   │   ├── proveedores/
│   │   │   └── ProveedoresPage.jsx
│   │   ├── roles/
│   │   │   └── RolesPage.jsx
│   │   ├── permisos/
│   │   │   └── PermisosPage.jsx
│   │   ├── domiciliarios/
│   │   │   └── DomiciliariosPage.jsx
│   │   ├── rutas/
│   │   │   └── RutasPage.jsx
│   │   ├── zonas/
│   │   │   └── ZonasPage.jsx
│   │   ├── cronogramas/
│   │   │   └── CronogramasPage.jsx
│   │   ├── perdidas/
│   │   │   └── PerdidasPage.jsx
│   │   ├── categorias/
│   │   │   └── CategoriasPage.jsx
│   │   └── estado-venta/
│   │       └── EstadoVentaPage.jsx
│   │
│   ├── utils/            # Utilidades
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   │
│   ├── App.jsx           # Componente principal
│   ├── main.jsx          # Punto de entrada
│   └── index.css         # Estilos globales
│
├── .env.example          # Ejemplo de variables de entorno
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js     # Configuración de PostCSS
├── tailwind.config.js    # Configuración de Tailwind CSS
├── vite.config.js        # Configuración de Vite
└── README.md
```

## 🎨 Tecnologías Utilizadas

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router DOM v6** - Enrutamiento
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework de CSS
- **Context API** - Gestión de estado global

## 🔐 Autenticación

La aplicación utiliza JWT (JSON Web Tokens) para la autenticación:

1. El usuario inicia sesión en `/login`
2. El backend retorna un token JWT
3. El token se guarda en localStorage
4. Todas las peticiones incluyen el token en el header
5. El token se valida en cada petición

## 📱 Módulos Disponibles

### Gestión de Inventario
- **Productos**: CRUD completo de productos
- **Categorías**: Gestión de categorías de productos
- **Entradas/Salidas**: Control de movimientos de inventario
- **Pérdidas**: Registro de pérdidas de productos

### Gestión Comercial
- **Clientes**: Administración de clientes
- **Ventas**: Registro y seguimiento de ventas
- **Pedidos**: Gestión de pedidos
- **Compras**: Control de compras a proveedores
- **Proveedores**: Gestión de proveedores

### Gestión de Distribución
- **Domiciliarios**: Administración de personal de entrega
- **Rutas**: Definición de rutas de distribución
- **Zonas**: Gestión de zonas geográficas
- **Cronogramas**: Planificación de entregas

### Gestión de Usuarios
- **Usuarios**: Administración de usuarios del sistema
- **Roles**: Definición de roles
- **Permisos**: Asignación de permisos
- **Estados de Venta**: Gestión de estados

## 🎯 Características Técnicas

### Componentes Reutilizables
Todos los componentes están documentados con JSDoc en español:

```jsx
/**
 * Componente Button
 * @param {Object} props - Propiedades del componente
 * @param {string} props.variant - Variante del botón (primary, secondary, success, danger)
 * @param {boolean} props.loading - Estado de carga
 */
```

### Custom Hooks

- **useApi**: Manejo de llamadas API con estados
- **useFetch**: Fetch automático de datos
- **useForm**: Gestión de formularios y validación
- **useToggle**: Toggle de estados booleanos

### Validaciones

El sistema incluye validaciones completas:
- Email válido
- Teléfonos (formato colombiano)
- NIT
- Contraseñas seguras
- Campos requeridos
- Longitudes mínimas/máximas
- Números positivos

### Manejo de Errores

- Interceptores de Axios para errores globales
- Notificaciones contextuales
- Estados de error en componentes
- Redirección automática en errores 401

## 🌐 API Endpoints

La aplicación se conecta a los siguientes endpoints del backend:

```
Base URL: http://localhost:3000/api

Auth:
POST   /usuarios/login
POST   /usuarios/logout
GET    /usuarios/profile

Productos:
GET    /productos
GET    /productos/:id
POST   /productos
PUT    /productos/:id
DELETE /productos/:id

... (todos los demás módulos siguen el mismo patrón)
```

## 🎨 Personalización

### Colores del Tema

Los colores se pueden personalizar en `tailwind.config.js`:

```js
colors: {
  primary: {
    50: '#e6f7ff',
    500: '#1890ff',
    900: '#002766',
  },
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',
}
```

### Constantes

Editar `src/utils/constants.js` para modificar:
- Estados de pedidos y ventas
- Roles del sistema
- Mensajes del sistema
- Formatos de fecha
- Validaciones

## 🧪 Testing

Para ejecutar tests (cuando se implementen):

```bash
npm run test
```

## 📝 Mejores Prácticas

El código sigue las mejores prácticas de React:

- ✅ Componentes funcionales con Hooks
- ✅ Separación de lógica y presentación
- ✅ Custom hooks para reutilización
- ✅ PropTypes o TypeScript para tipos
- ✅ Código limpio y comentado
- ✅ Estructura de carpetas escalable
- ✅ Manejo de errores consistente
- ✅ Validación de formularios
- ✅ Responsive design

## 🚀 Despliegue

### Build para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

### Previsualización del Build

```bash
npm run preview
```

### Despliegue en Vercel/Netlify

1. Conectar el repositorio
2. Configurar las variables de entorno
3. Comando de build: `npm run build`
4. Directorio de output: `dist`

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Autores

- Equipo de Desarrollo FrontDistriExpress

## 📧 Contacto

Para soporte o preguntas, contactar a: soporte@frontdistriexpress.com

## 🙏 Agradecimientos

- React Team por la excelente librería
- Vercel por Vite
- Tailwind Labs por Tailwind CSS
- Comunidad open source

---

⭐️ Si este proyecto te fue útil, considera darle una estrella en GitHub!
