import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

/**
 * Sistema de Login Unificado - Una sola página para estudiantes y administradores
 * Elimina el doble login y simplifica el proceso
 */

const bgStyle: React.CSSProperties = {
  background:
    "radial-gradient(1200px 700px at 75% -10%, rgba(76,76,255,0.35), transparent 60%), linear-gradient(110deg, #07070a 0%, #0f1020 25%, #18194a 55%, #2c2eff 100%)",
  borderRadius: 16,
};

const UnifiedLogin: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'student' | 'admin'>('student');
  const [formData, setFormData] = useState({
    usuario: "",
    carnet: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login({
        usuario: formData.usuario,
        carnet: userType === 'student' ? formData.carnet : undefined,
        password: formData.password,
        isAdmin: userType === 'admin',
      });

      // Redirigir según el tipo de usuario detectado por el backend
      if (response.user.user_type === "admin") {
        navigate("/admin/dashboard-new");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario escriba
    if (error) setError('');
  };

  return (
    <section
      className="flex min-h-screen w-full items-center justify-center px-4 py-10 text-white"
      style={bgStyle}
    >
      <div className="flex w-full max-w-[1000px] flex-col items-center justify-between gap-10 md:flex-row md:gap-20">
        {/* Logo + Marca */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-[90px] h-[90px] md:w-[120px] md:h-[120px]">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path
                d="M30 6 v20 L12 14 l-6 10 18 10 -18 10 6 10 18 -12 v20 h12 v-20 l18 12 6 -10 -18-10 18-10 -6-10 -18 12 V6 H30z"
                fill="#fff"
              />
            </svg>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[64px] font-extrabold tracking-tight leading-none">key</span>
            <span className="rounded-full bg-[#1a6cff] px-4 py-1.5 text-[30px] font-extrabold leading-none text-[#e9f2ff]">
              HOURS
            </span>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex w-[320px] flex-col rounded-[36px] bg-white px-8 py-10 text-black shadow-lg md:w-[360px]">
          
          {/* Selector de tipo de usuario */}
          <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setUserType('student')}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                userType === 'student'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Estudiante
            </button>
            <button
              type="button"
              onClick={() => setUserType('admin')}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                userType === 'admin'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Administrador
            </button>
          </div>

          <label className="mb-1 font-medium" htmlFor="usuario">
            usuario:
          </label>
          <input
            id="usuario"
            name="usuario"
            type="text"
            value={formData.usuario}
            onChange={handleInputChange}
            className="mb-4 border-b border-gray-500 bg-transparent px-1 py-1 outline-none focus:border-black"
            required
          />

          {/* Campo carnet solo para estudiantes */}
          {userType === 'student' && (
            <>
              <label className="mb-1 font-medium" htmlFor="carnet">
                carnet:
              </label>
              <input
                id="carnet"
                name="carnet"
                type="text"
                value={formData.carnet}
                onChange={handleInputChange}
                className="mb-4 border-b border-gray-500 bg-transparent px-1 py-1 outline-none focus:border-black"
                required
              />
            </>
          )}

          <label className="mb-1 font-medium" htmlFor="password">
            password:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mb-6 border-b border-gray-500 bg-transparent px-1 py-1 outline-none focus:border-black"
            required
          />

          {error && (
            <div className="mb-4 text-center text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-black py-2 text-white transition hover:bg-[#1a6cff] disabled:opacity-50"
          >
            {loading ? "Iniciando sesión..." : "enter"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UnifiedLogin;
