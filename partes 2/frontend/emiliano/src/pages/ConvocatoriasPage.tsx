import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import ApplicationForm from '../components/ApplicationForm';
import { projectService, Project } from '../services/projectService';
import { applicationService } from '../services/applicationService';
import { authService } from '../services/authService';
import './ConvocatoriasPage.css';

const ConvocatoriasPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedConvocatoria, setSelectedConvocatoria] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectStatuses, setProjectStatuses] = useState<Record<number, 'available' | 'applied' | 'approved' | 'rejected'>>({});
  const user = authService.getUser();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Cargar estados de aplicación para todos los proyectos
    const loadApplicationStatuses = async () => {
      if (projects.length === 0) return;
      
      const statuses: Record<number, 'available' | 'applied' | 'approved' | 'rejected'> = {};
      await Promise.all(
        projects.map(async (project) => {
          try {
            const status = await applicationService.getApplicationStatus(project.id);
            statuses[project.id] = status;
          } catch (error) {
            statuses[project.id] = 'available';
          }
        })
      );
      setProjectStatuses(statuses);
    };

    if (projects.length > 0) {
      loadApplicationStatuses();
    }
  }, [projects]);

  const loadData = async () => {
    try {
      setLoading(true);
      const projectsData = await projectService.getProjects();
      
      // Filtrar solo proyectos de tipo convocatoria
      const convocatoriasProjects = projectsData.filter(project => 
        project.visibility === 'convocatoria' && project.is_active
      );
      
      setProjects(convocatoriasProjects);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectStatus = (projectId: number): 'available' | 'applied' | 'approved' | 'rejected' => {
    return projectStatuses[projectId] || 'available';
  };

  const getProjectColor = (index: number): string => {
    const colors = ['#9c27b0', '#2196f3', '#00bcd4', '#4caf50', '#f44336', '#e91e63'];
    return colors[index % colors.length];
  };

  const handleConvocatoriaClick = (id: string) => {
    const project = projects.find(p => p.id.toString() === id);
    if (project) {
      setSelectedProject(project);
      setSelectedConvocatoria(id);
    }
  };

  const handleApply = () => {
    if (selectedProject) {
      setShowApplicationForm(true);
    }
  };

  const handleApplicationSuccess = async () => {
    setShowApplicationForm(false);
    if (selectedProject) {
      // Actualizar el estado de la aplicación del proyecto
      try {
        const status = await applicationService.getApplicationStatus(selectedProject.id);
        setProjectStatuses(prev => ({ ...prev, [selectedProject.id]: status }));
      } catch (error) {
        console.error('Error updating application status:', error);
      }
    }
    setSelectedProject(null);
    setSelectedConvocatoria(null);
    loadData(); // Recargar para actualizar el estado
  };

  const handleApplicationClose = () => {
    setShowApplicationForm(false);
  };

  const handleBack = () => {
    if (selectedConvocatoria) {
      setSelectedConvocatoria(null);
    } else {
      navigate(-1);
    }
  };

  // Cargar estado de aplicación para el proyecto seleccionado
  useEffect(() => {
    const loadSelectedProjectStatus = async () => {
      if (selectedProject) {
        try {
          const status = await applicationService.getApplicationStatus(selectedProject.id);
          setProjectStatuses(prev => ({ ...prev, [selectedProject.id]: status }));
        } catch (error) {
          setProjectStatuses(prev => ({ ...prev, [selectedProject.id]: 'available' }));
        }
      }
    };

    if (selectedProject) {
      loadSelectedProjectStatus();
    }
  }, [selectedProject]);

  if (selectedConvocatoria && selectedProject) {
    const applicationStatus = getProjectStatus(selectedProject.id);
    
    return (
      <div className="convocatorias-page">
        <Navbar variant="dashboard" userType="student" userName={user?.full_name} />
        
        <div className="convocatorias-content">
          <Sidebar userType="student" userName={user?.full_name} />
          
          <main className="convocatorias-main">
            <div className="convocatoria-detail">
              <div className="detail-header">
                <h1 className="detail-title">{selectedProject.name}</h1>
                <button className="back-btn" onClick={handleBack}>
                  <span className="back-icon">←</span>
                </button>
              </div>
              
              <div className="detail-info">
                <div className="info-bar">
                  <div className="info-left">
                    <span className="clock-icon">🕐</span>
                    <span>Duración:</span>
                  </div>
                  <div className="info-right">
                    <span>
                      {new Date(selectedProject.start_date).toLocaleDateString()} - {new Date(selectedProject.end_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="detail-content">
                  <div className="content-left">
                    <h3 className="description-title">Descripción:</h3>
                    <p className="description-text">{selectedProject.description}</p>
                    
                    <div className="available-spots">
                      <span className="spots-icon">👥</span>
                      <span className="spots-label">Plazas disponibles</span>
                      <div className="spots-count">{selectedProject.available_spots}</div>
                    </div>

                    <div className="available-spots">
                      <span className="spots-icon">⏱️</span>
                      <span className="spots-label">Horas máximas</span>
                      <div className="spots-count">{selectedProject.max_hours}</div>
                    </div>
                  </div>
                  
                  <div className="content-right">
                    {applicationStatus === 'available' && selectedProject.is_accepting_applications && (
                      <button className="apply-btn" onClick={handleApply}>
                        SOLICITAR PARTICIPACIÓN
                      </button>
                    )}
                    
                    {applicationStatus === 'applied' && (
                      <div className="text-center">
                        <div className="text-yellow-600 font-semibold mb-2">
                          ⏳ Solicitud Pendiente
                        </div>
                        <p className="text-sm text-gray-600">
                          Tu solicitud está siendo revisada por el administrador
                        </p>
                      </div>
                    )}
                    
                    {applicationStatus === 'approved' && (
                      <div className="text-center">
                        <div className="text-green-600 font-semibold mb-2">
                          ✅ Solicitud Aprobada
                        </div>
                        <p className="text-sm text-gray-600">
                          ¡Felicidades! Has sido aceptado en este proyecto
                        </p>
                      </div>
                    )}
                    
                    {applicationStatus === 'rejected' && (
                      <div className="text-center">
                        <div className="text-red-600 font-semibold mb-2">
                          ❌ Solicitud Rechazada
                        </div>
                        <p className="text-sm text-gray-600">
                          Tu solicitud no fue aceptada para este proyecto
                        </p>
                      </div>
                    )}

                    {!selectedProject.is_accepting_applications && (
                      <div className="text-center">
                        <div className="text-gray-600 font-semibold mb-2">
                          📝 No Acepta Solicitudes
                        </div>
                        <p className="text-sm text-gray-600">
                          Este proyecto no está aceptando nuevas solicitudes
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="convocatorias-page">
      <Navbar variant="dashboard" userType="student" userName={user?.full_name} />
      
      <div className="convocatorias-content">
        <Sidebar userType="student" userName={user?.full_name} />
        
        <main className="convocatorias-main">
          <div className="convocatorias-header">
            <h1 className="convocatorias-title">Convocatorias</h1>
            <p className="text-white/70 mt-2">
              Proyectos disponibles para solicitar participación
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-white">Cargando convocatorias...</div>
            </div>
          ) : (
            <div className="convocatorias-grid">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  id={project.id.toString()}
                  name={project.name}
                  color={getProjectColor(index)}
                  status={getProjectStatus(project.id)}
                  onClick={() => handleConvocatoriaClick(project.id.toString())}
                />
              ))}
              
              {projects.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="text-white/70 text-lg">
                    No hay convocatorias disponibles en este momento
                  </div>
                  <div className="text-white/50 text-sm mt-2">
                    Vuelve más tarde para ver nuevos proyectos
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && selectedProject && (
        <ApplicationForm
          projectId={selectedProject.id}
          projectName={selectedProject.name}
          onClose={handleApplicationClose}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};

export default ConvocatoriasPage;
