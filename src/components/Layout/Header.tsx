import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Search,
  Add,
  Notifications,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E5EA',
        left: 60, // Account for sidebar width
        width: 'calc(100% - 60px)',
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: 3 }}>
        {/* Page Title */}
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#1C1C1E',
            fontWeight: 500,
            mr: 4,
          }}
        >
          {title || 'Дашборд'}
        </Typography>

        
        

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={() => navigate('/campaigns/new')}
            sx={{
              backgroundColor: '#FFDD2D',
              color: '#000',
              '&:hover': {
                backgroundColor: '#E6C429',
              },
            }}
          >
            <Add />
          </IconButton>
          

        </Box>
      </Toolbar>
    </AppBar>
  );
};