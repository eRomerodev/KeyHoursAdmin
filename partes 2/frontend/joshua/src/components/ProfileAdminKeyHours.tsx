import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService, User } from "../services/authService";
import "./ProfileAdminKeyHours.css";


/**
 * KeyHours – Admin Profile Page (React + TypeScript + Tailwind)
 * Guarda como src/components/ProfileAdminKeyHours.tsx
 */


const ProfileAdminKeyHours: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = authService.getUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);

    // Crear y aplicar estilos CSS globales para ocultar scrollbar
    const styleId = 'profile-admin-scrollbar-hide';
    let existingStyle = document.getElementById(styleId);
    
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        html, body {
          overflow: hidden !important;
          height: 100vh !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        
        html::-webkit-scrollbar, body::-webkit-scrollbar {
          width: 0px !important;
          background: transparent !important;
          display: none !important;
        }
        
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        
        *::-webkit-scrollbar {
          width: 0px !important;
          background: transparent !important;
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Cleanup function para remover los estilos
    return () => {
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
    };
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#d9d9d9] flex items-center justify-center">
        <div className="text-[24px] font-semibold text-black">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="profile-admin-page h-screen bg-[#d9d9d9] overflow-hidden">
      {/* Header */}
      <header className="flex w-full items-center justify-between bg-[#d9d9d9] px-8 py-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="w-[56px] h-[56px]">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path
                d="M30 6 v20 L12 14 l-6 10 18 10 -18 10 6 10 18 -12 v20 h12 v-20 l18 12 6 -10 -18-10 18-10 -6-10 -18 12 V6 H30z"
                fill="#000"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[28px] font-extrabold tracking-tight text-black leading-none">key</span>
            <span className="text-[12px] font-medium tracking-wide text-black uppercase">
              Instituto Kriete de<br />Ingeniería y Ciencias
            </span>
          </div>
        </div>


        {/* Perfil */}
        <div className="flex items-center gap-4">
          <div className="w-[44px] h-[44px] rounded-full bg-black" />
          <span className="text-[16px] font-semibold text-black">{user.full_name}</span>
          <button 
            onClick={handleLogout}
            className="text-[14px] text-red-600 hover:text-red-800 transition"
          >
            Logout
          </button>
        </div>
      </header>


      {/* Main Content */}
      <div className="flex h-[calc(100vh-88px)] overflow-hidden">
        {/* Sidebar - Eliminado los botones de navegación sin funcionalidad */}
        <aside className="profile-admin-sidebar w-[240px] bg-[#bfbfbf] px-6 py-8">
          {/* Sidebar vacío - solo para mantener el layout */}
        </aside>


        {/* Content Area */}
        <main className="profile-admin-main flex-1 p-8 overflow-y-auto overflow-x-hidden">
          <div className="mb-8">
            <h1 className="text-[32px] font-bold text-black mb-2">Perfil de {user.full_name}</h1>
            <p className="text-[16px] text-black/70">Cuenta de Administrador</p>
          </div>


          {/* Profile Card */}
          <div className="bg-white rounded-lg p-8 shadow-sm max-w-2xl">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-[120px] h-[120px] rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-[48px] text-gray-600">👤</span>
              </div>
              <div>
                <h2 className="text-[24px] font-bold text-black mb-2">{user.full_name}</h2>
                <p className="text-[16px] text-gray-600 mb-1">{user.email}</p>
                <p className="text-[14px] text-gray-500">Administrador</p>
              </div>
            </div>


            {/* Profile Form */}
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[14px] font-medium text-black mb-2">Nombre</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black"
                    defaultValue={user.first_name}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-black mb-2">Apellido</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black"
                    defaultValue={user.last_name}
                    readOnly
                  />
                </div>
              </div>


              <div>
                <label className="block text-[14px] font-medium text-black mb-2">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black"
                  defaultValue={user.email}
                  readOnly
                />
              </div>


              <div>
                <label className="block text-[14px] font-medium text-black mb-2">Carnet</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black"
                  defaultValue={user.carnet}
                  readOnly
                />
              </div>


              <div>
                <label className="block text-[14px] font-medium text-black mb-2">Tipo de Usuario</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black"
                  defaultValue={user.user_type}
                  readOnly
                />
              </div>


              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};


export default ProfileAdminKeyHours;
