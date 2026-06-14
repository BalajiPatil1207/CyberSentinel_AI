import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { MainLayout } from './layouts/MainLayout';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ThreatMonitoring } from './pages/ThreatMonitoring';
import { PhishingDetection } from './pages/PhishingDetection';
import { MalwareAnalysis } from './pages/MalwareAnalysis';
import { VulnerabilityScanner } from './pages/VulnerabilityScanner';
import { IncidentResponse } from './pages/IncidentResponse';
import { AIAssistant } from './pages/AIAssistant';
import { Alerts } from './pages/Alerts';
import { Reports } from './pages/Reports';
import { UserManagement } from './pages/UserManagement';
import { Settings } from './pages/Settings';

// Route Redirect Helper to handle default path by user role
function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const defaultPath = user.role === 'Employee' ? '/phishing-detection' : '/dashboard';
  return <Navigate to={defaultPath} replace />;
}

// Role-Based Route Gate Component
function RoleProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const defaultPath = user.role === 'Employee' ? '/phishing-detection' : '/dashboard';
    return <Navigate to={defaultPath} replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<MainLayout />}>
              <Route index element={<DashboardRedirect />} />
              
              <Route path="dashboard" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst']}>
                  <Dashboard />
                </RoleProtectedRoute>
              } />
              
              <Route path="threat-monitoring" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst']}>
                  <ThreatMonitoring />
                </RoleProtectedRoute>
              } />
              
              <Route path="phishing-detection" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst', 'Employee']}>
                  <PhishingDetection />
                </RoleProtectedRoute>
              } />
              
              <Route path="malware-analysis" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst']}>
                  <MalwareAnalysis />
                </RoleProtectedRoute>
              } />
              
              <Route path="vulnerability-scanner" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst']}>
                  <VulnerabilityScanner />
                </RoleProtectedRoute>
              } />
              
              <Route path="incident-response" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst']}>
                  <IncidentResponse />
                </RoleProtectedRoute>
              } />
              
              <Route path="ai-assistant" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst', 'Employee']}>
                  <AIAssistant />
                </RoleProtectedRoute>
              } />
              
              <Route path="alerts" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst', 'Employee']}>
                  <Alerts />
                </RoleProtectedRoute>
              } />
              
              <Route path="reports" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst']}>
                  <Reports />
                </RoleProtectedRoute>
              } />
              
              <Route path="users" element={
                <RoleProtectedRoute allowedRoles={['Super Admin']}>
                  <UserManagement />
                </RoleProtectedRoute>
              } />
              
              <Route path="settings" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst', 'Employee']}>
                  <Settings />
                </RoleProtectedRoute>
              } />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
