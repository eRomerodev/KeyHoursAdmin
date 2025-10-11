import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { projectService, CreateProjectData } from '../services/projectService';
import { authService } from '../services/authService';
import './NewProjectPage.css';

const NewProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    max_hours: '',
    asignacionHoras: 'automatic' as 'automatic' | 'manual',
    automatic_hours: '',
    start_date: '',
    end_date: '',
    max_participants: '10',
    visibilidad: 'published' as 'unpublished' | 'convocatoria' | 'published'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const projectData: CreateProjectData = {
        name: formData.nombre,
        description: formData.descripcion,
        max_hours: parseInt(formData.max_hours),
        hour_assignment: formData.asignacionHoras,
        automatic_hours: formData.asignacionHoras === 'automatic' ? parseInt(formData.automatic_hours) : undefined,
        visibility: formData.visibilidad,
        start_date: formData.start_date,
        end_date: formData.end_date,
        max_participants: parseInt(formData.max_participants),
      };

      await projectService.createProject(projectData);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error instanceof Error ? error.message : 'Error al crear proyecto');
    } finally {
      setLoading(false);
    }
  };

  const user = authService.getUser();

  return (
    <div className="new-project-page">
      <Navbar variant="dashboard" userType="admin" />
      
      <div className="new-project-content">
        <Sidebar userType="admin" userName={user?.full_name || 'Administrador'} />
        
        <main className="new-project-main">
          <div className="new-project-container">
          <h1 className="new-project-title">Nuevo proyecto</h1>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form className="new-project-form" onSubmit={handleSubmit}>
            <div className="form-columns">
              <div className="form-left">
                <div className="form-field">
                  <label className="form-label">Nombre*</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-field">
                  <label className="form-label">Descripción*</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="form-field">
                  <label className="form-label">Horas máximas*</label>
                  <input
                    type="number"
                    name="max_hours"
                    value={formData.max_hours}
                    onChange={handleInputChange}
                    className="form-input"
                    min="1"
                    required
                  />
                </div>
                
                <div className="form-field">
                  <label className="form-label">Máximo de participantes*</label>
                  <input
                    type="number"
                    name="max_participants"
                    value={formData.max_participants}
                    onChange={handleInputChange}
                    className="form-input"
                    min="1"
                    required
                  />
                </div>
              </div>
              
              <div className="form-right">
                <div className="form-field">
                  <label className="form-label">Asignación de horas*</label>
                  <div className="select-container">
                    <select
                      name="asignacionHoras"
                      value={formData.asignacionHoras}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="automatic">Automática</option>
                      <option value="manual">Manual</option>
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                  
                  {formData.asignacionHoras === 'automatic' && (
                    <div className="form-field">
                      <label className="form-label">Horas automáticas*</label>
                      <input
                        type="number"
                        name="automatic_hours"
                        value={formData.automatic_hours}
                        onChange={handleInputChange}
                        className="form-input"
                        min="1"
                        required
                      />
                      <p className="field-description">
                        Al completar el proyecto se asignará esta cantidad de horas a todos los miembros
                      </p>
                    </div>
                  )}
                  
                  {formData.asignacionHoras === 'manual' && (
                    <p className="field-description">
                      Se asignará horas según el progreso individual de los miembros
                    </p>
                  )}
                </div>
                
                <div className="form-field">
                  <label className="form-label">Fecha de inicio*</label>
                  <input
                    type="datetime-local"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-field">
                  <label className="form-label">Fecha de fin*</label>
                  <input
                    type="datetime-local"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-field">
                  <label className="form-label">Visibilidad*</label>
                  <div className="select-container">
                    <select
                      name="visibilidad"
                      value={formData.visibilidad}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="unpublished">No Publicado</option>
                      <option value="convocatoria">Convocatoria</option>
                      <option value="published">Publicado</option>
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="create-btn"
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewProjectPage;
