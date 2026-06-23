import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline, Container, Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { store } from './store';
import { theme } from './theme';

// Page Components
import Dashboard from './pages/Dashboard';
import SourceInput from './pages/SourceInput';
import TargetSelection from './pages/TargetSelection';
import Recommendations from './pages/Recommendations';
import MigrationPlan from './pages/MigrationPlan';

/**
 * Navigation Bar Component
 */
const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          🚀 Data Migration Advisor
        </Typography>
        <Button
          color="inherit"
          onClick={() => navigate('/')}
          sx={{ fontWeight: location.pathname === '/' ? 'bold' : 'normal' }}
        >
          Dashboard
        </Button>
        <Button
          color="inherit"
          onClick={() => navigate('/source-input')}
          sx={{ fontWeight: location.pathname === '/source-input' ? 'bold' : 'normal' }}
        >
          Start Assessment
        </Button>
      </Toolbar>
    </AppBar>
  );
};

/**
 * Main Application Component
 * Full-featured migration advisory tool
 */
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <NavigationBar />
            <Container maxWidth="xl" sx={{ py: 4 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/source-input" element={<SourceInput />} />
                <Route path="/target-selection" element={<TargetSelection />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/migration-plan" element={<MigrationPlan />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Container>
          </Box>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;

// Made with Bob
