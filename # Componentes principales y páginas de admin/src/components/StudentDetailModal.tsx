import React from 'react';
import { X, User, CreditCard, Lock, Clock, BookOpen, Calendar } from 'lucide-react';
import { Student, ProjectInfo } from '../services/studentService';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Detalles del Estudiante</h2>
              <p className="text-gray-600">{student.full_name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Main Information */}
          <div className="space-y-6">
            {/* Credenciales */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <User size={20} />
                Credenciales de Acceso
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Nombre de Usuario
                  </label>
                  <div className="bg-white p-3 rounded border border-blue-200 font-mono text-gray-900">
                    {student.username}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    <CreditCard className="inline w-4 h-4 mr-1" />
                    Carnet
                  </label>
                  <div className="bg-white p-3 rounded border border-blue-200 font-mono text-gray-900">
                    {student.carnet}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    <Lock className="inline w-4 h-4 mr-1" />
                    Contraseña
                  </label>
                  <div className="bg-white p-3 rounded border border-blue-200 font-mono text-gray-900">
                    {student.temp_password || 'No disponible'}
                  </div>
                  {!student.temp_password && (
                    <p className="text-xs text-gray-500 mt-1">
                      * La contraseña no está disponible si el estudiante la cambió
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Información General */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} />
                Información General
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Email
                    </label>
                    <div className="bg-white p-3 rounded border border-gray-200 text-gray-900">
                      {student.email}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Fecha de Registro
                  </label>
                  <div className="bg-white p-3 rounded border border-gray-200 text-gray-900">
                    {new Date(student.date_joined).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Último Acceso
                  </label>
                  <div className="bg-white p-3 rounded border border-gray-200 text-gray-900">
                    {student.last_login
                      ? new Date(student.last_login).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Nunca'}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Estado
                  </label>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      student.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen de Horas */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                <Clock size={20} />
                Resumen de Horas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-green-200 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {student.total_hours}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Horas Totales</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-200 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {student.projects?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Proyectos</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-200 text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {student.completed_projects}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Completados</div>
                </div>
              </div>
            </div>

            {/* Proyectos y Horas por Proyecto */}
            {student.projects && student.projects.length > 0 ? (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                  <BookOpen size={20} />
                  Proyectos y Horas por Proyecto
                </h3>
                <div className="space-y-3">
                  {student.projects.map((project: ProjectInfo, index: number) => (
                    <div 
                      key={index}
                      className="bg-white p-4 rounded-lg border border-purple-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{project.project_name}</h4>
                          <p className="text-sm text-gray-600">
                            Fecha de aplicación: {new Date(project.applied_at).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full ml-2 ${
                          project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'approved' ? 'bg-yellow-100 text-yellow-800' :
                          project.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {project.status === 'completed' ? 'Completado' :
                           project.status === 'in_progress' ? 'En Progreso' :
                           project.status === 'approved' ? 'Aprobado' :
                           project.status === 'pending' ? 'Pendiente' :
                           project.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-green-700 font-semibold">
                        <Clock size={16} />
                        {project.hours_completed} horas completadas
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">
                  Este estudiante aún no está inscrito en ningún proyecto
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;

