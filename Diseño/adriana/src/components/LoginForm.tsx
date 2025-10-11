import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { authService, LoginData } from '../services/authService';

interface LoginFormProps {
  variant?: 'student' | 'admin';
  onSubmit?: (data: LoginData) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ variant = 'student', onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({
    usuario: '',
    carnet: variant === 'student' ? '' : undefined,
    codigo: variant === 'admin' ? '' : undefined,
    password: '',
    isAdmin: variant === 'admin'
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error cuando el usuario escriba
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Si hay un callback personalizado, usarlo
      if (onSubmit) {
        onSubmit(formData);
        return;
      }

      // Si no, usar el servicio de autenticación
      const response = await authService.login(formData);
      
      // Redirigir según el tipo de usuario
      if (response.user.user_type === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  const isAdminForm = variant === 'admin';

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label">usuario:</label>
          <input
            type="text"
            name="usuario"
            value={formData.usuario}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        {!isAdminForm && (
          <div className="form-field">
            <label className="form-label">carnet:</label>
            <input
              type="text"
              name="carnet"
              value={formData.carnet}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
        )}

        <div className="form-field">
          <label className="form-label">password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        {error && (
          <div className="error-message" style={{ color: 'red', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'enter'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
