import React from 'react';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setSidebarOpen } from '@/store/uiSlice';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Breadcrumbs } from './Breadcrumbs';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);

  const handleSidebarClose = () => {
    dispatch(setSidebarOpen(false));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header title={title} />
      
      <Sidebar
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? sidebarOpen : true}
        onClose={handleSidebarClose}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: '60px', // Account for sidebar width
          minHeight: '100vh',
          bgcolor: '#F5F5F7',
        }}
      >
        <Toolbar sx={{ minHeight: 64 }} />
        
        <Box sx={{ p: 3 }}>
          <Breadcrumbs />
          
          <Box sx={{ mt: 1 }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};