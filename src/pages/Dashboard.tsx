import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  MoreVert,
  FiberManualRecord,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Mock data for campaigns table
const campaignsData = [
  {
    id: '0001',
    status: 'service',
    name: 'VTB Premium Cards',
    charge: 31,
    impressions: 125400,  
    clicks: 890,
    progress: 78,
  },
  {
    id: '0002', 
    status: 'active',
    name: 'Sberbank Auto Credit',
    charge: 9,
    impressions: 45600,
    clicks: 234,
    progress: 34,
  },
  {
    id: '0003',
    status: 'active', 
    name: 'Tinkoff Business',
    charge: 21,
    impressions: 89200,
    clicks: 567,
    progress: 56,
  },
  {
    id: '0004',
    status: 'service',
    name: 'MegaFon Unlimited',
    charge: 31,
    impressions: 156700,
    clicks: 1203,
    progress: 89,
  },
  {
    id: '0005',
    status: 'service',
    name: 'Delivery Club Promo',
    charge: 77,
    impressions: 234500,
    clicks: 1876,
    progress: 95,
  },
];


export const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'service':
        return '#FF9500';
      case 'active':
        return '#34C759';
      default:
        return '#8E8E93';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'service':
        return 'Сервис';
      case 'active':
        return 'Доступен';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <Box>
      {/* Current Campaign Details */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: '16px',
          border: '1px solid #E5E5EA',
          bgcolor: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1px solid #D1D1D6',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1C1C1E' }}>
            000505
          </Typography>
          <IconButton 
            sx={{ 
              color: '#8E8E93',
              borderRadius: '8px',
              '&:hover': {
                bgcolor: '#F5F5F7',
                color: '#1C1C1E',
              },
            }}
          >
            <MoreVert />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: '#FF9500',
                boxShadow: '0 0 0 2px rgba(255, 149, 0, 0.2)',
              }}
            />
            <Typography variant="body2" sx={{ color: '#1C1C1E', fontWeight: 600 }}>
              Сервис
            </Typography>
          </Box>
          <Box sx={{ width: '1px', height: '20px', bgcolor: '#E5E5EA' }} />
          <Typography variant="body2" sx={{ color: '#8E8E93', fontWeight: 500 }}>
            31%
          </Typography>
          <Typography variant="body2" sx={{ color: '#8E8E93', fontWeight: 500 }}>
            3201.9 км
          </Typography>
          <Typography variant="body2" sx={{ color: '#8E8E93', fontWeight: 500 }}>
            25 с
          </Typography>
          <Typography variant="body2" sx={{ color: '#8E8E93', fontWeight: 500 }}>
            53 с
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            label="IOT ошибки: 55, 23, 24"
            size="small"
            sx={{ 
              bgcolor: '#FFF3CD', 
              color: '#856404', 
              border: '1px solid #FFE69C',
              borderRadius: '8px',
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#FFECB3',
              },
            }}
          />
          <Chip
            label="Разряжен"
            size="small"
            variant="outlined"
            onDelete={() => {}}
            sx={{
              borderRadius: '8px',
              borderColor: '#E5E5EA',
              color: '#8E8E93',
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#F5F5F7',
                borderColor: '#D1D1D6',
              },
            }}
          />
          <Chip
            label="Скрыт с аренды"
            size="small"
            variant="outlined"
            onDelete={() => {}}
            sx={{
              borderRadius: '8px',
              borderColor: '#E5E5EA',
              color: '#8E8E93',
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#F5F5F7',
                borderColor: '#D1D1D6',
              },
            }}
          />
          <Chip
            label="Склад"
            size="small"
            variant="outlined"
            onDelete={() => {}}
            sx={{
              borderRadius: '8px',
              borderColor: '#E5E5EA',
              color: '#8E8E93',
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#F5F5F7',
                borderColor: '#D1D1D6',
              },
            }}
          />
        </Box>
      </Paper>

      {/* Campaigns Table */}
      <Paper
        sx={{
          borderRadius: '16px',
          border: '1px solid #E5E5EA',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1px solid #D1D1D6',
          },
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{ 
                    bgcolor: '#FAFBFC', 
                    py: 2, 
                    px: 3,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#8E8E93',
                    borderBottom: '1px solid #E5E5EA',
                  }}
                >
                  Статус
                </TableCell>
                <TableCell 
                  sx={{ 
                    bgcolor: '#FAFBFC', 
                    py: 2, 
                    px: 3,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#8E8E93',
                    borderBottom: '1px solid #E5E5EA',
                  }}
                >
                  Номер
                </TableCell>
                <TableCell 
                  sx={{ 
                    bgcolor: '#FAFBFC', 
                    py: 2, 
                    px: 3,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#8E8E93',
                    borderBottom: '1px solid #E5E5EA',
                  }}
                >
                  Заряд
                </TableCell>
                <TableCell 
                  sx={{ 
                    bgcolor: '#FAFBFC', 
                    py: 2, 
                    px: 3,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#8E8E93',
                    borderBottom: '1px solid #E5E5EA',
                  }}
                >
                  Показы
                </TableCell>
                <TableCell 
                  sx={{ 
                    bgcolor: '#FAFBFC', 
                    py: 2, 
                    px: 3,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#8E8E93',
                    borderBottom: '1px solid #E5E5EA',
                  }}
                >
                  Клики
                </TableCell>
                <TableCell 
                  sx={{ 
                    bgcolor: '#FAFBFC', 
                    py: 2, 
                    px: 3,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#8E8E93',
                    borderBottom: '1px solid #E5E5EA',
                  }}
                >
                  Прогресс
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaignsData.map((campaign, index) => (
                <TableRow 
                  key={campaign.id} 
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      bgcolor: '#F8F9FA',
                      transform: 'translateY(-1px)',
                    },
                    '&:nth-of-type(even)': {
                      bgcolor: '#FAFBFC',
                    },
                    '&:nth-of-type(even):hover': {
                      bgcolor: '#F0F2F5',
                    },
                  }}
                >
                  <TableCell sx={{ py: 2.5, px: 3, borderBottom: '1px solid #F0F0F0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: getStatusColor(campaign.status),
                          boxShadow: `0 0 0 2px ${getStatusColor(campaign.status)}20`,
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1C1C1E' }}>
                        {getStatusText(campaign.status)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2.5, px: 3, borderBottom: '1px solid #F0F0F0' }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500, color: '#1C1C1E' }}>
                      {campaign.id}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5, px: 3, borderBottom: '1px solid #F0F0F0' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#1C1C1E' }}>
                      {campaign.charge}%
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5, px: 3, borderBottom: '1px solid #F0F0F0' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#1C1C1E' }}>
                      {campaign.impressions.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5, px: 3, borderBottom: '1px solid #F0F0F0' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#1C1C1E' }}>
                      {campaign.clicks.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5, px: 3, borderBottom: '1px solid #F0F0F0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, minWidth: 140 }}>
                      <LinearProgress
                        variant="determinate"
                        value={campaign.progress}
                        sx={{
                          flexGrow: 1,
                          height: 8,
                          borderRadius: '4px',
                          bgcolor: '#E5E5EA',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: campaign.progress > 80 ? '#FF9500' : campaign.progress > 50 ? '#FFDD2D' : '#34C759',
                            borderRadius: '4px',
                            transition: 'all 0.3s ease-in-out',
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#8E8E93', minWidth: 40, fontWeight: 500 }}>
                        {campaign.progress}%
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};