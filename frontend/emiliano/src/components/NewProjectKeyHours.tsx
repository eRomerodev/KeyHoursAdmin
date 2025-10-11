import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { projectService, CreateProjectData } from "../services/projectService";


/**
 * KeyHours – New Project Form (React + TypeScript + Tailwind)
 * Guarda como src/components/NewProjectKeyHours.tsx
 */


const NewProjectKeyHours: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    max_hours: "",
    hour_assignment: "automatic" as "automatic" | "manual",
    automatic_hours: "",
    start_date: "",
    end_date: "",
    max_participants: "10",
    visibility: "unpublished" as "unpublished" | "convocatoria" | "published",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const projectData: CreateProjectData = {
        name: formData.name,
        description: formData.description,
        max_hours: parseInt(formData.max_hours),
        hour_assignment: formData.hour_assignment,
        automatic_hours: formData.hour_assignment === "automatic" ? parseInt(formData.automatic_hours) : undefined,
        visibility: formData.visibility,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        max_participants: parseInt(formData.max_participants),
      };

      await projectService.createProject(projectData);
      navigate("/admin/dashboard-new");
    } catch (err) {
      console.error("Error creating project:", err);
      setError(err instanceof Error ? err.message : "Error al crear proyecto");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-[#d9d9d9]">
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
          <div className="w-[44px] h-[44px] rounded-full bg-black flex items-center justify-center text-white text-[18px]">
            {user?.first_name?.[0] || "A"}
          </div>
          <span className="text-[16px] font-semibold text-black">{user?.full_name || "Admin"}</span>
          <button onClick={handleLogout} className="ml-4 text-[14px] text-gray-600 hover:text-black">
            Salir
          </button>
        </div>
      </header>


      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-88px)]">
        {/* Sidebar */}
        <aside className="w-[240px] bg-[#bfbfbf] px-6 py-8">
          <nav className="space-y-4">
            <button
              onClick={() => navigate("/admin/dashboard-new")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[16px] font-medium transition text-black hover:bg-[#a9a9a9]"
            >
              <span className="text-[18px]">📁</span>
              Projects
            </button>
            <button
              onClick={() => navigate("/admin/students-new")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[16px] font-medium transition text-black hover:bg-[#a9a9a9]"
            >
              <span className="text-[18px]">👥</span>
              Students
            </button>
            <button
              onClick={() => navigate("/admin/dashboard-new")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[16px] font-medium transition bg-[#a9a9a9] text-black"
            >
              <span className="text-[18px]">📋</span>
              Projects
            </button>
          </nav>
        </aside>


        {/* Content Area */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-[32px] font-bold text-black mb-2">New Project</h1>
            <p className="text-[16px] text-black/70">Create a new community service project</p>
          </div>


          {/* Project Form */}
          <div className="bg-white rounded-lg p-8 shadow-sm max-w-4xl">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[14px] font-medium text-black mb-2">Nombre del Proyecto*</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black"
                    placeholder="Ingresa el nombre del proyecto"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-black mb-2">Máximo de Participantes*</label>
                  <input
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black"
                    placeholder="10"
                    min="1"
                    required
                  />
                </div>
              </div>


              <div>
                <label className="block text-[14px] font-medium text-black mb-2">Descripción*</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black"
                  placeholder="Describe los objetivos y actividades del proyecto..."
                  required
                />
              </div>


              {/* Dates and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[14px] font-medium text-black mb-2">Fecha de Inicio*</label>
                  <input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-black mb-2">Fecha de Fin*</label>
                  <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-black mb-2">Horas Máximas*</label>
                  <input
                    type="number"
                    value={formData.max_hours}
                    onChange={(e) => setFormData({ ...formData, max_hours: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black"
                    placeholder="40"
                    min="1"
                    required
                  />
                </div>
              </div>


              {/* Hour Assignment */}
              <div>
                <label className="block text-[14px] font-medium text-black mb-2">Asignación de Horas*</label>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="hour_assignment"
                      value="automatic"
                      checked={formData.hour_assignment === "automatic"}
                      onChange={(e) => setFormData({ ...formData, hour_assignment: e.target.value as "automatic" | "manual" })}
                      className="h-4 w-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Automática</div>
                      {formData.hour_assignment === "automatic" && (
                        <input
                          type="number"
                          value={formData.automatic_hours}
                          onChange={(e) => setFormData({ ...formData, automatic_hours: e.target.value })}
                          className="mt-2 w-32 border border-gray-300 rounded px-2 py-1 text-black"
                          placeholder="Cantidad"
                          min="1"
                          required
                        />
                      )}
                      <p className="text-[12px] text-gray-600 mt-1">
                        Al completar el proyecto se asignará esta cantidad de horas
                      </p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="hour_assignment"
                      value="manual"
                      checked={formData.hour_assignment === "manual"}
                      onChange={(e) => setFormData({ ...formData, hour_assignment: e.target.value as "automatic" | "manual" })}
                      className="h-4 w-4"
                    />
                    <div>
                      <div className="font-medium">Manual</div>
                      <p className="text-[12px] text-gray-600">Se asignará según progreso individual</p>
                    </div>
                  </label>
                </div>
              </div>


              {/* Visibility */}
              <div>
                <label className="block text-[14px] font-medium text-black mb-2">Visibilidad*</label>
                <select
                  value={formData.visibility}
                  onChange={(e) => setFormData({ ...formData, visibility: e.target.value as "unpublished" | "convocatoria" | "published" })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black"
                >
                  <option value="unpublished">Unpublished</option>
                  <option value="convocatoria">Convocatoria</option>
                  <option value="published">Published</option>
                </select>
              </div>


              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50"
                >
                  {loading ? "Creando..." : "Crear Proyecto"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/dashboard-new")}
                  className="bg-gray-300 text-black px-8 py-3 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};


export default NewProjectKeyHours;
