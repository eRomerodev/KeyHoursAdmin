import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { authService } from '../services/authService';
import './Navbar.css';

interface NavbarProps {
  variant?: 'landing' | 'dashboard';
  userType?: 'student' | 'admin';
  userName?: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  variant = 'landing', 
  userType = 'student',
  userName 
}) => {
  const navigate = useNavigate();
  
  const getWelcomeText = () => {
    if (userType === 'admin') {
      return 'Bienvenido Administrador!';
    }
    return 'Bienvenido Doer!';
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const getNavbarClass = () => {
    return `navbar navbar-${variant}`;
  };

  return (
    <nav className={getNavbarClass()}>
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <Logo size="medium" variant={variant === 'landing' ? 'white' : 'white'} />
        </Link>
        {variant === 'dashboard' && (
          <div className="navbar-institution">
            <span className="institution-separator">|</span>
            <span className="institution-name">INSTITUTO KRIETE DE INGENIERÍA Y CIENCIAS</span>
          </div>
        )}
      </div>
      
      <div className="navbar-right">
        {variant === 'landing' ? (
          <Link to="/login" className="navbar-login-btn">
            Login
          </Link>
        ) : (
          <div className="navbar-dashboard-actions">
            <div className="navbar-welcome">
              {getWelcomeText()}
            </div>
            <button 
              onClick={handleLogout}
              className="navbar-logout-btn"
              title="Cerrar sesión"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
