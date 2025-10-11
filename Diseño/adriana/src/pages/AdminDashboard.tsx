import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import { projectService, Project } from '../services/projectService';
import { authService } from '../services/authService';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await projectService.getProjects();
      setProjects(projectsData);
      setError('');
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/admin/project/${projectId}`);
  };

  const handleAddProject = () => {
    navigate('/admin/new-project');
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      try {
        await projectService.deleteProject(parseInt(projectId));
        await loadProjects(); // Recargar la lista
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error al eliminar proyecto');
      }
    }
  };

  const user = authService.getUser();

  return (
    <div className="admin-dashboard">
      <Navbar variant="dashboard" userType="admin" />
      
      <div className="dashboard-content">
        <Sidebar userType="admin" userName={user?.full_name || 'Administrador'} />
        
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Proyectos</h1>
            <button 
              className="add-project-btn"
              onClick={handleAddProject}
            >
              + Nuevo Proyecto
            </button>
          </div>
          
          {loading && (
            <div className="loading-message">
              Cargando proyectos...
            </div>
          )}
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {!loading && !error && (
            <>
              {projects.length === 0 ? (
                <div className="empty-state">
                  <h3>No hay proyectos creados</h3>
                  <p>Crea tu primer proyecto para comenzar</p>
                  <button 
                    className="create-first-btn"
                    onClick={handleAddProject}
                  >
                    Crear Proyecto
                  </button>
                </div>
              ) : (
                <div className="projects-grid">
                  {projects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      id={project.id.toString()}
                      name={project.name}
                      color={projectService.getProjectColor(index)}
                      status={project.visibility === 'published' ? 'available' : 'applied'}
                      onClick={() => handleProjectClick(project.id.toString())}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
