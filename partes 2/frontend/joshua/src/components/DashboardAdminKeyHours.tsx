import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Plus } from "lucide-react";
import { authService } from "../services/authService";
import { projectService, Project } from "../services/projectService";


/**
 * KeyHours – Admin Dashboard (React + TypeScript + Tailwind)
 * Guarda como src/components/DashboardAdminKeyHours.tsx
 */


const DashboardAdminKeyHours: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = authService.getUser();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
      setError("");
    } catch (err) {
      console.error("Error loading projects:", err);
      setError("Error al cargar proyectos");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/admin/project/${projectId}`);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="flex w-full items-center justify-between bg-white px-8 py-6 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="w-[120px] h-[40px]">
            <img
              src="/logo-key-hours.jpg"
              alt="KEY HOURS"
              className="w-full h-full object-contain"
            />
          </div>
        </div>


        {/* Perfil */}
        <div className="flex items-center gap-4">
          <div className="w-[44px] h-[44px] rounded-full bg-black flex items-center justify-center text-white text-[18px]">
            {user?.first_name?.[0] || "A"}
          </div>
          <span className="text-[16px] font-semibold text-black">{user?.full_name || "Admin"}</span>
          <button onClick={handleLogout} className="ml-4 text-[14px] text-gray-600 hover:text-black">
            Logout
          </button>
        </div>
      </header>


      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-88px)]">
        {/* Sidebar */}
        <aside className="w-[240px] bg-gradient-to-b from-slate-800 to-slate-900 px-6 py-8">
          {/* Logo en sidebar */}
          <div className="mb-8">
            <div className="w-[100px] h-[32px]">
              <img
                src="/logo-key-hours.jpg"
                alt="KEY HOURS"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <nav className="space-y-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[16px] font-medium transition bg-blue-600 text-white"
            >
              <span className="text-[18px]">📁</span>
              Projects
            </button>
            <button
              onClick={() => navigate("/admin/new-project")}
              className="mt-1 mb-3 flex h-[35px] w-[35px] items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 mx-auto"
            >
              <Plus size={18} />
            </button>
            <button
              onClick={() => navigate("/admin/students")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[16px] font-medium transition bg-transparent border border-white/30 text-white hover:bg-white/10 hover:border-white/50"
            >
              <span className="text-[18px]">👥</span>
              Students
            </button>
            <button
              onClick={() => navigate("/admin/profile")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[16px] font-medium transition bg-transparent border border-white/30 text-white hover:bg-white/10 hover:border-white/50"
            >
              <User size={18} className="text-white" />
              Perfil
            </button>
          </nav>
        </aside>


        {/* Content Area */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-[32px] font-bold text-white mb-2">Proyectos</h1>
            <p className="text-[16px] text-white/70">Bienvenido, {user?.full_name || "Administrador"}!</p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-[18px] text-white">Cargando proyectos...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-[24px] font-bold text-white mb-4">No hay proyectos</h3>
              <p className="text-[16px] text-white/70 mb-6">Crea tu primer proyecto para comenzar</p>
              <button
                onClick={() => navigate("/admin/new-project")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Crear Proyecto
              </button>
            </div>
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {projects.map((project: any, index: number) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project.id)}
                  className="relative h-[200px] rounded-sm text-black shadow-md overflow-hidden cursor-pointer transition hover:shadow-lg"
                  style={{ backgroundColor: projectService.getProjectColor(index) }}
                >
                  <button className="absolute right-2 top-1 text-2xl font-bold text-black/70 hover:text-black">
                    ...
                  </button>
                  <div className="absolute bottom-0 left-0 w-full bg-[#d9d9d9] px-3 py-2 text-[18px] font-medium">
                    {project.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};


export default DashboardAdminKeyHours;
