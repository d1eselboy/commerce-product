import React from 'react';
import {
  Grid,
  Card,
  CardContent,
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
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  MoreVert,
  FiberManualRecord,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGetMetricsQuery } from '@/store/api';

// Mock data for campaigns table
const campaignsData = [
  {
    id: '0001',
    status: 'service',
    name: 'VTB Premium Cards',
    charge: 31,
    impressions: 125400,  
    clicks: 890,
    ctr: 0.71,
    progress: 78,
  },
  {
    id: '0002', 
    status: 'active',
    name: 'Sberbank Auto Credit',
    charge: 9,
    impressions: 45600,
    clicks: 234,
    ctr: 0.51,
    progress: 34,
  },
  {
    id: '0003',
    status: 'active', 
    name: 'Tinkoff Business',
    charge: 21,
    impressions: 89200,
    clicks: 567,
    ctr: 0.64,
    progress: 56,
  },
  {
    id: '0004',
    status: 'service',
    name: 'MegaFon Unlimited',
    charge: 31,
    impressions: 156700,
    clicks: 1203,
    ctr: 0.77,
    progress: 89,
  },
  {
    id: '0005',
    status: 'service',
    name: 'Delivery Club Promo',
    charge: 77,
    impressions: 234500,
    clicks: 1876,
    ctr: 0.80,
    progress: 95,
  },
];

// Mock data for charts
const chartData = [
  { name: '00:00', impressions: 120, clicks: 8 },
  { name: '04:00', impressions: 89, clicks: 5 },
  { name: '08:00', impressions: 234, clicks: 15 },
  { name: '12:00', impressions: 567, clicks: 34 },
  { name: '16:00', impressions: 432, clicks: 28 },
  { name: '20:00', impressions: 298, clicks: 19 },
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
          borderRadius: 2,
          border: '1px solid #E5E5EA',
          bgcolor: '#FFFFFF',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 500, color: '#1C1C1E' }}>
            000505
          </Typography>
          <IconButton sx={{ color: '#8E8E93' }}>
            <MoreVert />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FiberManualRecord sx={{ color: '#FF9500', fontSize: 12 }} />
            <Typography variant="body2" sx={{ color: '#1C1C1E', fontWeight: 500 }}>
              Сервис
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#8E8E93' }}>
            31%
          </Typography>
          <Typography variant="body2" sx={{ color: '#8E8E93' }}>
            3201.9 км
          </Typography>
          <Typography variant="body2" sx={{ color: '#8E8E93' }}>
            25 с
          </Typography>
          <Typography variant="body2" sx={{ color: '#8E8E93' }}>
            53 с
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="IOT ошибки: 55, 23, 24"
            size="small"
            sx={{ bgcolor: '#FFF3CD', color: '#856404', border: '1px solid #FFE69C' }}
          />
          <Chip
            label="Разряжен"
            size="small"
            variant="outlined"
            onDelete={() => {}}
          />
          <Chip
            label="Скрыт с аренды"
            size="small"
            variant="outlined"
            onDelete={() => {}}
          />
          <Chip
            label="Склад"
            size="small"
            variant="outlined"
            onDelete={() => {}}
          />
        </Box>
      </Paper>

      {/* Campaigns Table */}
      <Paper
        sx={{
          borderRadius: 2,
          border: '1px solid #E5E5EA',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: '#F5F5F7', py: 1.5 }}>Статус</TableCell>
                <TableCell sx={{ bgcolor: '#F5F5F7', py: 1.5 }}>Номер</TableCell>
                <TableCell sx={{ bgcolor: '#F5F5F7', py: 1.5 }}>Заряд</TableCell>
                <TableCell sx={{ bgcolor: '#F5F5F7', py: 1.5 }}>Показы</TableCell>
                <TableCell sx={{ bgcolor: '#F5F5F7', py: 1.5 }}>Клики</TableCell>
                <TableCell sx={{ bgcolor: '#F5F5F7', py: 1.5 }}>CTR</TableCell>
                <TableCell sx={{ bgcolor: '#F5F5F7', py: 1.5 }}>Прогресс</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaignsData.map((campaign) => (
                <TableRow key={campaign.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FiberManualRecord
                        sx={{
                          color: getStatusColor(campaign.status),
                          fontSize: 12,
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {getStatusText(campaign.status)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {campaign.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{campaign.charge}%</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {campaign.impressions.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {campaign.clicks.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">{campaign.ctr}%</Typography>
                      {campaign.ctr > 0.6 ? (
                        <TrendingUp sx={{ color: '#34C759', fontSize: 16 }} />
                      ) : (
                        <TrendingDown sx={{ color: '#FF3B30', fontSize: 16 }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 120 }}>
                      <LinearProgress
                        variant="determinate"
                        value={campaign.progress}
                        sx={{
                          flexGrow: 1,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#E5E5EA',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: campaign.progress > 80 ? '#FF9500' : '#34C759',
                            borderRadius: 3,
                          },
                        }}
                      />
                      <Typography variant="caption" sx={{ color: '#8E8E93', minWidth: 35 }}>
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