import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './store';
import { theme } from './theme';

// Layout Components
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Page Components
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import ProjectList from './pages/projects/ProjectList';
import ProjectDetail from './pages/projects/ProjectDetail';
import SourceDiscovery from './pages/discovery/SourceDiscovery';
import SourceDetail from './pages/discovery/SourceDetail';
import TargetConfiguration from './pages/targets/TargetConfiguration';
import MappingEngine from './pages/mapping/MappingEngine';
import MappingDetail from './pages/mapping/MappingDetail';
import MigrationPlanner from './pages/planning/MigrationPlanner';
import MigrationPlanDetail from './pages/planning/MigrationPlanDetail';
import ExecutionTracking from './pages/execution/ExecutionTracking';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';

/**
 * Main Application Component
 * Handles routing and global state management
 */
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Projects */}
              <Route path="/projects" element={<ProjectList />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
              
              {/* Source Discovery */}
              <Route path="/projects/:projectId/discovery" element={<SourceDiscovery />} />
              <Route path="/projects/:projectId/sources/:sourceId" element={<SourceDetail />} />
              
              {/* Target Configuration */}
              <Route path="/projects/:projectId/targets" element={<TargetConfiguration />} />
              
              {/* Mapping Engine */}
              <Route path="/projects/:projectId/mapping" element={<MappingEngine />} />
              <Route path="/projects/:projectId/mappings/:mappingId" element={<MappingDetail />} />
              
              {/* Migration Planning */}
              <Route path="/projects/:projectId/planning" element={<MigrationPlanner />} />
              <Route path="/projects/:projectId/plans/:planId" element={<MigrationPlanDetail />} />
              
              {/* Execution Tracking */}
              <Route path="/projects/:projectId/execution" element={<ExecutionTracking />} />
              
              {/* Reports */}
              <Route path="/reports" element={<Reports />} />
              
              {/* Settings */}
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;

// Made with Bob
