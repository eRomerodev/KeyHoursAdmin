import React from 'react';
import './ProjectCard.css';

interface ProjectCardProps {
  id: string;
  name: string;
  color: string;
  status?: 'available' | 'applied' | 'approved' | 'rejected' | 'completed';
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  id, 
  name, 
  color, 
  status = 'available',
  onClick 
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'applied':
        return (
          <div className="status-badge applied">
            ⏳ Pendiente
          </div>
        );
      case 'approved':
        return (
          <div className="status-badge approved">
            ✅ Aprobado
          </div>
        );
      case 'rejected':
        return (
          <div className="status-badge rejected">
            ❌ Rechazado
          </div>
        );
      case 'completed':
        return (
          <div className="status-badge completed">
            🎯 Completado
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`project-card project-card-${color}`}
      onClick={onClick}
    >
      <div className="project-card-header">
        <div className="project-menu">
          <span className="menu-dots">⋯</span>
        </div>
        {getStatusBadge()}
      </div>
      
      <div className="project-card-content">
        <div className="project-color-block" style={{ backgroundColor: color }}></div>
      </div>
      
      <div className="project-card-footer">
        <span className="project-name">{name}</span>
      </div>
    </div>
  );
};

export default ProjectCard;
