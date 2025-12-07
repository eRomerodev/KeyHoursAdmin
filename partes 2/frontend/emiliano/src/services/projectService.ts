// Servicio para gestión de proyectos
const API_BASE_URL = 'http://localhost:8000/api';

export interface Project {
  id: number;
  name: string;
  description: string;
  manager: {
    id: number;
    full_name: string;
  };
  max_hours: number;
  hour_assignment: 'automatic' | 'manual';
  automatic_hours?: number;
  visibility: 'unpublished' | 'convocatoria' | 'published';
  start_date: string;
  end_date: string;
  max_participants: number;
  current_participants: number;
  is_active: boolean;
  available_spots: number;
  is_accepting_applications: boolean;
  applications_count: number;
  duration_days?: number;
  created_at: string;
  updated_at: string;
  participants?: Participant[];
}

export interface Participant {
  id: number;
  full_name: string;
  email: string;
  carnet: string;
  hours_completed: number;
  status: 'active' | 'inactive' | 'completed';
  joined_at: string;
}

export interface CreateProjectData {
  name: string;
  description: string;
  max_hours: number;
  hour_assignment: 'automatic' | 'manual';
  automatic_hours?: number;
  visibility: 'unpublished' | 'convocatoria' | 'published';
  start_date: string;
  end_date: string;
  max_participants: number;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  max_hours?: number;
  hour_assignment?: 'automatic' | 'manual';
  automatic_hours?: number;
  visibility?: 'unpublished' | 'convocatoria' | 'published';
  start_date?: string;
  end_date?: string;
  max_participants?: number;
  is_active?: boolean;
}

