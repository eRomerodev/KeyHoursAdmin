import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import new pixel-perfect components
import KeyHoursHero from './components/KeyHoursHero';
import MissionVision from './components/MissionVision';
import ProjectsInspire from './components/ProjectsInspire';
import FooterKey from './components/FooterKey';
import UnifiedLogin from './components/UnifiedLogin';
import DashboardAdminKeyHours from './components/DashboardAdminKeyHours';
import ProfileAdminKeyHours from './components/ProfileAdminKeyHours';
import NewProjectKeyHours from './components/NewProjectKeyHours';
import ProjectDetailKeyHours from './components/ProjectDetailKeyHours';
import ApplicantsKeyHours from './components/ApplicantsKeyHours';

// Import pages
import StudentsManagementPage from './pages/StudentsManagementPage';
import StudentDashboard from './pages/StudentDashboard';
import ProfilePage from './pages/ProfilePage';
import ConvocatoriasPage from './pages/ConvocatoriasPage';
import ProgresoPage from './pages/ProgresoPage';
import StudentProjectDetailPage from './pages/StudentProjectDetailPage';
import SupportPage from './pages/SupportPage';
import InfoPage from './pages/InfoPage';
import QAPage from './pages/QAPage';

// New Landing Page with pixel-perfect components
const NewLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen" style={{
      background: "radial-gradient(1200px 700px at 75% -10%, rgba(76,76,255,0.35), transparent 60%), linear-gradient(110deg, #07070a 0%, #0f1020 25%, #18194a 55%, #2c2eff 100%)",
      position: 'relative',
      overflow: 'hidden'
    }}>
      <KeyHoursHero />
      <MissionVision />
      <ProjectsInspire />
      <FooterKey />
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<NewLandingPage />} />
          
          {/* Login Unificado - Una sola ruta */}
          <Route path="/login" element={<UnifiedLogin />} />
          
          {/* Rutas de estudiante */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/project/:id" element={<StudentProjectDetailPage />} />
          <Route path="/student/profile" element={<ProfilePage />} />
          <Route path="/student/convocatorias" element={<ConvocatoriasPage />} />
          <Route path="/student/progreso" element={<ProgresoPage />} />
          
          {/* Rutas de administrador - Una sola ruta por funcionalidad */}
          <Route path="/admin/dashboard" element={<DashboardAdminKeyHours />} />
          <Route path="/admin/profile" element={<ProfileAdminKeyHours />} />
          <Route path="/admin/students" element={<StudentsManagementPage />} />
          <Route path="/admin/new-project" element={<NewProjectKeyHours />} />
          <Route path="/admin/project/:id" element={<ProjectDetailKeyHours />} />
          <Route path="/admin/applicants/:projectId" element={<ApplicantsKeyHours />} />
          
          {/* Rutas de información y soporte */}
          <Route path="/soporte" element={<SupportPage />} />
          <Route path="/informacion" element={<InfoPage />} />
          <Route path="/qa" element={<QAPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
