import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './ApplicantsPage.css';

const ApplicantsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const applicants = [
    'Pancracio Filemón Cucharón Sandía',
    'Rigoberto Anacleto Pataflau Melaza',
    'Bartolo Crispí Chancleta Mermelada',
    'Prudenci Jacinto Alfajor Carambola',
    'Fulgencio Renato Chorizo Marmota',
    'Leocadio Faust Pepinillo Carcajadas',
    'Porfirio Aureliano Galleta Pistacho',
    'Tadeo Baldomero Sorbete Gallinazo'
  ];

  const handleApprove = (applicant: string) => {
    // TODO: implement approve functionality
    console.log('Approving:', applicant);
  };

  const handleReject = (applicant: string) => {
    // TODO: implement reject functionality
    console.log('Rejecting:', applicant);
  };

  const handlePublish = () => {
    // TODO: implement publish functionality
    console.log('Publishing project');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="applicants-page">
      <Navbar variant="dashboard" userType="admin" />
      
      <div className="applicants-content">
        <div className="applicants-container">
          <h1 className="applicants-title">Aplicantes | [Nombre del proyecto]</h1>
          
          <div className="applicants-list">
            {applicants.map((applicant, index) => (
              <div key={index} className="applicant-item">
                <div className="applicant-info">
                  <span className="applicant-avatar">👤</span>
                  <span className="applicant-name">{applicant}</span>
                </div>
                
                <div className="applicant-actions">
                  <button 
                    className="approve-btn"
                    onClick={() => handleApprove(applicant)}
                  >
                    ✓
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleReject(applicant)}
                  >
                    ✗
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="applicants-footer">
            <button className="back-btn" onClick={handleBack}>
              <span className="back-icon">←</span>
            </button>
            
            <button className="publish-btn" onClick={handlePublish}>
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsPage;
