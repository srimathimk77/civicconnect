import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';

// Citizen Pages
import CitizenDashboard from './pages/CitizenDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import MyComplaints from './pages/MyComplaints';
import ComplaintDetails from './pages/ComplaintDetails';
import CitizenProfile from './pages/CitizenProfile';
import NotificationsPage from './pages/NotificationsPage';
import FeedbackPage from './pages/FeedbackPage';

// Officer Pages
import OfficerDashboard from './pages/OfficerDashboard';
import DepartmentProfile from './pages/DepartmentProfile';
import AssignedComplaints from './pages/AssignedComplaints';
import OfficerComplaintDetails from './pages/OfficerComplaintDetails';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import AdminComplaintManagement from './pages/AdminComplaintManagement';
import FeedbackMonitoring from './pages/FeedbackMonitoring';
import ReportsPage from './pages/ReportsPage';

// Protected Route Wrapper
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading CivicConnect session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="card" style={{ maxWidth: '500px', margin: '3rem auto', textAlign: 'center' }}>
        <h2 style={{ color: '#dc2626' }}>Access Denied</h2>
        <p style={{ marginTop: '0.5rem', color: '#64748b' }}>You are not authorized to view this page.</p>
        <Navigate to="/login" replace />
      </div>
    );
  }

  return children;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-layout">
        {user && <Sidebar />}
        <main className={user ? "main-content" : "main-content-full"} style={{ padding: user ? '2rem' : '2rem 1.5rem' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Citizen Protected Routes */}
            <Route path="/citizen/dashboard" element={
              <ProtectedRoute allowedRoles={['CITIZEN']}><CitizenDashboard /></ProtectedRoute>
            } />
            <Route path="/citizen/submit-complaint" element={
              <ProtectedRoute allowedRoles={['CITIZEN']}><SubmitComplaint /></ProtectedRoute>
            } />
            <Route path="/citizen/my-complaints" element={
              <ProtectedRoute allowedRoles={['CITIZEN']}><MyComplaints /></ProtectedRoute>
            } />
            <Route path="/citizen/complaints/:id" element={
              <ProtectedRoute allowedRoles={['CITIZEN']}><ComplaintDetails /></ProtectedRoute>
            } />
            <Route path="/citizen/profile" element={
              <ProtectedRoute allowedRoles={['CITIZEN']}><CitizenProfile /></ProtectedRoute>
            } />
            <Route path="/citizen/notifications" element={
              <ProtectedRoute allowedRoles={['CITIZEN']}><NotificationsPage /></ProtectedRoute>
            } />
            <Route path="/citizen/feedback" element={
              <ProtectedRoute allowedRoles={['CITIZEN']}><FeedbackPage /></ProtectedRoute>
            } />

            {/* Officer Protected Routes */}
            <Route path="/officer/dashboard" element={
              <ProtectedRoute allowedRoles={['OFFICER']}><OfficerDashboard /></ProtectedRoute>
            } />
            <Route path="/officer/department-profile" element={
              <ProtectedRoute allowedRoles={['OFFICER']}><DepartmentProfile /></ProtectedRoute>
            } />
            <Route path="/officer/assigned-complaints" element={
              <ProtectedRoute allowedRoles={['OFFICER']}><AssignedComplaints /></ProtectedRoute>
            } />
            <Route path="/officer/complaints/:id" element={
              <ProtectedRoute allowedRoles={['OFFICER']}><OfficerComplaintDetails /></ProtectedRoute>
            } />

            {/* Admin Protected Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><UserManagement /></ProtectedRoute>
            } />
            <Route path="/admin/departments" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><DepartmentManagement /></ProtectedRoute>
            } />
            <Route path="/admin/complaints" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><AdminComplaintManagement /></ProtectedRoute>
            } />
            <Route path="/admin/feedback" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><FeedbackMonitoring /></ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><ReportsPage /></ProtectedRoute>
            } />

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
