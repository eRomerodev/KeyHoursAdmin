import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import LoginForm from '../components/LoginForm';
import './AdminLoginPage.css';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (data: any) => {
    // TODO: connect admin login form to API
    console.log('Admin login data:', data);
    navigate('/admin-dashboard');
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-left">
          <Logo size="large" variant="white" />
          <div className="admin-subtitle">Administrator</div>
        </div>
        
        <div className="admin-login-right">
          <LoginForm variant="admin" onSubmit={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
