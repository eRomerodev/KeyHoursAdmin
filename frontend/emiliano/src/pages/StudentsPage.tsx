import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { studentService, Student } from '../services/studentService';
import { authService } from '../services/authService';
import './StudentsPage.css';

const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await studentService.getStudents();
      setStudents(studentsData);
      setError('');
    } catch (error) {
      console.error('Error loading students:', error);
      setError('Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.carnet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
  };

  const handleDeleteStudent = async (studentId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
      try {
        await studentService.deleteStudent(studentId);
        await loadStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error al eliminar estudiante');
      }
    }
  };

  const handleCreateStudent = async (studentData: any) => {
    try {
      await studentService.createStudent(studentData);
      await loadStudents();
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating student:', error);
      alert('Error al crear estudiante');
    }
  };

  const handleUpdateStudent = async (studentId: number, studentData: any) => {
    try {
      await studentService.updateStudent(studentId, studentData);
      await loadStudents();
      setEditingStudent(null);
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Error al actualizar estudiante');
    }
  };

  const user = authService.getUser();

  return (
    <div className="students-page">
      <Navbar variant="dashboard" userType="admin" />
      
      <div className="students-content">
        <Sidebar userType="admin" userName={user?.full_name || 'Administrador'} />
        
        <main className="students-main">
          <div className="students-container">
            <div className="students-header">
              <div className="students-title-section">
                <h1 className="students-title">Students</h1>
                <div className="search-bar">
                  <span className="search-icon">🔍</span>
                  <input 
                    type="text" 
                    placeholder="buscar por nombre o carnet" 
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <button 
                className="home-btn"
                onClick={() => navigate('/admin/dashboard')}
              >
                <span className="home-icon">📁</span>
                <span>Projects</span>
              </button>
            </div>
          
            <div className="students-table-container">
              <div className="table-header">
                <h2 className="table-title">Estudiantes</h2>
                <button 
                  className="details-btn"
                  onClick={() => setShowCreateForm(true)}
                >
                  <span className="details-icon">+</span>
                  Nuevo Estudiante
                </button>
              </div>
              
              {loading && (
                <div className="loading-message">
                  Cargando estudiantes...
                </div>
              )}
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              {!loading && !error && (
                <div className="students-table">
                  <div className="table-header-row">
                    <div className="col-header">Estudiante</div>
                    <div className="col-header">Carnet</div>
                    <div className="col-header">Horas Totales</div>
                    <div className="col-header">Proyectos</div>
                    <div className="col-header">Estado</div>
                    <div className="col-header">Acciones</div>
                  </div>
                  
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="table-row">
                      <div className="col-student">
                        <span className="student-avatar">👤</span>
                        <span className="student-name">{student.full_name}</span>
                      </div>
                      <div className="col-carnet">{student.carnet}</div>
                      <div className="col-hours">{student.total_hours}h</div>
                      <div className="col-projects">{student.completed_projects}</div>
                      <div className="col-status">
                        <span className={`status-badge ${student.is_active ? 'active' : 'inactive'}`}>
                          {student.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <div className="col-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditStudent(student)}
                        >
                          Editar
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {filteredStudents.length === 0 && (
                    <div className="empty-state">
                      <p>No se encontraron estudiantes</p>
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

export default StudentsPage;
