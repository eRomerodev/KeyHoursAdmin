import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, UserPlus, Search } from 'lucide-react';
import { studentService, Student } from '../services/studentService';

interface StudentsListAdminProps {
  onCreateStudent: () => void;
  onEditStudent: (student: Student) => void;
  onViewStudent: (student: Student) => void;
  refreshTrigger?: number; // Prop para forzar recarga
}

const StudentsListAdmin: React.FC<StudentsListAdminProps> = ({
  onCreateStudent,
  onEditStudent,
  onViewStudent,
  refreshTrigger,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStudents();
  }, [refreshTrigger]); // Recargar cuando cambie refreshTrigger

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getStudentsCredentials();
      setStudents(data.students);
      setError('');
    } catch (err) {
      console.error('Error loading students:', err);
      setError('Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: number, studentName: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al estudiante ${studentName}?`)) {
      try {
        await studentService.deleteStudent(studentId);
        await loadStudents();
      } catch (err) {
        console.error('Error deleting student:', err);
        alert('Error al eliminar estudiante');
      }
    }
  };

  const filteredStudents = students.filter(student =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.carnet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-white">Cargando estudiantes...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Estudiantes</h2>
          <p className="text-gray-600">Administra las credenciales y información de los estudiantes</p>
        </div>
        <button
          onClick={onCreateStudent}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <UserPlus size={20} />
          Nuevo Estudiante
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o carnet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estudiante</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Carnet</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Horas</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-semibold">
                      {student.first_name?.[0] || student.username[0].toUpperCase()}{student.last_name?.[0] || student.username[1]?.toUpperCase() || ''}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{student.full_name}</div>
                      <div className="text-sm text-gray-500">
                        Registrado: {studentService.formatDate(student.date_joined)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {student.carnet}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    student.is_active 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {student.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {student.total_hours} hrs
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewStudent(student)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="Ver detalles completos"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEditStudent(student)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="Editar estudiante"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id, student.full_name)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      title="Eliminar estudiante"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <UserPlus size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? 'Intenta con otros términos de búsqueda'
              : 'Comienza creando el primer estudiante'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={onCreateStudent}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Crear Primer Estudiante
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentsListAdmin;
