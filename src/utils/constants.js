/**
 * Constantes de la aplicación
 * 
 * Define todas las constantes utilizadas en la aplicación:
 * - Estados de pedidos, ventas, etc.
 * - Roles y permisos
 * - Configuraciones generales
 */

// Información de la aplicación
export const APP_NAME = 'FrontDistriExpress';
export const APP_VERSION = '1.0.0';

// Estados de pedidos
export const ESTADOS_PEDIDO = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En Proceso',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
};

// Estados de ventas
export const ESTADOS_VENTA = {
  PENDIENTE: 'Pendiente',
  PAGADA: 'Pagada',
  CANCELADA: 'Cancelada',
};

// Tipos de movimiento de inventario
export const TIPOS_MOVIMIENTO = {
  ENTRADA: 'entrada',
  SALIDA: 'salida',
};

// Roles del sistema
export const ROLES = {
  ADMIN: 'Administrador',
  VENDEDOR: 'Vendedor',
  DOMICILIARIO: 'Domiciliario',
  ALMACENISTA: 'Almacenista',
};

// Módulos del sistema
export const MODULOS = {
  PRODUCTOS: 'productos',
  CLIENTES: 'clientes',
  VENTAS: 'ventas',
  COMPRAS: 'compras',
  PEDIDOS: 'pedidos',
  USUARIOS: 'usuarios',
  PROVEEDORES: 'proveedores',
  ROLES: 'roles',
  PERMISOS: 'permisos',
  DOMICILIARIOS: 'domiciliarios',
  RUTAS: 'rutas',
  ZONAS: 'zonas',
  CRONOGRAMAS: 'cronogramas',
  PERDIDAS: 'perdidas',
  CATEGORIAS: 'categorias',
  ESTADO_VENTA: 'estado-venta',
};

// Permisos del sistema
export const PERMISOS = {
  CREAR: 'crear',
  LEER: 'leer',
  ACTUALIZAR: 'actualizar',
  ELIMINAR: 'eliminar',
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Formato de fechas
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';

// Mensajes del sistema
export const MESSAGES = {
  SUCCESS: {
    CREATE: 'Registro creado exitosamente',
    UPDATE: 'Registro actualizado exitosamente',
    DELETE: 'Registro eliminado exitosamente',
  },
  ERROR: {
    GENERIC: 'Ha ocurrido un error. Por favor intente nuevamente',
    NETWORK: 'Error de conexión. Verifique su conexión a internet',
    AUTH: 'Sesión expirada. Por favor inicie sesión nuevamente',
    PERMISSION: 'No tiene permisos para realizar esta acción',
  },
  CONFIRM: {
    DELETE: '¿Está seguro que desea eliminar este registro?',
    CANCEL: '¿Está seguro que desea cancelar esta operación?',
  },
};

// Validaciones
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10}$/,
  NIT_REGEX: /^[0-9]{9,10}$/,
};

// Colores del tema
export const THEME_COLORS = {
  PRIMARY: '#1890ff',
  SUCCESS: '#52c41a',
  WARNING: '#faad14',
  ERROR: '#f5222d',
  INFO: '#1890ff',
};
