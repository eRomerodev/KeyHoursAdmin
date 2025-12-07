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
    
    // Validar campos básicos
    if (!formData.usuario.trim() || !formData.password.trim()) {
      setError("Por favor, completa el usuario y la contraseña");
      return;
    }
    
    // Determinar si es login de admin (sin carnet) o estudiante (con carnet)
    const hasCarnet = formData.carnet.trim() !== "";
    
    // Para estudiantes, validar que tenga carnet
    // Para admins, el carnet puede estar vacío
    // Si el usuario completa el carnet, validar que no esté vacío
    if (hasCarnet && formData.carnet.trim().length < 3) {
      setError("La matrícula debe tener al menos 3 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({
        usuario: formData.usuario,
        carnet: hasCarnet ? formData.carnet : undefined,
        password: formData.password,
        isAdmin: !hasCarnet,
      });

      // Redirigir según el tipo de usuario detectado por el backend
      if (response.user.user_type === "admin") {
        navigate("/admin/dashboard");
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
        <div className="flex items-center gap-3">
          <span className="text-[64px] font-extrabold tracking-tight leading-none">key</span>
          <span className="rounded-full bg-[#1a6cff] px-4 py-1.5 text-[30px] font-extrabold leading-none text-[#e9f2ff]">
            HOURS
          </span>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex w-[320px] flex-col rounded-[36px] bg-white px-8 py-10 text-black shadow-lg md:w-[360px]">
          
          <label className="mb-1 font-medium" htmlFor="carnet">
            carnet: <span className="text-gray-400 text-xs">(opcional para administradores)</span>
          </label>
          <input
            id="carnet"
            name="carnet"
            type="text"
            value={formData.carnet}
            onChange={handleInputChange}
            className="mb-4 border-b border-gray-500 bg-transparent px-1 py-1 outline-none focus:border-black"
            placeholder="Dejar vacío si eres administrador"
          />

          <label className="mb-1 font-medium" htmlFor="usuario">
            usuario: <span className="text-red-500">*</span>
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

          <label className="mb-1 font-medium" htmlFor="password">
            password: <span className="text-red-500">*</span>
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
