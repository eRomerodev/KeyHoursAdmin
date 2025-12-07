import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ApplicationForm from '../components/ApplicationForm';
import { projectService, Project } from '../services/projectService';
import { applicationService } from '../services/applicationService';
import { authService } from '../services/authService';
import './StudentProjectDetailPage.css';

const StudentProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<'available' | 'applied' | 'approved' | 'rejected'>('available');
  const user = authService.getUser();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError('');
      const projectId = parseInt(id!);
      
      // Cargar proyecto
      const projectData = await projectService.getProject(projectId);
      setProject(projectData);
      
      // Cargar estado de la aplicación
      try {
        const status = await applicationService.getApplicationStatus(projectId);
        setApplicationStatus(status);
      } catch (err) {
        console.error('Error loading application status:', err);
        setApplicationStatus('available');
      }
    } catch (err) {
      console.error('Error loading project:', err);
      setError('Error al cargar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  // Cargar proyecto cuando cambia el ID
  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  // Polling solo cuando hay una aplicación pendiente (usando useRef para evitar loops)
  useEffect(() => {
    // Limpiar intervalo anterior si existe
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    // Solo hacer polling si hay una aplicación pendiente
    if (applicationStatus !== 'applied' || !project) {
      return;
    }

    const projectId = project.id;

    // Actualizar el estado de la aplicación periódicamente
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const status = await applicationService.getApplicationStatus(projectId);
        setApplicationStatus(prevStatus => {
          // Solo actualizar si el estado cambió
          if (status !== prevStatus) {
            // Si ya no está pendiente, recargar el proyecto
            if (status !== 'applied') {
              setTimeout(() => loadProject(), 100);
            }
            return status;
          }
          return prevStatus;
        });
      } catch (err) {
        console.error('Error actualizando estado de aplicación:', err);
      }
    }, 30000); // Actualizar cada 30 segundos (menos agresivo)
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [applicationStatus === 'applied' ? project?.id : null]); // Solo cuando hay aplicación pendiente

  const handleBack = () => {
    navigate('/student/dashboard');
  };


  const handleRequestParticipation = () => {
    if (project) {
      setShowApplicationForm(true);
    }
  };

  const handleApplicationSuccess = async () => {
    setShowApplicationForm(false);
    if (project) {
      // Esperar un momento para que el backend procese la aplicación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar el estado de la aplicación una sola vez
      try {
        const status = await applicationService.getApplicationStatus(project.id);
        setApplicationStatus(status);
        console.log('✅ Estado de aplicación actualizado:', status);
        
        // Solo recargar el proyecto si el estado cambió a 'applied'
        if (status === 'applied') {
          await loadProject();
        }
      } catch (err) {
        console.error('Error updating application status:', err);
        setApplicationStatus('available');
      }
    }
  };

  const handleApplicationClose = () => {
    setShowApplicationForm(false);
  };

  if (loading) {
    return (
      <div className="student-project-detail-page">
        <Navbar variant="dashboard" userType="student" userName={user?.full_name} />
        <div className="loading-container">
          <p>Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-project-detail-page">
        <Navbar variant="dashboard" userType="student" userName={user?.full_name} />
        <div className="error-container">
          <p>{error}</p>
          <button onClick={handleBack} className="back-btn">
            ← Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="student-project-detail-page">
        <Navbar variant="dashboard" userType="student" userName={user?.full_name} />
        <div className="error-container">
          <p>Proyecto no encontrado</p>
          <button onClick={handleBack} className="back-btn">
            ← Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-project-detail-page">
      <Navbar variant="dashboard" userType="student" userName={user?.full_name} />
      
      <div className="student-project-content">
        <div className="student-project-container">
          <div className="student-project-header">
            <div className="header-actions">
              <button onClick={handleBack} className="back-btn">
                ← Volver
              </button>
            </div>
            
            <h1 className="project-title">{project.name}</h1>
            
            <div className="project-info">
              <div className="info-left">
                <span className="clock-icon">🕐</span>
                <span>Max. Hours: {project.max_hours}</span>
              </div>
              <div className="info-right">
                <span>Visibilidad: {project.visibility}</span>
                <span>Manager: {project.manager.full_name}</span>
              </div>
            </div>

            {/* Sistema de Solicitudes */}
            <div className="project-actions">
              {project.is_active && (
                <div className="join-section">
                  {applicationStatus === 'available' && project.is_accepting_applications && (
                    <button 
                      onClick={handleRequestParticipation}
                      disabled={project.current_participants >= project.max_participants}
                      className="join-project-btn"
                    >
                      📝 SOLICITAR PARTICIPACIÓN
                    </button>
                  )}
                  
                  {applicationStatus === 'applied' && (
                    <div className="join-message success">
                      ⏳ Tu solicitud está siendo revisada por el administrador
                    </div>
                  )}
                  
                  {applicationStatus === 'approved' && (
                    <div className="join-message success">
                      ✅ ¡Felicidades! Tu solicitud ha sido aprobada
                    </div>
                  )}
                  
                  {applicationStatus === 'rejected' && (
                    <div className="join-message error">
                      ❌ Tu solicitud no fue aceptada para este proyecto
                    </div>
                  )}

                  {!project.is_accepting_applications && (
                    <div className="join-message error">
                      📝 Este proyecto no está aceptando nuevas solicitudes
                    </div>
                  )}

                  {project.current_participants >= project.max_participants && applicationStatus === 'available' && (
                    <div className="join-message error">
                      ❌ El proyecto está lleno
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="project-sections">
            {/* Descripción */}
            <div className="section-item">
              <h3 className="section-title">📋 Descripción del Proyecto</h3>
              <div className="section-content">
                <p>{project.description}</p>
              </div>
            </div>
            
            {/* Información Principal */}
            <div className="section-item">
              <h3 className="section-title">📊 Información del Proyecto</h3>
              <div className="info-table">
                <div className="table-row">
                  <div className="table-cell label">📅 Fecha de Inicio</div>
                  <div className="table-cell value">
                    {new Date(project.start_date).toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                <div className="table-row">
                  <div className="table-cell label">📅 Fecha de Fin</div>
                  <div className="table-cell value">
                    {new Date(project.end_date).toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                <div className="table-row">
                  <div className="table-cell label">👥 Máximo de Participantes</div>
                  <div className="table-cell value">{project.max_participants}</div>
                </div>
                <div className="table-row">
                  <div className="table-cell label">✅ Participantes Actuales</div>
                  <div className="table-cell value">{project.current_participants}</div>
                </div>
                <div className="table-row">
                  <div className="table-cell label">⏰ Asignación de Horas</div>
                  <div className="table-cell value">
                    <span className={`assignment-badge ${project.hour_assignment}`}>
                      {project.hour_assignment === 'automatic' ? '🤖 Automática' : '✋ Manual'}
                    </span>
                  </div>
                </div>
                <div className="table-row">
                  <div className="table-cell label">📈 Estado del Proyecto</div>
                  <div className="table-cell value">
                    <span className={`status-badge ${project.is_active ? 'active' : 'inactive'}`}>
                      {project.is_active ? '✅ Activo' : '❌ Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="section-item">
              <h3 className="section-title">📈 Estadísticas</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <div className="stat-value">{project.current_participants}/{project.max_participants}</div>
                    <div className="stat-label">Participantes</div>
                    <div className="stat-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(project.current_participants / project.max_participants) * 100}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">Capacidad máxima</span>
                    </div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <div className="stat-value">{project.duration_days || 'N/A'}</div>
                    <div className="stat-label">Días de Duración</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-content">
                    <div className="stat-value">{project.max_hours}</div>
                    <div className="stat-label">Horas Máximas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && project && (
        <ApplicationForm
          projectId={project.id}
          projectName={project.name}
          onClose={handleApplicationClose}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};

export default StudentProjectDetailPage;
