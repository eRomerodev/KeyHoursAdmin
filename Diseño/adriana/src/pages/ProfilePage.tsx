import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { authService } from '../services/authService';
import { studentService, Student } from '../services/studentService';
import './ProfilePage.css';

interface ProfileUpdateData {
  username?: string;
  password?: string;
  carnet?: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ProfileUpdateData>({
    username: '',
    password: '',
    carnet: ''
  });
  const [saving, setSaving] = useState(false);
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
          // Inicializar datos de edición
          setEditData({
            username: studentData.username || '',
            password: '', // No mostrar contraseña actual por seguridad
            carnet: studentData.carnet || ''
          });
        } catch (apiError) {
          console.log('No se pudieron cargar datos específicos del estudiante, usando datos del usuario');
          // Usar datos del usuario si no se pueden cargar datos específicos
          const defaultStudent = {
            id: user.id,
            username: user.username,
            full_name: user.full_name || 'Estudiante',
            carnet: user.carnet || 'N/A',
            is_active: true,
            date_joined: new Date().toISOString(),
            total_hours: 0,
            completed_projects: 0,
            projects: []
          } as Student;
          setStudent(defaultStudent);
          // Inicializar datos de edición con datos básicos
          setEditData({
            username: user.username || '',
            password: '', // No mostrar contraseña actual por seguridad
            carnet: user.carnet || ''
          });
        }
      }
    } catch (err) {
      console.error('Error loading student data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    // Restaurar datos originales
    if (student) {
      setEditData({
        username: student.username || '',
        password: '', // No mostrar contraseña actual por seguridad
        carnet: student.carnet || ''
      });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      if (user?.id) {
        const token = authService.getToken();
        console.log('Token actual:', token ? token.substring(0, 50) + '...' : 'No token');
        console.log('Datos a enviar:', editData);
        
        // Llamar directamente al endpoint de actualización de perfil
        const response = await fetch(`http://localhost:8000/api/auth/profile/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.getToken()}`
          },
          body: JSON.stringify(editData),
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          let errorMessage = 'Error al actualizar el perfil';
          try {
            const errorData = await response.json();
            console.log('Error response:', errorData);
            
            if (errorData.error) {
              errorMessage = errorData.error;
            } else if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (typeof errorData === 'object') {
              // Si hay errores de validación específicos
              const firstError = Object.values(errorData)[0];
              if (Array.isArray(firstError)) {
                errorMessage = firstError[0];
              } else if (typeof firstError === 'string') {
                errorMessage = firstError;
              }
            }
          } catch (parseError) {
            console.error('Error parsing error response:', parseError);
          }
          throw new Error(errorMessage);
        }

        const updatedData = await response.json();
        
        // Actualizar el estado local
        if (student) {
          const updatedStudent = {
            ...student,
            username: editData.username || student.username,
            carnet: editData.carnet || student.carnet
          };
          setStudent(updatedStudent);
        }
        
        setIsEditing(false);
        
        // Actualizar datos del usuario en authService
        const updatedUser = {
          ...user,
          username: editData.username || user.username,
          carnet: editData.carnet || user.carnet
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      
      // Mostrar mensaje de error más específico
      if (err.message) {
        setError(err.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Error al actualizar el perfil. Inténtalo de nuevo.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/student/dashboard');
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar variant="dashboard" userType="student" />
        <div className="profile-content">
          <div className="profile-container">
            <p>Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar variant="dashboard" userType="student" />
      
      <div className="profile-content">
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <div className="avatar-icon">👤</div>
              </div>
              
              <div className="profile-info">
                {isEditing ? (
                  <div className="edit-form">
                    {error && (
                      <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                        {error}
                      </div>
                    )}
                    <div className="form-group">
                      <label>Usuario:</label>
                      <input
                        type="text"
                        name="username"
                        value={editData.username}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Nombre de usuario"
                      />
                    </div>
                    <div className="form-group">
                      <label>Contraseña:</label>
                      <input
                        type="password"
                        name="password"
                        value={editData.password}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Nueva contraseña (dejar vacío para no cambiar)"
                      />
                    </div>
                    <div className="form-group">
                      <label>Carnet:</label>
                      <input
                        type="text"
                        name="carnet"
                        value={editData.carnet}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Número de carnet"
                        style={{ textTransform: 'uppercase' }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="profile-name">{student?.full_name || user?.full_name || 'Estudiante'}</h2>
                    <p className="profile-email">Usuario: {student?.username || user?.username}</p>
                    <p className="profile-email">Carnet: {student?.carnet || user?.carnet || 'N/A'}</p>
                    <p className="profile-password">Horas completadas: {student?.total_hours || 0}</p>
                    <p className="profile-password">Proyectos completados: {student?.completed_projects || 0}</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="profile-actions">
              {isEditing ? (
                <>
                  <button 
                    className="edit-btn" 
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <span className="edit-icon">{saving ? '⏳' : '💾'}</span>
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                  
                  <button className="logout-btn" onClick={handleCancel}>
                    <span className="logout-icon">❌</span>
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button className="edit-btn" onClick={handleEdit}>
                    <span className="edit-icon">✏️</span>
                    Editar
                  </button>
                  
                  <button className="logout-btn" onClick={handleLogout}>
                    <span className="logout-icon">←</span>
                    Log out
                  </button>
                </>
              )}
            </div>
            
            <button className="back-btn" onClick={handleBack}>
              <span className="back-icon">←</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
