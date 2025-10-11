import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { authService } from "../services/authService";
import { studentService, Student } from "../services/studentService";


/**
 * KeyHours – Students Screen (React + TypeScript + Tailwind)
 * Guarda como src/components/StudentsScreenKeyHours.tsx
 */


const StudentsScreenKeyHours: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const user = authService.getUser();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getStudents();
      console.log("Students data:", data);
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading students:", err);
      setError("Error al cargar estudiantes");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = (students || []).filter((student) => {
    if (!student || typeof student !== 'object') {
      return false;
    }
    
    const name = student.full_name?.toLowerCase() || '';
    const carnet = student.carnet?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    
    return name.includes(search) || carnet.includes(search);
  });

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
          <div className="rounded-2xl bg-white/10 p-4 mb-4">
            <div className="rounded-2xl bg-white/15 px-5 py-3 text-2xl font-semibold text-black">Students</div>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2">
              <Search size={18} className="text-black/80" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="buscar student"
                className="w-full bg-transparent text-sm text-black placeholder-black/70 outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/dashboard-new")}
            className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-black shadow hover:bg-gray-200"
          >
            <Home size={18} /> Projects
          </button>
        </aside>


        {/* Content Area */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-[32px] font-bold text-black mb-2">Students</h1>
            <p className="text-[16px] text-black/70">Manage student accounts and information</p>
          </div>


          {loading && (
            <div className="text-center py-12">
              <p className="text-[18px] text-black">Cargando estudiantes...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="mb-3 flex w-full justify-end">
                <button className="rounded-full bg-white/15 px-5 py-2 text-sm font-medium text-black hover:bg-white/25">
                  Detalles …
                </button>
              </div>

              {/* Students Table */}
              <div className="overflow-hidden rounded-md border border-white/15 bg-white/10 backdrop-blur">
                {/* Head */}
                <div className="grid grid-cols-12 border-b border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-black">
                  <div className="col-span-4">Estudiante</div>
                  <div className="col-span-2">⏲️ Horas</div>
                  <div className="col-span-3">🧱 Proyectos</div>
                  <div className="col-span-2">📋 Total de horas</div>
                  <div className="col-span-1 text-center">Estado</div>
                </div>

                {/* Rows */}
                {loading ? (
                  <div className="p-8 text-center text-black">
                    <div className="text-lg font-medium">Cargando estudiantes...</div>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center text-red-600">
                    <div className="text-lg font-medium">Error: {error}</div>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="p-8 text-center text-black">
                    <div className="text-lg font-medium">No hay estudiantes disponibles</div>
                  </div>
                ) : (
                  filteredStudents.map((student, i) => {
                  // Validaciones de seguridad
                  if (!student || typeof student !== 'object') {
                    return null;
                  }
                  
                  const hours = student.total_hours || 0;
                  const goal = 20; // Meta por defecto
                  const pct = Math.min(100, Math.round((hours / goal) * 100));
                  const color = pct >= 90 ? "#22c55e" : pct >= 60 ? "#fde047" : "#ef4444";
                  
                  return (
                    <div
                      key={student.id}
                      className={`grid grid-cols-12 items-center px-5 py-4 ${
                        i !== filteredStudents.length - 1 ? "border-b border-white/10" : ""
                      }`}
                    >
                      {/* Estudiante */}
                      <div className="col-span-4 flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-black">
                          {(student.first_name?.[0] || 'U')}{(student.last_name?.[0] || 'N')}
                        </span>
                        <span className="text-black/95">{student.full_name || 'Usuario'}</span>
                      </div>

                      {/* Horas */}
                      <div className="col-span-2 text-black/90">{hours} h</div>

                      {/* Proyecto */}
                      <div className="col-span-3 text-black/90">{student.completed_projects || 0} proyectos</div>

                      {/* Total con barra de progreso */}
                      <div className="col-span-2">
                        <div className="flex w-full items-center gap-3">
                          <div className="relative h-4 w-full rounded-full bg-white/10">
                            <div
                              className="h-4 rounded-full"
                              style={{ width: `${pct}%`, backgroundColor: color }}
                            />
                          </div>
                          <span className="whitespace-nowrap text-sm text-black/80">{hours}/{goal}</span>
                        </div>
                      </div>

                      {/* Estado */}
                      <div className="col-span-1 text-center font-semibold">
                        {student.is_active ? (
                          <span className="text-emerald-600">Activo</span>
                        ) : (
                          <span className="text-red-600">Inactivo</span>
                        )}
                      </div>
                    </div>
                  );
                  })
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};


export default StudentsScreenKeyHours;
