/**
 * Componente principal de la aplicación
 * 
 * Configura:
 * - Enrutamiento de la aplicación
 * - Proveedores de contexto
 * - Rutas protegidas
 * - Layout principal
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Layout components
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Módulos de páginas
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

/**
 * Componente para rutas protegidas
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

/**
 * Layout principal de la aplicación
 */
const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

/**
 * Componente de rutas de la aplicación
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta de login */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Módulos */}
      <Route path="/productos" element={<ProtectedRoute><MainLayout><ProductosPage /></MainLayout></ProtectedRoute>} />
      <Route path="/clientes" element={<ProtectedRoute><MainLayout><ClientesPage /></MainLayout></ProtectedRoute>} />
      <Route path="/ventas" element={<ProtectedRoute><MainLayout><VentasPage /></MainLayout></ProtectedRoute>} />
      <Route path="/compras" element={<ProtectedRoute><MainLayout><ComprasPage /></MainLayout></ProtectedRoute>} />
      <Route path="/pedidos" element={<ProtectedRoute><MainLayout><PedidosPage /></MainLayout></ProtectedRoute>} />
      <Route path="/usuarios" element={<ProtectedRoute><MainLayout><UsuariosPage /></MainLayout></ProtectedRoute>} />
      <Route path="/proveedores" element={<ProtectedRoute><MainLayout><ProveedoresPage /></MainLayout></ProtectedRoute>} />
      <Route path="/roles" element={<ProtectedRoute><MainLayout><RolesPage /></MainLayout></ProtectedRoute>} />
      <Route path="/permisos" element={<ProtectedRoute><MainLayout><PermisosPage /></MainLayout></ProtectedRoute>} />
      <Route path="/domiciliarios" element={<ProtectedRoute><MainLayout><DomiciliariosPage /></MainLayout></ProtectedRoute>} />
      <Route path="/rutas" element={<ProtectedRoute><MainLayout><RutasPage /></MainLayout></ProtectedRoute>} />
      <Route path="/zonas" element={<ProtectedRoute><MainLayout><ZonasPage /></MainLayout></ProtectedRoute>} />
      <Route path="/cronogramas" element={<ProtectedRoute><MainLayout><CronogramasPage /></MainLayout></ProtectedRoute>} />
      <Route path="/perdidas" element={<ProtectedRoute><MainLayout><PerdidasPage /></MainLayout></ProtectedRoute>} />
      <Route path="/categorias" element={<ProtectedRoute><MainLayout><CategoriasPage /></MainLayout></ProtectedRoute>} />
      <Route path="/estado-venta" element={<ProtectedRoute><MainLayout><EstadoVentaPage /></MainLayout></ProtectedRoute>} />

      {/* Ruta 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

/**
 * Componente principal App
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
