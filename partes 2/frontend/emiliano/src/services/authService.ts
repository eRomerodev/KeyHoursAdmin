// Servicio de autenticación para conectar con el backend
const API_BASE_URL = 'http://localhost:8000/api';

export interface LoginData {
  usuario: string;
  carnet?: string;
  codigo?: string;
  password: string;
  isAdmin?: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  user_type: 'student' | 'admin';
  carnet: string;
  phone?: string;
  is_active: boolean;
  scholarship_type?: string;
  scholarship_percentage?: number;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
  message: string;
}

class AuthService {
  private token: string | null = null;

  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      // Usar siempre el endpoint de login estándar
      const endpoint = '/auth/login/';
      
      console.log('Intentando login con:', { username: loginData.usuario, isAdmin: loginData.isAdmin });
      
      // Solo enviar los campos que el backend espera
      const requestBody = {
        username: loginData.usuario,
        password: loginData.password
      };

      console.log('Enviando al backend:', requestBody);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        let errorMessage = 'Error de autenticación';
        try {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          errorMessage = errorData.detail || errorData.error || errorData.non_field_errors || 'Error de autenticación';
        } catch (e) {
          console.error('Error parsing response:', e);
          errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data: AuthResponse = await response.json();
      console.log('Login successful:', data);
      
      // Guardar tokens y usuario
      this.token = data.tokens.access;
      localStorage.setItem('authToken', this.token);
      localStorage.setItem('refreshToken', data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('Token guardado:', this.token.substring(0, 50) + '...');
      console.log('Usuario guardado:', data.user);

      return data;
    } catch (error) {
      console.error('Error en login:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:8000');
      }
      throw error;
    }
  }

  getToken(): string | null {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      this.token = storedToken;
    }
    return this.token || storedToken;
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.user_type === 'admin';
  }
}

export const authService = new AuthService();
