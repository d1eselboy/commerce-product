import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from '@/store';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { CampaignList } from '@/pages/Campaigns/CampaignList';
import { CampaignEditor } from '@/pages/Campaigns/CampaignEditor';
import { CampaignDetails } from '@/pages/Campaigns/CampaignDetails';
import { Surfaces } from '@/pages/Surfaces';
import { LiveLogs } from '@/pages/LiveLogs';
import { Settings } from '@/pages/Settings';
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
              <Route path="/campaigns/new" element={<CampaignEditor />} />
              <Route path="/campaigns/:id" element={<CampaignDetails />} />
              <Route path="/campaigns/:id/edit" element={<CampaignEditor />} />
              <Route path="/surfaces" element={<Surfaces />} />
              <Route path="/live-logs" element={<LiveLogs />} />
              <Route path="/settings" element={<Settings />} />
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