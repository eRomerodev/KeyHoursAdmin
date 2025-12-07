import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { authService } from '../services/authService';
import { studentService, Student } from '../services/studentService';
import './ProgresoPage.css';

const ProgresoPage: React.FC = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = authService.getUser();

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      if (user?.id) {
        try {
          const studentData = await studentService.getStudentDetail(user.id);
          setStudent(studentData);
        } catch (apiError) {
          console.log('No se pudieron cargar datos específicos del estudiante, usando datos por defecto');
          // Crear datos por defecto si no se pueden cargar
          setStudent({
            id: user.id,
            username: user.username,
            full_name: user.full_name || 'Estudiante',
            carnet: user.carnet || 'N/A',
            is_active: true,
            date_joined: new Date().toISOString(),
            total_hours: 0,
            completed_projects: 0,
            projects: []
          } as Student);
        }
      } else {
        // Datos por defecto si no hay usuario
        setStudent({
          id: 0,
          username: 'estudiante',
          full_name: 'Estudiante',
          carnet: 'N/A',
          is_active: true,
          date_joined: new Date().toISOString(),
          total_hours: 0,
          completed_projects: 0,
          projects: []
        } as Student);
      }
    } catch (err) {
      console.error('Error loading student data:', err);
      // En caso de error, usar datos por defecto
      setStudent({
        id: user?.id || 0,
        username: user?.username || 'estudiante',
        full_name: user?.full_name || 'Estudiante',
        carnet: user?.carnet || 'N/A',
        is_active: true,
        date_joined: new Date().toISOString(),
        total_hours: 0,
        completed_projects: 0,
        projects: []
      } as Student);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const projects = student?.projects?.map(p => p.project_name) || [];
  const hasProjects = projects.length > 0;

  // Obtener datos de beca del estudiante o valores por defecto
  const scholarshipType = student?.scholarship_type || user?.scholarship_type || 'KEY EXCELLENCE';
  const scholarshipPercentage = student?.scholarship_percentage || user?.scholarship_percentage || 100;

  // Calcular el progreso de horas
  // La meta de horas se calcula basada en el porcentaje de beca
  // Si tiene 100% de beca, necesita 100 horas. Si tiene 50%, necesita 50 horas, etc.
  const targetHours = Math.round((scholarshipPercentage / 100) * 100); // 100 horas base para 100%
  const totalHours = student?.total_hours || 0;
  const completedProjects = student?.completed_projects || 0;
  const progressPercentage = targetHours > 0 ? Math.min((totalHours / targetHours) * 100, 100) : 0;
  const remainingHours = Math.max(targetHours - totalHours, 0);

  if (loading) {
    return (
      <div className="progreso-page">
        <Navbar variant="dashboard" userType="student" />
        <div className="progreso-content">
          <div className="progreso-container">
            <p>Cargando datos del estudiante...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="progreso-page">
        <Navbar variant="dashboard" userType="student" />
        <div className="progreso-content">
          <div className="progreso-container">
            <p>{error}</p>
            <button onClick={loadStudentData} className="back-btn">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="progreso-page">
      <Navbar variant="dashboard" userType="student" />
      
      <div className="progreso-content">
        <div className="progreso-container">
          <div className="progreso-header">
            <button className="back-btn" onClick={handleBack}>
              <span className="back-icon">←</span>
            </button>
            <div className="user-info">
              <span className="user-icon">👤</span>
              <span className="user-name">{user?.full_name || 'Estudiante'}</span>
            </div>
            <h1 className="progreso-title">{scholarshipType}</h1>
            {scholarshipPercentage !== 100 && (
              <p className="progreso-subtitle">{scholarshipPercentage}% de beca</p>
            )}
          </div>
          
          <div className="progreso-main">
            <div className="progreso-left">
              <h3 className="projects-title">Proyectos:</h3>
              {hasProjects ? (
                <ul className="projects-list">
                  {projects.map((project, index) => (
                    <li key={index} className="project-item">
                      {project}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-projects">
                  <p>No tienes proyectos registrados aún.</p>
                  <p>¡Comienza participando en algún proyecto para acumular horas!</p>
                </div>
              )}
            </div>
            
            <div className="progreso-right">
              <div className="progress-circle">
                <div className="circle-content">
                  <div className="progress-text">{progressPercentage.toFixed(0)}% | {completedProjects} proyectos</div>
                </div>
              </div>
              
              <div className="progress-stats">
                <div className="stat-item">
                  <span className={`stat-value ${totalHours > 0 ? 'green' : 'red'}`}>
                    {totalHours} horas {totalHours === 0 ? 'completadas' : 'completadas'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">Meta: {targetHours} horas anuales</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {remainingHours > 0 ? `${remainingHours} horas restantes` : '¡Meta completada!'}
                  </span>
                </div>
                {scholarshipPercentage !== 100 && (
                  <div className="stat-item">
                    <span className="stat-value">Porcentaje de beca: {scholarshipPercentage}%</span>
                  </div>
                )}
              </div>
              
              <div className="progress-filter">
                <button className="filter-btn">
                  Mostrar: Por año ▼
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgresoPage;
