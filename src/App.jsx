// src/App.jsx
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Sidebar from "./components/Sidebar";

export default function App() {
  const location = useLocation();
  const isAccessPage = location.pathname === "/accesos";

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      {/* NAV LATERAL - No mostrar en página de acceso */}
      {!isAccessPage && <Sidebar />}

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1">
        {/* ajustamos padding para que no quede tan lejos del top */}
        <main className="px-6 py-4">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}
