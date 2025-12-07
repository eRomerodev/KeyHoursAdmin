import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import { projectService, Project } from '../services/projectService';
import { authService } from '../services/authService';
import './StudentDashboard.css';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const user = authService.getUser();

  useEffect(() => {
    loadProjects();
  }, []);

  // Recargar proyectos cuando se navega a esta página
  useEffect(() => {
    const handleFocus = () => {
      loadProjects();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading projects...');
      
      // Cargar todos los proyectos y mis proyectos en paralelo
      const [allProjectsData, myProjectsData] = await Promise.all([
        projectService.getProjects(),
        projectService.getMyProjects().catch(() => []) // Si falla, usar array vacío
      ]);
      
      console.log('All projects data:', allProjectsData);
      console.log('My projects data:', myProjectsData);
      
      setProjects(Array.isArray(allProjectsData) ? allProjectsData : []);
      setMyProjects(Array.isArray(myProjectsData) ? myProjectsData : []);
    } catch (err) {
      console.error('Error loading projects:', err);
      console.error('Error details:', err);
      setError(`Error al cargar proyectos: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      setProjects([]);
      setMyProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/student/project/${projectId}`);
  };

  return (
    <div className="student-dashboard">
      <Navbar variant="dashboard" userType="student" />
      
      <div className="dashboard-content">
        <Sidebar userType="student" userName={user?.full_name || "Estudiante"} />
        
            <main className="dashboard-main">
              <div className="dashboard-header">
                <h1 className="dashboard-title">Proyectos</h1>
                <button 
                  onClick={loadProjects} 
                  className="refresh-btn"
                  disabled={loading}
                >
                  {loading ? 'Cargando...' : '🔄 Actualizar'}
                </button>
              </div>

              {/* Pestañas */}
              <div className="project-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  📁 Todos los Proyectos
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
                  onClick={() => setActiveTab('my')}
                >
                  ✅ Mis Proyectos ({myProjects.length})
                </button>
              </div>
          
          {loading && (
            <div className="text-center py-12">
              <p className="text-lg">Cargando proyectos...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {activeTab === 'all' && (
                <>
                  {projects.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-lg">No hay proyectos disponibles</p>
                    </div>
                  ) : (
                    <div className="projects-grid">
                      {projects.map((project) => (
                        <ProjectCard
                          key={project.id}
                          id={project.id.toString()}
                          name={project.name}
                          color={projectService.getProjectColor(project.id)}
                          onClick={() => handleProjectClick(project.id.toString())}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'my' && (
                <>
                  {myProjects.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-lg">No estás inscrito en ningún proyecto</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Ve a "Todos los Proyectos" para unirte a alguno
                      </p>
                    </div>
                  ) : (
                    <div className="projects-grid">
                      {myProjects.map((project) => (
                        <ProjectCard
                          key={project.id}
                          id={project.id.toString()}
                          name={project.name}
                          color={projectService.getProjectColor(project.id)}
                          onClick={() => handleProjectClick(project.id.toString())}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
