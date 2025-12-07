import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectService, Project } from "../services/projectService";
import { authService } from "../services/authService";
import { applicationService, Application } from "../services/applicationService";


/**
 * KeyHours – Project Detail Page (React + TypeScript + Tailwind)
 * Guarda como src/components/ProjectDetailKeyHours.tsx
 */


const ProjectDetailKeyHours: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    max_hours: 0,
    hour_assignment: 'automatic' as 'automatic' | 'manual',
    automatic_hours: 0,
    visibility: 'published' as 'unpublished' | 'convocatoria' | 'published',
    start_date: '',
    end_date: '',
    max_participants: 0,
    is_active: true
  });

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError("");
      const data = await projectService.getProject(parseInt(id));
      setProject(data);
      
      // Inicializar datos de edición
      setEditData({
        name: data.name,
        description: data.description,
        max_hours: data.max_hours,
        hour_assignment: data.hour_assignment,
        automatic_hours: data.automatic_hours || 0,
        visibility: data.visibility,
        start_date: new Date(data.start_date).toISOString().split('T')[0],
        end_date: new Date(data.end_date).toISOString().split('T')[0],
        max_participants: data.max_participants,
        is_active: data.is_active
      });
      
      // Cargar aplicaciones si es admin
      if (authService.isAdmin()) {
        await loadApplications();
      }
    } catch (err) {
      console.error("Error loading project:", err);
      setError("Error al cargar el proyecto");
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      setApplicationsLoading(true);
      const projectId = parseInt(id!);
      const apps = await applicationService.getProjectApplications(projectId);
      setApplications(apps);
    } catch (err) {
      console.error('Error loading applications:', err);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handleApproveApplication = async (applicationId: number) => {
    try {
      await applicationService.reviewApplication(applicationId, 'approved');
      await loadApplications();
      alert('✅ Aplicación aprobada exitosamente');
    } catch (err) {
      console.error('Error approving application:', err);
      alert('Error al aprobar la aplicación');
    }
  };

  const handleRejectApplication = async (applicationId: number) => {
    try {
      await applicationService.reviewApplication(applicationId, 'rejected');
      await loadApplications();
      alert('✅ Aplicación rechazada exitosamente');
    } catch (err) {
      console.error('Error rejecting application:', err);
      alert('Error al rechazar la aplicación');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Restaurar datos originales
    if (project) {
      setEditData({
        name: project.name,
        description: project.description,
        max_hours: project.max_hours,
        hour_assignment: project.hour_assignment,
        automatic_hours: project.automatic_hours || 0,
        visibility: project.visibility,
        start_date: new Date(project.start_date).toISOString().split('T')[0],
        end_date: new Date(project.end_date).toISOString().split('T')[0],
        max_participants: project.max_participants,
        is_active: project.is_active
      });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      const projectId = parseInt(id!);
      
      const updateData = {
        name: editData.name,
        description: editData.description,
        max_hours: typeof editData.max_hours === 'number' ? editData.max_hours : (typeof editData.max_hours === 'string' ? parseInt(editData.max_hours) || 0 : 0),
        hour_assignment: editData.hour_assignment,
        automatic_hours: editData.hour_assignment === 'automatic' ? 
          (typeof editData.automatic_hours === 'number' ? editData.automatic_hours : (typeof editData.automatic_hours === 'string' ? parseInt(editData.automatic_hours) || 0 : 0)) 
          : undefined,
        visibility: editData.visibility,
        start_date: editData.start_date,
        end_date: editData.end_date,
        max_participants: typeof editData.max_participants === 'number' ? editData.max_participants : (typeof editData.max_participants === 'string' ? parseInt(editData.max_participants) || 0 : 0),
        is_active: editData.is_active
      };

      console.log('🔍 Edit data before save:', editData);
      console.log('📊 Update data to send:', updateData);

      const updatedProject = await projectService.updateProject(projectId, updateData);
      
      // Actualizar el estado del proyecto inmediatamente
      setProject(updatedProject);
      
      // Actualizar también el estado de edición con los nuevos datos
      setEditData({
        name: updatedProject.name,
        description: updatedProject.description,
        max_hours: updatedProject.max_hours,
        hour_assignment: updatedProject.hour_assignment,
        automatic_hours: updatedProject.automatic_hours || 0,
        visibility: updatedProject.visibility,
        start_date: new Date(updatedProject.start_date).toISOString().split('T')[0],
        end_date: new Date(updatedProject.end_date).toISOString().split('T')[0],
        max_participants: updatedProject.max_participants,
        is_active: updatedProject.is_active
      });
      
      setIsEditing(false);
      
      // Recargar el proyecto para asegurar consistencia
      await loadProject();
      
      alert('¡Proyecto actualizado exitosamente!');
    } catch (err) {
      console.error('Error updating project:', err);
      setError(`Error al actualizar el proyecto: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    console.log(`🔍 Input change - Name: ${name}, Value: "${value}", Type: ${type}`);
    
    setEditData(prev => {
      if (type === 'checkbox') {
        const newData = {
          ...prev,
          [name]: (e.target as HTMLInputElement).checked
        };
        console.log(`✅ Checkbox updated:`, newData);
        return newData;
      } else if (type === 'number') {
        // Solo convertir a número si el valor no está vacío y es válido
        const numValue = value === '' ? 0 : parseInt(value, 10);
        const newData = {
          ...prev,
          [name]: isNaN(numValue) ? prev[name as keyof typeof prev] : numValue
        };
        console.log(`✅ Number updated:`, { name, value, numValue, finalValue: newData[name as keyof typeof newData] });
        return newData;
      } else {
        const newData = {
          ...prev,
          [name]: value
        };
        console.log(`✅ Text updated:`, newData);
        return newData;
      }
    });
  };

  const handleDeleteProject = async () => {
    if (!project) return;

    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar el proyecto "${project.name}"?\n\n` +
      `Esta acción no se puede deshacer y eliminará:\n` +
      `• Todas las aplicaciones relacionadas\n` +
      `• Todos los registros de horas\n` +
      `• Toda la información del proyecto\n\n` +
      `Escribe "ELIMINAR" para confirmar:`
    );

    if (confirmDelete) {
      const userInput = window.prompt(
        `Para confirmar la eliminación del proyecto "${project.name}", escribe exactamente: ELIMINAR`
      );

      if (userInput === "ELIMINAR") {
        try {
          setLoading(true);
          setError("");
          
          await projectService.deleteProject(project.id);
          
          alert('✅ Proyecto eliminado exitosamente');
          navigate("/admin/dashboard");
        } catch (err) {
          console.error('Error deleting project:', err);
          setError(`Error al eliminar el proyecto: ${err instanceof Error ? err.message : 'Error desconocido'}`);
        } finally {
          setLoading(false);
        }
      } else if (userInput !== null) {
        alert('❌ Texto de confirmación incorrecto. La eliminación fue cancelada.');
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-[24px] font-semibold text-white">Cargando proyecto...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-[24px] font-semibold text-white">
          {error || "Proyecto no encontrado"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="flex w-full items-center justify-between bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-8 py-6">
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
            <span className="text-[28px] font-extrabold tracking-tight text-white leading-none">key</span>
            <span className="text-[12px] font-medium tracking-wide text-white uppercase">
              Instituto Kriete de<br />Ingeniería y Ciencias
            </span>
          </div>
        </div>


        {/* Perfil */}
        <div className="flex items-center gap-4">
          <div className="w-[44px] h-[44px] rounded-full bg-white" />
          <span className="text-[16px] font-semibold text-white">Admin</span>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 text-[14px] font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-200 hover:border-white/30"
          >
            Logout
          </button>
        </div>
      </header>


      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-88px)]">
        {/* Content Area */}
        <main className="flex-1 p-8">
          {/* Back Button */}
          <button 
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 px-4 py-2 text-white hover:text-blue-300 mb-6 transition-all duration-200 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full hover:border-white/30"
          >
            <span className="text-[20px]">←</span>
            <span className="text-[16px] font-medium">Back to Projects</span>
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}


          {/* Project Header */}
          <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    className="text-[32px] font-bold text-black mb-2 bg-gray-100 border-2 border-blue-500 rounded-lg px-3 py-2 w-full"
                    placeholder="Nombre del proyecto"
                  />
                ) : (
                  <h1 className="text-[32px] font-bold text-black mb-2">{project.name}</h1>
                )}
                <p className="text-[16px] text-gray-600">{project.manager.full_name} • {project.visibility}</p>
              </div>
              <div className="flex gap-3">
                {!isEditing ? (
                  <>
                    <button 
                      onClick={handleEdit}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      ✏️ Editar Proyecto
                    </button>
                    <button 
                      onClick={handleDeleteProject}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      🗑️ Borrar Proyecto
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                    >
                      {saving ? '💾 Guardando...' : '💾 Guardar'}
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                      ❌ Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>


            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-[24px] mb-2">⏱️</div>
                <div className="text-[18px] font-bold text-black">
                  {project.duration_days ? Math.round(project.duration_days / 30) : 3} months
                </div>
                <div className="text-[14px] text-gray-600">Duration</div>
              </div>
              
              <div className="text-center">
                <div className="text-[24px] mb-2">📊</div>
                {isEditing ? (
                  <input
                    type="number"
                    name="max_hours"
                    value={editData.max_hours}
                    onChange={handleInputChange}
                    className="text-[18px] font-bold text-black bg-gray-100 border-2 border-blue-500 rounded-lg px-2 py-1 text-center w-full"
                    min="1"
                  />
                ) : (
                  <div className="text-[18px] font-bold text-black">{project.max_hours}h</div>
                )}
                <div className="text-[14px] text-gray-600">Max Hours</div>
              </div>
              
              <div className="text-center">
                <div className="text-[24px] mb-2">👥</div>
                {isEditing ? (
                  <input
                    type="number"
                    name="max_participants"
                    value={editData.max_participants}
                    onChange={handleInputChange}
                    className="text-[18px] font-bold text-black bg-gray-100 border-2 border-blue-500 rounded-lg px-2 py-1 text-center w-full"
                    min="1"
                  />
                ) : (
                  <div className="text-[18px] font-bold text-black">{project.current_participants}/{project.max_participants}</div>
                )}
                <div className="text-[14px] text-gray-600">Students</div>
              </div>
              
              <div className="text-center">
                <div className="text-[24px] mb-2">✅</div>
                {isEditing ? (
                  <label className="flex items-center justify-center gap-2">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={editData.is_active}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-[18px] font-bold text-black">
                      {editData.is_active ? "Active" : "Inactive"}
                    </span>
                  </label>
                ) : (
                  <div className="text-[18px] font-bold text-black">
                    {project.is_active ? "Active" : "Inactive"}
                  </div>
                )}
                <div className="text-[14px] text-gray-600">Status</div>
              </div>
            </div>
          </div>


          {/* Project Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-[20px] font-bold text-black mb-4">Descripción</h2>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={editData.description}
                    onChange={handleInputChange}
                    className="w-full h-32 p-3 border-2 border-blue-500 rounded-lg text-[16px] text-gray-700 leading-relaxed resize-vertical"
                    placeholder="Descripción del proyecto"
                  />
                ) : (
                  <p className="text-[16px] text-gray-700 leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>


            </div>


            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-[18px] font-bold text-black mb-4">Project Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-[14px] font-medium text-gray-600">Start Date:</span>
                    {isEditing ? (
                      <input
                        type="date"
                        name="start_date"
                        value={editData.start_date}
                        onChange={handleInputChange}
                        className="w-full p-2 border-2 border-blue-500 rounded-lg text-[16px] text-black"
                      />
                    ) : (
                      <p className="text-[16px] text-black">
                        {new Date(project.start_date).toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    )}
                  </div>
                  <div>
                    <span className="text-[14px] font-medium text-gray-600">End Date:</span>
                    {isEditing ? (
                      <input
                        type="date"
                        name="end_date"
                        value={editData.end_date}
                        onChange={handleInputChange}
                        className="w-full p-2 border-2 border-blue-500 rounded-lg text-[16px] text-black"
                      />
                    ) : (
                      <p className="text-[16px] text-black">
                        {new Date(project.end_date).toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    )}
                  </div>
                  <div>
                    <span className="text-[14px] font-medium text-gray-600">Visibility:</span>
                    {isEditing ? (
                      <select
                        name="visibility"
                        value={editData.visibility}
                        onChange={handleInputChange}
                        className="w-full p-2 border-2 border-blue-500 rounded-lg text-[16px] text-black"
                      >
                        <option value="unpublished">No Publicado</option>
                        <option value="convocatoria">Convocatoria</option>
                        <option value="published">Publicado</option>
                      </select>
                    ) : (
                      <p className="text-[16px] text-black capitalize">{project.visibility}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-[14px] font-medium text-gray-600">Hour Assignment:</span>
                    {isEditing ? (
                      <div className="space-y-2">
                        <select
                          name="hour_assignment"
                          value={editData.hour_assignment}
                          onChange={handleInputChange}
                          className="w-full p-2 border-2 border-blue-500 rounded-lg text-[16px] text-black"
                        >
                          <option value="automatic">Automática</option>
                          <option value="manual">Manual</option>
                        </select>
                        {editData.hour_assignment === 'automatic' && (
                          <input
                            type="number"
                            name="automatic_hours"
                            value={editData.automatic_hours}
                            onChange={handleInputChange}
                            className="w-full p-2 border-2 border-blue-500 rounded-lg text-[16px] text-black"
                            placeholder="Horas automáticas"
                            min="1"
                          />
                        )}
                      </div>
                    ) : (
                      <p className="text-[16px] text-black capitalize">
                        {project.hour_assignment === 'automatic' ? 'Automática' : 'Manual'}
                        {project.automatic_hours && ` (${project.automatic_hours}h)`}
                      </p>
                    )}
                  </div>
                </div>
              </div>


              {/* Participants */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-[18px] font-bold text-black mb-4">Participants ({project.current_participants})</h3>
                <div className="space-y-3">
                  {project.participants && project.participants.length > 0 ? (
                    project.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between">
                        <div>
                          <div className="text-[14px] font-medium text-black">{participant.full_name}</div>
                          <div className="text-[12px] text-gray-600">
                            {participant.hours_completed}h • {participant.carnet}
                          </div>
                        </div>
                        <span className={`text-[12px] ${
                          participant.status === 'active' ? 'text-green-500' :
                          participant.status === 'completed' ? 'text-blue-500' :
                          'text-gray-500'
                        }`}>
                          {participant.status === 'active' ? 'Active' :
                           participant.status === 'completed' ? 'Completed' :
                           'Inactive'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-[14px] text-gray-500 mb-2">No hay participantes inscritos</div>
                      <div className="text-[12px] text-gray-400">
                        Los estudiantes pueden unirse al proyecto desde la vista de estudiante
                      </div>
                    </div>
                  )}
                  {project.participants && project.participants.length > 0 && (
                    <button className="text-[14px] text-blue-600 hover:text-blue-800">
                      View all participants →
                    </button>
                  )}
                </div>
              </div>

              {/* Applications Section - Only for Admins */}
              {authService.isAdmin() && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[18px] font-bold text-black">
                      Solicitudes de Participación ({applications.length})
                    </h3>
                    <button
                      onClick={loadApplications}
                      disabled={applicationsLoading}
                      className="text-[14px] text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      {applicationsLoading ? 'Cargando...' : 'Actualizar'}
                    </button>
                  </div>
                  
                  {applicationsLoading ? (
                    <div className="text-center py-4">
                      <div className="text-[14px] text-gray-500">Cargando solicitudes...</div>
                    </div>
                  ) : applications.length > 0 ? (
                    <div className="space-y-3">
                      {applications.map((app: any) => (
                        <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-[14px] font-semibold text-blue-700">
                                  {(app.user?.full_name || app.user_name || 'U')
                                    .split(' ')
                                    .map((n: string) => n[0])
                                    .join('')}
                                </span>
                              </div>
                              <div>
                                <div className="text-[14px] font-medium text-black">{app.user?.full_name || app.user_name}</div>
                                <div className="text-[12px] text-gray-600">Carnet: {app.user?.carnet || app.user_carnet || 'N/A'}</div>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${
                              app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              app.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {app.status === 'pending' ? 'Pendiente' :
                               app.status === 'approved' ? 'Aprobada' : 'Rechazada'}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-3">
                            <div className="text-[12px] text-gray-600">
                              <strong>Motivación:</strong> {app.motivation}
                            </div>
                            <div className="flex gap-4 text-[12px] text-gray-600">
                              <span><strong>Horas disponibles:</strong> {app.available_hours_per_week}h/semana</span>
                              <span><strong>Fecha preferida:</strong> {new Date(app.start_date_preference).toLocaleDateString('es-ES')}</span>
                            </div>
                          </div>
                          
                          {app.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveApplication(app.id)}
                                className="px-3 py-1 bg-green-600 text-white rounded-lg text-[12px] hover:bg-green-700 transition-colors"
                              >
                                ✅ Aprobar
                              </button>
                              <button
                                onClick={() => handleRejectApplication(app.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded-lg text-[12px] hover:bg-red-700 transition-colors"
                              >
                                ❌ Rechazar
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-[14px] text-gray-500 mb-2">No hay solicitudes pendientes</div>
                      <div className="text-[12px] text-gray-400">
                        Los estudiantes pueden enviar solicitudes desde la vista de convocatorias
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};


export default ProjectDetailKeyHours;
