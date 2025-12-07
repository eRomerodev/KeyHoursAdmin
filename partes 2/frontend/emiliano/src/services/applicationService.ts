// Servicio para gestión de aplicaciones - SOLO BACKEND
import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8000/api';

export interface Application {
  id: number;
  project: number;
  project_name?: string;
  user: number;
  user_name?: string;
  user_carnet?: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  motivation: string;
  relevant_experience?: string;
  available_hours_per_week: number;
  start_date_preference: string;
  applied_at: string;
  reviewed_at?: string;
  reviewed_by?: number;
  review_notes?: string;
  hours_completed?: number;
  completion_date?: string;
}

export interface CreateApplicationData {
  project: number;
  motivation: string;
  relevant_experience?: string;
  available_hours_per_week: number;
  start_date_preference: string;
  additional_notes?: string;
}

class ApplicationService {
  private getAuthHeaders(): HeadersInit {
    const token = authService.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }
  
  private async handleAuthError(response: Response): Promise<Response> {
    // Si recibimos un 401, intentar refrescar el token
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
          });
          
          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            const newAccessToken = data.access;
            localStorage.setItem('authToken', newAccessToken);
            // Retornar la respuesta original para que el llamador maneje el error
            return response;
          } else {
            // Si el refresh falla, hacer logout
            authService.logout();
            window.location.href = '/login';
            throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
          }
        } catch (error) {
          authService.logout();
          window.location.href = '/login';
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }
      } else {
        // No hay refresh token, hacer logout
        authService.logout();
        window.location.href = '/login';
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
    }
    
    return response;
  }

  async createApplication(data: CreateApplicationData): Promise<Application> {
    try {
      console.log('📤 Creando aplicación con datos:', data);
      
      // Asegurar que los datos estén en el formato correcto
      const requestData: {
        project: number;
        motivation: string;
        available_hours_per_week: number;
        start_date_preference: string;
        relevant_experience?: string;
        additional_notes?: string;
      } = {
        project: data.project,
        motivation: data.motivation.trim(),
        available_hours_per_week: Number(data.available_hours_per_week),
        start_date_preference: data.start_date_preference,
      };
      
      // Agregar campos opcionales solo si existen
      if (data.relevant_experience) {
        requestData.relevant_experience = data.relevant_experience.trim();
      }
      if (data.additional_notes) {
        requestData.additional_notes = data.additional_notes.trim();
      }
      
      console.log('📤 Datos a enviar:', requestData);
      
      const response = await fetch(`${API_BASE_URL}/applications/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestData),
      });

      // Manejar errores de autenticación
      if (response.status === 401) {
        await this.handleAuthError(response);
        // Si llegamos aquí, el token fue refrescado, reintentar la petición
        const retryResponse = await fetch(`${API_BASE_URL}/applications/`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(requestData),
        });
        const responseData = await retryResponse.json();
        if (!retryResponse.ok) {
          // Manejar error después del retry
          let errorMessage = 'Error al crear aplicación';
          if (responseData.detail) {
            errorMessage = responseData.detail;
          } else if (responseData.error) {
            errorMessage = responseData.error;
          }
          throw new Error(errorMessage);
        }
        const application = responseData;
        console.log('✅ Aplicación creada exitosamente:', application);
        return application;
      }

      const responseData = await response.json();
      console.log('📥 Respuesta del backend:', responseData);

      if (!response.ok) {
        // Extraer mensaje de error más detallado
        let errorMessage = 'Error al crear aplicación';
        
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

      const application = responseData;
      console.log('✅ Aplicación creada exitosamente:', application);
      return application;
    } catch (error: any) {
      console.error('❌ Error en createApplication:', error);
      throw error;
    }
  }

  async getMyApplications(): Promise<Application[]> {
    try {
      let response = await fetch(`${API_BASE_URL}/applications/my-applications/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      // Manejar errores de autenticación
      if (response.status === 401) {
        await this.handleAuthError(response);
        // Reintentar después de refrescar el token
        response = await fetch(`${API_BASE_URL}/applications/my-applications/`, {
          method: 'GET',
          headers: this.getAuthHeaders(),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || 'Error al obtener mis aplicaciones');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : (data.results || []);
    } catch (error: any) {
      console.error('Error en getMyApplications:', error);
      if (error.message.includes('Sesión expirada')) {
        throw error;
      }
      throw new Error(error.message || 'Error al obtener mis aplicaciones');
    }
  }

  async getProjectApplications(projectId: number): Promise<Application[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/project/${projectId}/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener aplicaciones del proyecto');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : (data.results || []);
    } catch (error) {
      console.error('Error en getProjectApplications:', error);
      throw error;
    }
  }

  async getAllApplications(): Promise<Application[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener todas las aplicaciones');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : (data.results || []);
    } catch (error) {
      console.error('Error en getAllApplications:', error);
      throw error;
    }
  }

  async hasAppliedToProject(projectId: number): Promise<boolean> {
    try {
      const applications = await this.getMyApplications();
      return applications.some(app => app.project === projectId);
    } catch (error) {
      console.error('Error en hasAppliedToProject:', error);
      return false;
    }
  }

  async getApplicationStatus(projectId: number): Promise<'available' | 'applied' | 'approved' | 'rejected'> {
    try {
      console.log('🔍 Obteniendo estado de aplicación para proyecto:', projectId);
      const applications = await this.getMyApplications();
      console.log('📋 Mis aplicaciones:', applications);
      
      const application = applications.find(app => app.project === projectId);
      console.log('📝 Aplicación encontrada:', application);
      
      if (!application) {
        console.log('ℹ️ No hay aplicación para este proyecto');
        return 'available';
      }
      
      let status: 'available' | 'applied' | 'approved' | 'rejected' = 'available';
      
      switch (application.status) {
        case 'pending':
          status = 'applied';
          break;
        case 'approved':
        case 'in_progress':
          status = 'approved';
          break;
        case 'rejected':
          status = 'rejected';
          break;
        case 'completed':
          status = 'approved'; // Tratarlo como aprobado si está completado
          break;
        case 'cancelled':
          status = 'available'; // Si está cancelado, puede aplicar de nuevo
          break;
        default:
          status = 'available';
      }
      
      console.log('✅ Estado determinado:', status);
      return status;
    } catch (error) {
      console.error('❌ Error en getApplicationStatus:', error);
      return 'available';
    }
  }

  async reviewApplication(applicationId: number, status: 'approved' | 'rejected', reviewNotes?: string): Promise<Application> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/review/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          status,
          review_notes: reviewNotes || '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al revisar aplicación');
      }

      const application = await response.json();
      return application;
    } catch (error) {
      console.error('Error en reviewApplication:', error);
      throw error;
    }
  }

  async cancelApplication(applicationId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/cancel/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cancelar aplicación');
      }
    } catch (error) {
      console.error('Error en cancelApplication:', error);
      throw error;
    }
  }

  async getApplication(applicationId: number): Promise<Application> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener aplicación');
      }

      const application = await response.json();
      return application;
    } catch (error) {
      console.error('Error en getApplication:', error);
      throw error;
    }
  }
}

export const applicationService = new ApplicationService();
