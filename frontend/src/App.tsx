import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline, Container, Box } from '@mui/material';
import { store } from './store';
import { theme } from './theme';

// Page Components
import Dashboard from './pages/Dashboard';

/**
 * Main Application Component
 * Simplified demo version with Dashboard only
 */
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
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
