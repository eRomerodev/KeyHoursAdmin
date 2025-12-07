import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authService } from "../services/authService";
import { applicationService, Application } from "../services/applicationService";
import { projectService, Project } from "../services/projectService";


/**
 * KeyHours – Applicants Page (React + TypeScript + Tailwind)
 * Guarda como src/components/ApplicantsKeyHours.tsx
 */


const ApplicantsKeyHours: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const user = authService.getUser();

  useEffect(() => {
    if (projectId) {
      loadData();
    }
    // eslint-disable-next-line
  }, [projectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appsData, projData] = await Promise.all([
        applicationService.getProjectApplications(parseInt(projectId!)),
        projectService.getProject(parseInt(projectId!)),
      ]);
      setApplications(appsData);
      setProject(projData);
      setError("");
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Error al cargar aplicantes");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: number) => {
    try {
      await applicationService.reviewApplication(applicationId, "approved");
      await loadData();
    } catch (err) {
      alert("Error al aprobar aplicación");
    }
  };

  const handleReject = async (applicationId: number) => {
    try {
      await applicationService.reviewApplication(applicationId, "rejected");
      await loadData();
    } catch (err) {
      alert("Error al rechazar aplicación");
    }
  };


  const filteredApplications = applications.filter((app: any) => {
    const term = searchTerm.toLowerCase();
    const projectName = (project?.name || '').toLowerCase();
    const projectIdStr = String(app.project ?? project?.id ?? '').toLowerCase();
    const userName = (app.user?.full_name || app.user_name || '').toLowerCase();
    const userCarnet = (app.user?.carnet || app.user_carnet || '').toLowerCase();
    return (
      projectName.includes(term) ||
      projectIdStr.includes(term) ||
      userName.includes(term) ||
      userCarnet.includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-800 text-white">
      {/* Header */}
      <header className="bg-white text-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 -skew-x-12 rotate-12 rounded-sm bg-slate-900" />
            <div className="text-2xl font-bold tracking-tight">
              key <span className="ml-2 rounded-xl bg-blue-500 px-2 py-0.5 text-white">HOURS</span>
            </div>
          </div>
          <div className="text-sm font-semibold">Bienvenido {user?.full_name || "Administrador"} !</div>
        </div>
      </header>

      {/* Title */}
      <div className="mx-auto max-w-6xl px-4 pt-8">
        <h1 className="text-3xl font-extrabold italic tracking-tight sm:text-4xl">
          Aplicantes <span className="opacity-80">|</span> <span className="not-italic">[{project?.name || "Cargando..."}]</span>
        </h1>
      </div>

      {/* Search */}
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre…"
          className="w-full rounded-2xl border-0 bg-white/95 px-4 py-3 text-slate-900 shadow-inner outline-none ring-2 ring-transparent placeholder:text-slate-500 focus:ring-blue-500"
        />
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <p className="text-lg">Cargando aplicantes...</p>
        </div>
      )}

      {error && (
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* List */}
      {!loading && !error && (
        <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
          {filteredApplications.map((app) => {
            const colorByStatus: Record<string, string> = {
              pending: "ring-white/20",
              approved: "ring-emerald-400",
              rejected: "ring-rose-400",
              in_progress: "ring-blue-400",
              completed: "ring-green-400",
              cancelled: "ring-gray-400",
            };

            return (
              <div
                key={app.id}
                className={`flex items-center gap-4 rounded-2xl bg-white/10 p-3 ring-1 ${colorByStatus[app.status] || "ring-white/20"}`}
              >
                {/* Avatar */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-indigo-700 shadow-inner">
                  <span className="text-lg font-semibold">
                    {(project?.name || 'Proyecto')
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')}
                  </span>
                </div>

                {/* Name pill */}
                <div className="flex-1">
                  <div className="inline-flex max-w-full items-center rounded-2xl bg-white/90 px-4 py-2 text-slate-900 shadow">
                    <span className="truncate text-lg font-medium" title={project?.name}>
                      {project?.name}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {app.status === "pending" && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow hover:brightness-105"
                      aria-label={`Aprobar a ${project?.name || 'Proyecto'}`}
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                    <span className="h-8 w-px bg-white/40" aria-hidden />
                    <button
                      onClick={() => handleReject(app.id)}
                      className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow hover:brightness-105"
                      aria-label={`Rechazar a ${project?.name || 'Proyecto'}`}
                    >
                      <CrossIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {filteredApplications.length === 0 && (
            <div className="rounded-2xl bg-white/10 p-6 text-center text-white/90">
              No hay resultados.
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8 flex justify-start">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center gap-2 text-white hover:text-white/80 transition"
            >
              <span className="text-[20px]">←</span>
              <span className="text-[16px] font-medium">Volver</span>
            </button>
          </div>
        </main>
      )}
    </div>
  );
};

// Iconos
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CrossIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default ApplicantsKeyHours;
