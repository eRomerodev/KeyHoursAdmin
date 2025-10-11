import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { projectService, Project } from '../services/projectService';
import { authService } from '../services/authService';
import './ProjectDetailPage.css';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
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
  const [saving, setSaving] = useState(false);
  const user = authService.getUser();
  
  // Verificación del tipo de usuario
  const getUserType = () => {
    if (user?.user_type) {
      return user.user_type;
    }
    
    // Verificar localStorage como respaldo
    const rawUser = localStorage.getItem('user');
    if (rawUser) {
      try {
        const parsedUser = JSON.parse(rawUser);
        return parsedUser.user_type;
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
    
    // Por defecto, asumir estudiante
    return 'student';
  };
  
  const userType = getUserType();
  const isAdmin = userType === 'admin';

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError('');
      const projectId = parseInt(id!);
      const data = await projectService.getProject(projectId);
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
    } catch (err) {
      console.error('Error loading project:', err);
      setError('Error al cargar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    // Verificación de seguridad adicional
    if (!user || user.user_type !== 'admin') {
      alert('❌ No tienes permisos para editar proyectos');
      return;
    }
    
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
      setError('');
      const projectId = parseInt(id!);
      
      const updateData = {
        name: editData.name,
        description: editData.description,
        max_hours: editData.max_hours,
        hour_assignment: editData.hour_assignment,
        automatic_hours: editData.hour_assignment === 'automatic' ? editData.automatic_hours : undefined,
        visibility: editData.visibility,
        start_date: editData.start_date,
        end_date: editData.end_date,
        max_participants: editData.max_participants,
        is_active: editData.is_active
      };

      const updatedProject = await projectService.updateProject(projectId, updateData);
      setProject(updatedProject);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating project:', err);
      setError(`Error al actualizar el proyecto: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));
  };


  const handleBack = () => {
    navigate(isAdmin ? '/admin/dashboard' : '/student/dashboard');
  };

  return (
    <div className="project-detail-page">
      <Navbar variant="dashboard" userType={userType} />
      
      <div className="project-detail-content">
        <div className="project-detail-container">
          <div className="project-detail-header">
            <div className="header-actions">
              <button onClick={handleBack} className="back-btn">
                ← Volver
              </button>
              
              {/* Botones de edición SOLO para administradores - TEMPORALMENTE OCULTOS */}
              {false && (
                <div className="edit-actions" style={{marginLeft: '20px'}}>
                  {!isEditing ? (
                    <button 
                      onClick={handleEdit} 
                      className="edit-btn" 
                      style={{
                        background: '#FF4444', 
                        color: 'white', 
                        padding: '15px 30px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        border: '3px solid #FF0000',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                        textTransform: 'uppercase'
                      }}
                    >
                      🔥 EDITAR PROYECTO 🔥
                    </button>
                  ) : (
                    <div className="edit-buttons">
                      <button onClick={handleSave} className="save-btn" disabled={saving}>
                        {saving ? '💾 Guardando...' : '💾 Guardar'}
                      </button>
                      <button onClick={handleCancel} className="cancel-btn">
                        ❌ Cancelar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {loading && (
              <div className="text-center py-8">
                <p className="text-lg">Cargando proyecto...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {!loading && !error && project && (
              <>
                {isEditing ? (
                  <div className="edit-form-header">
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="edit-title-input"
                      placeholder="Nombre del proyecto"
                    />
                  </div>
                ) : (
                  <h1 className="project-detail-title">{project.name}</h1>
                )}
            
            <div className="project-detail-info">
              <div className="info-left">
                <span className="clock-icon">🕐</span>
                    {isEditing && user?.user_type === 'admin' ? (
                      <input
                        type="number"
                        name="max_hours"
                        value={editData.max_hours}
                        onChange={handleInputChange}
                        className="edit-input"
                        placeholder="Horas máximas"
                      />
                    ) : (
                      <span>Max. Hours: {project.max_hours}</span>
                    )}
              </div>
              <div className="info-right">
                    {isEditing && user?.user_type === 'admin' ? (
                      <select
                        name="visibility"
                        value={editData.visibility}
                        onChange={handleInputChange}
                        className="edit-select"
                      >
                        <option value="unpublished">No Publicado</option>
                        <option value="convocatoria">Convocatoria</option>
                        <option value="published">Publicado</option>
                      </select>
                    ) : (
                      <span>Visibilidad: {project.visibility}</span>
                    )}
                    <span>Manager: {project.manager.full_name}</span>
              </div>
            </div>
              </>
            )}
          </div>
          
          {!loading && !error && project && (
          <div className="project-detail-sections">
              {/* Descripción */}
              <div className="section-item description-section">
                <h3 className="section-title">📋 Descripción del Proyecto</h3>
                <div className="description-content">
                  {isEditing ? (
                    <textarea
                      name="description"
                      value={editData.description}
                      onChange={handleInputChange}
                      className="edit-textarea"
                      placeholder="Descripción del proyecto"
                      rows={4}
                    />
                  ) : (
                    <p>{project.description}</p>
                  )}
                </div>
              </div>
              
              {/* Información Principal en Tabla */}
              <div className="section-item info-section">
                <h3 className="section-title">📊 Información del Proyecto</h3>
                <div className="info-table">
                  <div className="table-row">
                    <div className="table-cell label">📅 Fecha de Inicio</div>
                    <div className="table-cell value">
                      {isEditing ? (
                        <input
                          type="date"
                          name="start_date"
                          value={editData.start_date}
                          onChange={handleInputChange}
                          className="edit-input"
                        />
                      ) : (
                        new Date(project.start_date).toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      )}
                    </div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell label">📅 Fecha de Fin</div>
                    <div className="table-cell value">
                      {isEditing ? (
                        <input
                          type="date"
                          name="end_date"
                          value={editData.end_date}
                          onChange={handleInputChange}
                          className="edit-input"
                        />
                      ) : (
                        new Date(project.end_date).toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      )}
                    </div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell label">👥 Máximo de Participantes</div>
                    <div className="table-cell value">
                      {isEditing ? (
                        <input
                          type="number"
                          name="max_participants"
                          value={editData.max_participants}
                          onChange={handleInputChange}
                          className="edit-input"
                          min="1"
                        />
                      ) : (
                        project.max_participants
                      )}
                    </div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell label">✅ Participantes Actuales</div>
                    <div className="table-cell value">{project.current_participants}</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell label">⏰ Asignación de Horas</div>
                    <div className="table-cell value">
                      {isEditing ? (
                        <div className="edit-assignment">
                          <select
                            name="hour_assignment"
                            value={editData.hour_assignment}
                            onChange={handleInputChange}
                            className="edit-select"
                          >
                            <option value="automatic">🤖 Automática</option>
                            <option value="manual">✋ Manual</option>
                          </select>
                          {editData.hour_assignment === 'automatic' && (
                            <input
                              type="number"
                              name="automatic_hours"
                              value={editData.automatic_hours}
                              onChange={handleInputChange}
                              className="edit-input"
                              placeholder="Horas automáticas"
                              min="1"
                            />
                          )}
                        </div>
                      ) : (
                        <span className={`assignment-badge ${project.hour_assignment}`}>
                          {project.hour_assignment === 'automatic' ? '🤖 Automática' : '✋ Manual'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell label">📈 Estado del Proyecto</div>
                    <div className="table-cell value">
                      {isEditing ? (
                        <label className="edit-checkbox">
                          <input
                            type="checkbox"
                            name="is_active"
                            checked={editData.is_active}
                            onChange={handleInputChange}
                          />
                          <span>{editData.is_active ? '✅ Activo' : '❌ Inactivo'}</span>
                        </label>
                      ) : (
                        <span className={`status-badge ${project.is_active ? 'active' : 'inactive'}`}>
                          {project.is_active ? '✅ Activo' : '❌ Inactivo'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Estadísticas Visuales */}
              <div className="section-item stats-section">
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
            
              {/* Aplicaciones para Admin */}
              {user?.user_type === 'admin' && (
            <div className="section-item applications-section">
                  <h3 className="section-title">📝 Aplicaciones</h3>
                  <div className="applications-info">
              <div className="notification-badge">
                <span className="bell-icon">🔔</span>
                      <span className="notification-count">{project.applications_count}</span>
                    </div>
                    <p className="applications-text">Aplicaciones recibidas</p>
                  </div>
              </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
