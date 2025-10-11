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
import StudentsScreenKeyHours from './components/StudentsScreenKeyHours';
import NewProjectKeyHours from './components/NewProjectKeyHours';
import ProjectDetailKeyHours from './components/ProjectDetailKeyHours';
import ApplicantsKeyHours from './components/ApplicantsKeyHours';

// Import new student management page
import StudentsManagementPage from './pages/StudentsManagementPage';

// Import existing pages (keeping for compatibility)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import ConvocatoriasPage from './pages/ConvocatoriasPage';
import ProgresoPage from './pages/ProgresoPage';
import StudentsPage from './pages/StudentsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import StudentProjectDetailPage from './pages/StudentProjectDetailPage';
import NewProjectPage from './pages/NewProjectPage';
import ApplicantsPage from './pages/ApplicantsPage';

// New Landing Page with pixel-perfect components
const NewLandingPage: React.FC = () => {
  return (
    <div>
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
          {/* New pixel-perfect routes */}
          <Route path="/" element={<NewLandingPage />} />
          <Route path="/login-new" element={<UnifiedLogin />} />
          <Route path="/admin/dashboard-new" element={<DashboardAdminKeyHours />} />
          <Route path="/admin/profile-new" element={<ProfileAdminKeyHours />} />
          <Route path="/admin/students-new" element={<StudentsScreenKeyHours />} />
          <Route path="/admin/students-management" element={<StudentsManagementPage />} />
          <Route path="/admin/new-project-new" element={<NewProjectKeyHours />} />
          <Route path="/admin/project/:id" element={<ProjectDetailKeyHours />} />
          <Route path="/admin/applicants-new/:projectId" element={<ApplicantsKeyHours />} />
          
          {/* Legacy routes (keeping for compatibility) */}
          <Route path="/legacy" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          
          {/* Rutas de estudiante */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/project/:id" element={<StudentProjectDetailPage />} />
          <Route path="/student/profile" element={<ProfilePage />} />
          <Route path="/student/convocatorias" element={<ConvocatoriasPage />} />
          <Route path="/student/progreso" element={<ProgresoPage />} />
          
          {/* Rutas adicionales para compatibilidad */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/progreso" element={<ProgresoPage />} />
          
          {/* Rutas de administrador */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<ProfilePage />} />
          <Route path="/admin/students" element={<StudentsPage />} />
          <Route path="/admin/project/:id" element={<ProjectDetailPage />} />
          <Route path="/admin/new-project" element={<NewProjectPage />} />
          <Route path="/admin/applicants/:projectId" element={<ApplicantsPage />} />
          
          {/* Rutas de compatibilidad */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/students" element={<StudentsManagementPage />} />
          <Route path="/new-project" element={<NewProjectPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