class ProjectService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async getProjects(): Promise<Project[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener proyectos');
      }

      const data = await response.json();
      return data.results || data; // Por si viene paginado
    } catch (error) {
      console.error('Error en getProjects:', error);
      throw error;
    }
  }

  async getPublicProjects(): Promise<Project[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/public/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener proyectos públicos');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error en getPublicProjects:', error);
      throw error;
    }
  }

  async getProject(id: number): Promise<Project> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener proyecto');
      }

      const project = await response.json();
      return project;
    } catch (error) {
      console.error('Error en getProject:', error);
      throw error;
    }
  }

  async createProject(projectData: CreateProjectData): Promise<Project> {
    try {
      const headers = this.getAuthHeaders();
      console.log('🔐 Auth token:', localStorage.getItem('authToken'));
      console.log('👤 User data:', localStorage.getItem('user'));
      console.log('📝 Creando proyecto con headers:', headers);
      console.log('📊 Datos del proyecto:', projectData);

      const response = await fetch(`${API_BASE_URL}/projects/create/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(projectData),
      });

      console.log('📡 Response status:', response.status);
      console.log('✅ Response ok:', response.ok);
      console.log('📄 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = 'Error al crear proyecto';
        try {
          const errorData = await response.json();
          console.error('❌ Error response:', errorData);
          errorMessage = errorData.detail || errorData.error || errorData.message || 'Error al crear proyecto';
        } catch (e) {
          console.error('❌ Error parsing response:', e);
          const responseText = await response.text();
          console.error('📄 Response text:', responseText);
          errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Proyecto creado exitosamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error en createProject:', error);
      throw error;
    }
  }

  async updateProject(id: number, projectData: UpdateProjectData): Promise<Project> {
    try {
      console.log('📤 Actualizando proyecto:', id, projectData);
      
      // Limpiar y validar datos antes de enviar
      const cleanData: any = {};
      
      if (projectData.name !== undefined) cleanData.name = projectData.name.trim();
      if (projectData.description !== undefined) cleanData.description = projectData.description.trim();
      if (projectData.max_hours !== undefined) cleanData.max_hours = Number(projectData.max_hours);
      if (projectData.hour_assignment !== undefined) cleanData.hour_assignment = projectData.hour_assignment;
      if (projectData.automatic_hours !== undefined && projectData.hour_assignment === 'automatic') {
        cleanData.automatic_hours = Number(projectData.automatic_hours);
      }
      if (projectData.visibility !== undefined) cleanData.visibility = projectData.visibility;
      if (projectData.start_date !== undefined) {
        // Asegurar formato de fecha correcto (DateTime con hora)
        const startDate = new Date(projectData.start_date);
        // Si solo viene la fecha (sin hora), agregar hora 00:00:00
        if (projectData.start_date.includes('T')) {
          cleanData.start_date = startDate.toISOString();
        } else {
          // Si viene solo la fecha, agregar hora medianoche UTC
          startDate.setHours(0, 0, 0, 0);
          cleanData.start_date = startDate.toISOString();
        }
      }
      if (projectData.end_date !== undefined) {
        // Asegurar formato de fecha correcto (DateTime con hora)
        const endDate = new Date(projectData.end_date);
        // Si solo viene la fecha (sin hora), agregar hora 23:59:59
        if (projectData.end_date.includes('T')) {
          cleanData.end_date = endDate.toISOString();
        } else {
          // Si viene solo la fecha, agregar hora fin del día UTC
          endDate.setHours(23, 59, 59, 999);
          cleanData.end_date = endDate.toISOString();
        }
      }
      if (projectData.max_participants !== undefined) cleanData.max_participants = Number(projectData.max_participants);
      if (projectData.is_active !== undefined) cleanData.is_active = Boolean(projectData.is_active);
      
      console.log('📤 Datos limpios a enviar:', cleanData);
      
      const response = await fetch(`${API_BASE_URL}/projects/${id}/`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(cleanData),
      });

      const responseData = await response.json();
      console.log('📥 Respuesta del backend:', responseData);

      if (!response.ok) {
        // Extraer mensaje de error más detallado
        let errorMessage = 'Error al actualizar proyecto';
        
        if (responseData.detail) {
          errorMessage = responseData.detail;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else if (typeof responseData === 'object' && responseData !== null) {
          // Si hay errores de validación por campo
          const errorFields = Object.keys(responseData);
          if (errorFields.length > 0) {
            const firstError = responseData[errorFields[0]];
            if (Array.isArray(firstError)) {
              errorMessage = `${errorFields[0]}: ${firstError[0]}`;
            } else if (typeof firstError === 'string') {
              errorMessage = `${errorFields[0]}: ${firstError}`;
            } else if (typeof firstError === 'object') {
              errorMessage = `${errorFields[0]}: ${JSON.stringify(firstError)}`;
            }
          }
        }
        
        console.error('❌ Error del backend:', errorMessage);
        throw new Error(errorMessage);
      }

      const result = responseData;
      console.log('✅ Proyecto actualizado exitosamente:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Error en updateProject:', error);
      throw error;
    }
  }

  async deleteProject(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}/`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar proyecto');
      }
    } catch (error) {
      console.error('Error en deleteProject:', error);
      throw error;
    }
  }

  async publishProject(id: number): Promise<Project> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}/publish/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al publicar proyecto');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en publishProject:', error);
      throw error;
    }
  }

  async joinProject(projectId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/join/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.detail || 'Error al unirse al proyecto');
      }

      const result = await response.json();
      return { success: true, message: result.message || 'Te has unido al proyecto exitosamente' };
    } catch (error) {
      console.error('Error en joinProject:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Error al unirse al proyecto' };
    }
  }

  async leaveProject(projectId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/leave/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.detail || 'Error al salir del proyecto');
      }

      const result = await response.json();
      return { success: true, message: result.message || 'Has salido del proyecto exitosamente' };
    } catch (error) {
      console.error('Error en leaveProject:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Error al salir del proyecto' };
    }
  }

  async getMyProjects(): Promise<Project[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/my-projects/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener mis proyectos');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : (data.results || []);
    } catch (error) {
      console.error('Error en getMyProjects:', error);
      throw error;
    }
  }

  async isUserInProject(projectId: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/is-member/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.is_member || false;
    } catch (error) {
      console.error('Error en isUserInProject:', error);
      return false;
    }
  }

  getProjectColor(index: number): string {
    const colors = [
      '#9c27b0', // Purple
      '#2196f3', // Blue
      '#00bcd4', // Cyan
      '#4caf50', // Green
      '#f44336', // Red
      '#e91e63', // Pink
      '#ff9800', // Orange
      '#795548', // Brown
      '#607d8b', // Blue Grey
      '#3f51b5', // Indigo
    ];
    return colors[index % colors.length];
  }
}

export const projectService = new ProjectService();
