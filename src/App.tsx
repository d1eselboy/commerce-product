import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import { store, RootState } from '@/store';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { CampaignList } from '@/pages/Campaigns/CampaignList';
import { lightTheme } from '@/theme';
import '@/i18n';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Disabled auth for development - render dashboard directly
  return <>{children}</>;
};

const ThemedApp: React.FC = () => {

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Router>
        <AuthGuard>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/campaigns" element={<CampaignList />} />
              <Route path="/campaigns/new" element={<div>Campaign Editor (Create)</div>} />
              <Route path="/campaigns/:id/edit" element={<div>Campaign Editor (Edit)</div>} />
              <Route path="/creatives" element={<div>Creative Library</div>} />
              <Route path="/surfaces" element={<div>Surface Preview</div>} />
              <Route path="/live-logs" element={<div>Live Logs</div>} />
              <Route path="/settings" element={<div>Settings</div>} />
              <Route path="/auth/callback" element={<div>OAuth Callback</div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainLayout>
        </AuthGuard>
      </Router>
    </ThemeProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  );
}

export default App;