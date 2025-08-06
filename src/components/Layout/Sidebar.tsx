import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Box,
  Avatar,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Timeline,
  Settings,
  Assignment,
  ExitToApp,
  Apps,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useAuth } from '@/hooks/useAuth';

const DRAWER_WIDTH = 60;

const menuItems = [
  { key: 'campaigns', icon: Assignment, path: '/campaigns' },
  { key: 'surfaces', icon: Apps, path: '/surfaces' },
  { key: 'liveLogs', icon: Timeline, path: '/live-logs' },
];

interface SidebarProps {
  variant?: 'permanent' | 'temporary';
  open?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  variant = 'permanent', 
  open = true, 
  onClose 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { logout } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (variant === 'temporary' && onClose) {
      onClose();
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        bgcolor: '#1C1C1E',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
      }}
    >
      {/* Yandex Drive Logo */}
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFDD2D 0%, #FF9500 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          cursor: 'pointer',
        }}
        onClick={() => handleNavigation('/')}
      >
        <Typography
          sx={{
            color: '#000',
            fontWeight: 'bold',
            fontSize: '0.875rem',
          }}
        >
          D
        </Typography>
      </Box>

      {/* Navigation Icons */}
      <List sx={{ flex: 1, width: '100%', px: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            location.pathname.startsWith(item.path) ||
            (item.key === 'campaigns' && location.pathname === '/');
          
          return (
            <ListItem key={item.key} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  minHeight: 44,
                  px: 0,
                  py: 1,
                  borderRadius: 1,
                  justifyContent: 'center',
                  color: isActive ? '#FFDD2D' : '#8E8E93',
                  bgcolor: isActive ? 'rgba(255, 221, 45, 0.1)' : 'transparent',
                  '&:hover': {
                    bgcolor: isActive ? 'rgba(255, 221, 45, 0.15)' : 'rgba(142, 142, 147, 0.1)',
                    color: isActive ? '#FFDD2D' : '#FFFFFF',
                  },
                }}
              >
                <Icon sx={{ fontSize: 20 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User Avatar */}
      <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: '#34C759',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
          onClick={() => handleNavigation('/profile')}
        >
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
        
        {/* Settings & Logout */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <IconButton
            onClick={() => handleNavigation('/settings')}
            sx={{
              color: '#8E8E93',
              '&:hover': { color: '#FFFFFF' },
              p: 0.5,
            }}
          >
            <Settings sx={{ fontSize: 18 }} />
          </IconButton>
          
          <IconButton
            onClick={logout}
            sx={{
              color: '#8E8E93',
              '&:hover': { color: '#FF3B30' },
              p: 0.5,
            }}
          >
            <ExitToApp sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};