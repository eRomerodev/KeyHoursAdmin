// Servicio para gestión de estudiantes por administradores
import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8000/api';

export interface Student {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  carnet: string;
  phone?: string;
  date_of_birth?: string;
  profile_picture?: string;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
  total_hours: number;
  completed_projects: number;
  temp_password?: string;
  scholarship_type?: string;
  scholarship_percentage?: number;
  projects?: ProjectInfo[];
  scholarships?: any[];
}

export interface ProjectInfo {
  project_id: number;
  project_name: string;
  status: string;
  hours_completed: number;
  applied_at: string;
}

export interface CreateStudentData {
  username?: string;
  first_name?: string;
  last_name?: string;
  password: string;
  password_confirm: string;
  carnet: string;
  scholarship_type?: string;
  scholarship_percentage?: number;
}

export interface StudentsResponse {
  students: Student[];
  total_count: number;
}

class StudentService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getStudentsCredentials(): Promise<StudentsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/students/credentials/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener credenciales de estudiantes');
      }

      const data: StudentsResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching students credentials:', error);
      throw error;
    }
  }

  async getStudentDetail(studentId: number): Promise<Student> {
    try {
      const user = authService.getUser();
      
      // Si el usuario es estudiante y está viendo sus propios datos, usar endpoint de perfil
      if (user?.user_type === 'student' && user.id === studentId) {
        const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
          method: 'GET',
          headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al obtener perfil del estudiante');
        }

        const profileData = await response.json();
        // Convertir datos de perfil a formato Student
        return {
          id: profileData.id,
          username: profileData.username,
          email: profileData.email,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          full_name: profileData.full_name,
          carnet: profileData.carnet,
          phone: profileData.phone,
          is_active: profileData.is_active,
          date_joined: profileData.date_joined,
          last_login: profileData.last_login,
          total_hours: profileData.total_hours || 0,
          completed_projects: profileData.completed_projects || 0,
          projects: profileData.projects || [],
          scholarship_type: profileData.scholarship_type,
          scholarship_percentage: profileData.scholarship_percentage,
        } as Student;
      }
      
      // Si es admin, usar endpoint de admin
      const response = await fetch(`${API_BASE_URL}/auth/admin/students/${studentId}/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener detalles del estudiante');
      }

      const data: Student = await response.json();
      // Los proyectos del estudiante ya vienen en la respuesta del backend
      return data;
    } catch (error) {
      console.error('Error fetching student detail:', error);
      throw error;
    }
  }

  async createStudent(studentData: CreateStudentData): Promise<{ user: Student; message: string; temp_password?: string }> {
    try {
      console.log('📤 Enviando datos al backend:', studentData);
      
      const response = await fetch(`${API_BASE_URL}/auth/admin/students/create/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(studentData),
      });

      const responseData = await response.json();
      console.log('📥 Respuesta del backend:', responseData);

      if (!response.ok) {
        // Extraer mensaje de error más detallado
        let errorMessage = 'Error al crear estudiante';
        let errorDetails: any = null;
        
        // Prioridad 1: error directo
        if (responseData.error) {
          errorMessage = responseData.error;
          errorDetails = responseData.details || responseData;
        }
        // Prioridad 2: detail
        else if (responseData.detail) {
          errorMessage = responseData.detail;
          errorDetails = responseData.details || responseData;
        }
        // Prioridad 3: details (objeto con errores de validación)
        else if (responseData.details && typeof responseData.details === 'object') {
          errorDetails = responseData.details;
          const errorFields = Object.keys(errorDetails);
          if (errorFields.length > 0) {
            const firstError = errorDetails[errorFields[0]];
            if (Array.isArray(firstError)) {
              errorMessage = `${errorFields[0]}: ${firstError[0]}`;
            } else {
              errorMessage = `${errorFields[0]}: ${firstError}`;
            }
          }
        }
        // Prioridad 4: objeto directo con errores de validación
        else if (typeof responseData === 'object' && responseData !== null) {
          errorDetails = responseData;
          const errorFields = Object.keys(responseData);
          if (errorFields.length > 0) {
            const firstError = responseData[errorFields[0]];
            if (Array.isArray(firstError)) {
              errorMessage = `${errorFields[0]}: ${firstError[0]}`;
            } else if (typeof firstError === 'string') {
              errorMessage = `${errorFields[0]}: ${firstError}`;
            } else {
              errorMessage = `Error en ${errorFields[0]}`;
            }
          }
        }
        // Prioridad 5: string directo
        else if (typeof responseData === 'string') {
          errorMessage = responseData;
        }
        
        console.error('❌ Error del backend:', {
          errorMessage,
          errorDetails,
          fullResponse: responseData,
          status: response.status
        });
        
        // Crear error con más información
        const error = new Error(errorMessage);
        (error as any).details = errorDetails;
        throw error;
      }

      const data: { user: Student; message: string; temp_password?: string } = responseData;
      return data;
    } catch (error) {
      console.error('❌ Error creating student:', error);
      throw error;
    }
  }

  async updateStudent(studentId: number, updateData: Partial<CreateStudentData>): Promise<{ user: Student; message: string }> {
    try {
      console.log('📤 Actualizando estudiante:', studentId, updateData);
      
      // Asegurar que el carnet esté en mayúsculas
      if (updateData.carnet) {
        updateData.carnet = updateData.carnet.toUpperCase().trim();
      }
      
      // Limpiar campos vacíos
      const cleanData: any = {};
      if (updateData.username) cleanData.username = updateData.username.trim();
      if (updateData.carnet) cleanData.carnet = updateData.carnet;
      if (updateData.first_name !== undefined) cleanData.first_name = updateData.first_name?.trim() || '';
      if (updateData.last_name !== undefined) cleanData.last_name = updateData.last_name?.trim() || '';
      if (updateData.scholarship_type) cleanData.scholarship_type = updateData.scholarship_type.trim();
      if (updateData.scholarship_percentage !== undefined && updateData.scholarship_percentage !== null) {
        cleanData.scholarship_percentage = updateData.scholarship_percentage;
      }
      if (updateData.password) {
        cleanData.password = updateData.password;
        cleanData.password_confirm = updateData.password_confirm;
      }
      
      console.log('📤 Datos limpios a enviar:', cleanData);
      
      const response = await fetch(`${API_BASE_URL}/auth/admin/students/${studentId}/`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(cleanData),
      });

      const responseData = await response.json();
      console.log('📥 Respuesta del backend:', responseData);

      if (!response.ok) {
        // Extraer mensaje de error más detallado
        let errorMessage = 'Error al actualizar estudiante';
        
        if (responseData.error) {
          errorMessage = responseData.error;
        } else if (responseData.detail) {
          errorMessage = responseData.detail;
        } else if (responseData.details && typeof responseData.details === 'object') {
          const errorFields = Object.keys(responseData.details);
          if (errorFields.length > 0) {
            const firstError = responseData.details[errorFields[0]];
            if (Array.isArray(firstError)) {
              errorMessage = `${errorFields[0]}: ${firstError[0]}`;
            } else {
              errorMessage = `${errorFields[0]}: ${firstError}`;
            }
          }
        } else if (typeof responseData === 'object' && responseData !== null) {
          const errorFields = Object.keys(responseData);
          if (errorFields.length > 0) {
            const firstError = responseData[errorFields[0]];
            if (Array.isArray(firstError)) {
              errorMessage = `${errorFields[0]}: ${firstError[0]}`;
            } else if (typeof firstError === 'string') {
              errorMessage = `${errorFields[0]}: ${firstError}`;
            }
          }
        }
        
        console.error('❌ Error del backend:', errorMessage);
        throw new Error(errorMessage);
      }

      const data: { user: Student; message: string } = responseData;
      console.log('✅ Estudiante actualizado exitosamente:', data);
      return data;
    } catch (error) {
      console.error('❌ Error updating student:', error);
      throw error;
    }
  }

  async deleteStudent(studentId: number): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/students/${studentId}/`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar estudiante');
      }

      const data: { message: string } = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }

  // Método para validar formato de carnet
  validateCarnet(carnet: string): boolean {
    const carnetRegex = /^[A-Z0-9]+$/;
    return carnetRegex.test(carnet);
  }

  // Método para generar contraseña temporal
  generateTempPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Método para formatear fecha
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  // Método para formatear fecha y hora
  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Método para obtener estudiantes (compatibilidad con componentes existentes)
  async getStudents(): Promise<Student[]> {
    try {
      // Intentar primero con el endpoint de credenciales (requiere admin)
      try {
        const response = await this.getStudentsCredentials();
        return response.students;
      } catch (adminError) {
        // Si falla por permisos de admin, usar el endpoint público
        console.log('Admin endpoint failed, trying public endpoint:', adminError);
        const response = await fetch(`${API_BASE_URL}/auth/students/`, {
          method: 'GET',
          headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al obtener estudiantes');
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }
}

export const studentService = new StudentService();