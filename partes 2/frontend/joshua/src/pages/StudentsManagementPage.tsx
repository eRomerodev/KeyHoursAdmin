import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentsListAdmin from '../components/StudentsListAdmin';
import CreateStudentForm from '../components/CreateStudentForm';
import StudentDetailModal from '../components/StudentDetailModal';
import { studentService, Student } from '../services/studentService';

const StudentsManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateStudent = () => {
    setEditingStudent(null);
    setShowCreateForm(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowCreateForm(true);
  };

  const handleViewStudent = async (student: Student) => {
    try {
      setLoadingDetails(true);
      const detailedStudent = await studentService.getStudentDetail(student.id);
      setViewingStudent(detailedStudent);
    } catch (error) {
      console.error('Error fetching student details:', error);
      alert('Error al obtener detalles del estudiante');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseDetailModal = () => {
    setViewingStudent(null);
  };

  const handleFormSuccess = () => {
    setShowCreateForm(false);
    setEditingStudent(null);
    // Forzar recarga de la lista de estudiantes
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingStudent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 shadow-sm border-b border-blue-600">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Gestión de Estudiantes</h1>
              <p className="mt-1 text-sm text-white/70">
                Administra las credenciales y información de los estudiantes
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              ← Volver al Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full">
        <StudentsListAdmin
          onCreateStudent={handleCreateStudent}
          onEditStudent={handleEditStudent}
          onViewStudent={handleViewStudent}
          refreshTrigger={refreshTrigger}
        />
        </div>
      </main>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <CreateStudentForm
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          editStudent={editingStudent}
        />
      )}

      {/* Student Detail Modal */}
      {viewingStudent && (
        <StudentDetailModal
          student={viewingStudent}
          onClose={handleCloseDetailModal}
        />
      )}

      {/* Loading Overlay */}
      {loadingDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-lg p-6 border border-blue-600">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-white">Cargando detalles del estudiante...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsManagementPage;
