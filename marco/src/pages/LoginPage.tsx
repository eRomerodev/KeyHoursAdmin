import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import LoginForm from '../components/LoginForm';
import { authService } from '../services/authService';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<'student' | 'admin'>('student');

  const handleLogin = async (data: any) => {
    console.log('Login data:', data);
    
    try {
      // Usar el servicio de autenticación directamente
      const response = await authService.login({
        ...data,
        isAdmin: loginType === 'admin'
      });
      
      // Redirigir según el tipo de usuario
      if (response.user.user_type === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      // El error se manejará en el LoginForm
    }
  };

  const switchToAdminLogin = () => {
    setLoginType('admin');
  };

  const switchToStudentLogin = () => {
    setLoginType('student');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <Logo size="large" variant="white" />
        </div>
        
        <div className="login-right">
          <div className="login-type-selector">
            <button 
              className={`login-type-btn ${loginType === 'student' ? 'active' : ''}`}
              onClick={switchToStudentLogin}
            >
              Estudiante
            </button>
            <button 
              className={`login-type-btn ${loginType === 'admin' ? 'active' : ''}`}
              onClick={switchToAdminLogin}
            >
              Administrador
            </button>
          </div>
          
          <LoginForm variant={loginType} onSubmit={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
