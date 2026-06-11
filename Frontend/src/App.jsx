import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

function App() {
  return (
    <Router>
      <DataProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="threat-monitoring" element={<ThreatMonitoring />} />
              <Route path="phishing-detection" element={<PhishingDetection />} />
              <Route path="malware-analysis" element={<MalwareAnalysis />} />
              <Route path="vulnerability-scanner" element={<VulnerabilityScanner />} />
              <Route path="incident-response" element={<IncidentResponse />} />
              <Route path="ai-assistant" element={<AIAssistant />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="reports" element={<Reports />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </DataProvider>
    </Router>
  );
}

export default App;
