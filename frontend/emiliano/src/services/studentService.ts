// Servicio para gestión de estudiantes por administradores
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
  username: string;
  password: string;
  password_confirm: string;
  carnet: string;
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
      const response = await fetch(`${API_BASE_URL}/auth/admin/students/${studentId}/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener detalles del estudiante');
      }

      const data: Student = await response.json();
      
      // Verificar si el estudiante está inscrito en algún proyecto simulado
      console.log('🔍 Student detail - checking projects for student:', data.full_name || data.username, 'carnet:', data.carnet);
      const participantsData = JSON.parse(localStorage.getItem('projectParticipants') || '{}');
      console.log('📊 All participants data:', participantsData);
      const studentProjects: ProjectInfo[] = [];
      
      // Buscar en todos los proyectos si este estudiante está inscrito
      for (const projectId of Object.keys(participantsData)) {
        const participants = participantsData[projectId];
        console.log(`🔍 Checking project ${projectId} (${typeof projectId}) with participants:`, participants);
        
        const studentParticipant = participants.find((p: any) => {
          const carnetMatch = p.carnet === data.carnet;
          const nameMatch = p.full_name === data.full_name || p.full_name === data.username;
          const usernameMatch = p.full_name === data.username || p.username === data.username;
          console.log(`🔍 Comparing participant:`, p, 'with student:', data);
          console.log(`🔍 Carnet match:`, carnetMatch, 'Name match:', nameMatch, 'Username match:', usernameMatch);
          return carnetMatch || nameMatch || usernameMatch;
        });
        
        if (studentParticipant) {
          console.log('✅ Found student in project:', projectId, studentParticipant);
          // Intentar obtener el nombre real del proyecto
          let projectName = `Proyecto ${projectId}`;
          try {
            const { projectService } = await import('./projectService');
            const project = await projectService.getProject(parseInt(projectId), false);
            projectName = project.name;
          } catch (error) {
            console.log(`No se pudo obtener el nombre del proyecto ${projectId}, usando nombre por defecto`);
          }
          
          studentProjects.push({
            project_id: parseInt(projectId),
            project_name: projectName,
            hours_completed: studentParticipant.hours_completed || 0,
            status: studentParticipant.status || 'in_progress',
            applied_at: studentParticipant.joined_at || new Date().toISOString()
          });
        } else {
          console.log(`❌ Student not found in project ${projectId}`);
        }
      }
      
      console.log('📋 Final student projects:', studentProjects);
      
      // Si hay proyectos simulados, actualizar los datos del estudiante
      if (studentProjects.length > 0) {
        data.projects = studentProjects;
        data.total_hours = studentProjects.reduce((sum, project) => sum + project.hours_completed, 0);
        data.completed_projects = studentProjects.filter(p => p.status === 'completed').length;
        console.log('✅ Updated student data with projects:', data.projects);
      } else {
        console.log('❌ No projects found for student, checking fallback logic...');
        
        // Fallback: buscar por carnet "00001" específicamente
        const joinedProjects = JSON.parse(localStorage.getItem('joinedProjects') || '[]');
        const projectCounters = JSON.parse(localStorage.getItem('projectCounters') || '{}');
        
        if (joinedProjects.length > 0) {
          console.log('🔄 Fallback: Found joined projects:', joinedProjects);
          const fallbackProjects: ProjectInfo[] = [];
          
          for (const projectId of joinedProjects) {
            const counterValue = projectCounters[projectId] || projectCounters[projectId.toString()];
            if (counterValue > 0) {
              let projectName = `Proyecto ${projectId}`;
              try {
                const { projectService } = await import('./projectService');
                const project = await projectService.getProject(parseInt(projectId), false);
                projectName = project.name;
              } catch (error) {
                console.log(`No se pudo obtener el nombre del proyecto ${projectId}`);
              }
              
              fallbackProjects.push({
                project_id: parseInt(projectId),
                project_name: projectName,
                hours_completed: 0,
                status: 'in_progress',
                applied_at: new Date().toISOString()
              });
            }
          }
          
          if (fallbackProjects.length > 0) {
            data.projects = fallbackProjects;
            data.total_hours = fallbackProjects.reduce((sum, project) => sum + project.hours_completed, 0);
            data.completed_projects = fallbackProjects.filter(p => p.status === 'completed').length;
            console.log('✅ Fallback: Updated student data with projects:', data.projects);
          }
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching student detail:', error);
      throw error;
    }
  }

  async createStudent(studentData: CreateStudentData): Promise<{ user: Student; message: string; temp_password?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/students/create/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear estudiante');
      }

      const data: { user: Student; message: string; temp_password?: string } = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  async updateStudent(studentId: number, updateData: Partial<CreateStudentData>): Promise<{ user: Student; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/students/${studentId}/`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar estudiante');
      }

      const data: { user: Student; message: string } = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating student:', error);
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