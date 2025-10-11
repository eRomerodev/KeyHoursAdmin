import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  userType: 'student' | 'admin';
  userName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userType, userName }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const studentMenuItems = [
    { path: '/student/dashboard', label: 'Proyectos', icon: '📁' },
    { path: '/student/profile', label: 'Perfil', icon: '👤' },
    { path: '/student/progreso', label: 'Progreso', icon: '📊' }
  ];

  const adminMenuItems = [
    { path: '/admin-dashboard', label: 'Projects', icon: '📁' },
    { path: '/students', label: 'Students', icon: '👥' }
  ];

  const menuItems = userType === 'admin' ? adminMenuItems : studentMenuItems;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleAddProject = () => {
    navigate('/admin/new-project');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {/* Información del usuario */}
        {userName && (
          <div className="sidebar-user">
            <div className="user-info">
              <span className="user-icon">👤</span>
              <span className="user-name">{userName}</span>
            </div>
          </div>
        )}

        {/* Menú de navegación */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Botón de agregar proyecto (solo para admin y solo en Projects) */}
        {userType === 'admin' && location.pathname === '/admin-dashboard' && (
          <div className="sidebar-add-btn">
            <button className="add-btn" onClick={handleAddProject}>
              <span className="add-icon">+</span>
            </button>
          </div>
        )}

        {/* Botón de regreso */}
        <div className="sidebar-back">
          <button className="back-btn">
            <span className="back-icon">←</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
