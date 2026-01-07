// src/pages/Access.jsx
import { useState } from "react";
import { FiLock, FiMail, FiKey, FiLogOut } from "react-icons/fi";

export default function Access() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  const [showRecover, setShowRecover] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState("");
  const [recoverMsg, setRecoverMsg] = useState("");

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!validateEmail(email.trim())) {
      newErrors.email = "Ingresa un correo válido.";
    }

    if (!password.trim()) {
      newErrors.password = "La contraseña es obligatoria.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // Como no hay BD, cualquier correo/contraseña válidos "inician sesión"
    setLoggedIn(true);
    setRecoverMsg("");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setPassword("");
  };

  const handleRecover = (e) => {
    e.preventDefault();
    setRecoverMsg("");

    if (!recoverEmail.trim()) {
      setRecoverMsg("Debes ingresar tu correo para recuperar la contraseña.");
      return;
    }
    if (!validateEmail(recoverEmail.trim())) {
      setRecoverMsg("Ingresa un correo válido.");
      return;
    }

    // Simulación de envío
    setRecoverMsg(
      "Si el correo existe en el sistema, recibirás un enlace para restablecer tu contraseña."
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-3">
            <FiLock className="text-yellow-400 text-2xl" />
          </div>
          <h1 className="text-xl font-semibold text-white">
            Iniciar Sesión
          </h1>
          <p className="text-xs text-neutral-400 mt-1 text-center">
            Accede al sistema de gestión
          </p>
        </div>

        {/* Si está logueado, mensaje + botón de cerrar sesión */}
        {loggedIn ? (
          <div className="space-y-5">
            <div className="bg-green-900/30 border border-green-700 rounded-xl px-4 py-3 text-sm text-green-200">
              Has iniciado sesión como{" "}
              <span className="font-semibold">{email}</span>.
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-black font-semibold py-2.5 rounded-xl transition"
            >
              <FiLogOut />
              Cerrar sesión
            </button>
          </div>
        ) : (
          <>
            {/* FORMULARIO LOGIN */}
            <form className="space-y-4 mb-4" onSubmit={handleLogin}>
              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-neutral-300">
                  Usuario o Email <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 focus-within:border-green-500">
                  <FiMail className="text-neutral-400" />
                  <input
                    type="email"
                    className="w-full bg-transparent outline-none text-sm text-neutral-100 placeholder-neutral-500"
                    placeholder="admin@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && (
                  <span className="text-xs text-red-400">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-neutral-300">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 focus-within:border-green-500">
                  <FiKey className="text-neutral-400" />
                  <input
                    type="password"
                    className="w-full bg-transparent outline-none text-sm text-neutral-100 placeholder-neutral-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {errors.password && (
                  <span className="text-xs text-red-400">
                    {errors.password}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-black font-semibold py-2.5 rounded-xl shadow-md transition mt-2"
              >
                Iniciar sesión
              </button>
            </form>

            {/* RECUPERAR CONTRASEÑA */}
            <button
              type="button"
              onClick={() => setShowRecover((v) => !v)}
              className="w-full text-xs text-green-400 hover:text-green-300 underline mb-4 text-center"
            >
              ¿Olvidaste tu contraseña?
            </button>

            {showRecover && (
              <form
                onSubmit={handleRecover}
                className="bg-neutral-800/70 border border-neutral-700 rounded-xl p-4 space-y-3 mb-4"
              >
                <p className="text-xs text-neutral-300 font-medium mb-1">
                  Recuperar contraseña
                </p>
                <input
                  type="email"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 outline-none focus:border-green-500"
                  placeholder="Ingresa tu correo"
                  value={recoverEmail}
                  onChange={(e) => setRecoverEmail(e.target.value)}
                />
                {recoverMsg && (
                  <p className="text-[11px] text-neutral-300">
                    {recoverMsg}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full text-xs bg-neutral-700 hover:bg-neutral-600 text-neutral-100 py-2 rounded-lg transition"
                >
                  Enviar instrucciones
                </button>
              </form>
            )}
          </>
        )}

        {/* Usuarios de prueba (solo decorativo) */}
        <div className="mt-4 text-[11px] text-neutral-400 bg-neutral-900 border border-neutral-800 rounded-xl p-3 space-y-1">
          <p className="font-semibold text-neutral-300 mb-1">
            Usuarios de prueba:
          </p>
          <p>• admin@empresa.com / admin123</p>
          <p>• gerente@empresa.com / gerente123</p>
          <p>• vendedor@empresa.com / vendedor123</p>
        </div>
      </div>
    </div>
  );
}
