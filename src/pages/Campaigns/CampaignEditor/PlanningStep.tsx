import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormHelperText,
  Grid,
  Paper,
  Alert,
  Slider,
  FormControl,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Divider,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import {
  CalendarToday,
  TrendingUp,
  Timeline,
  Warning,
  CheckCircle,
  Info,
  Speed,
} from '@mui/icons-material';
import { mockCampaigns } from '@/store/mockData';

interface PlanningStepProps {
  data: any;
  onChange: (updates: any) => void;
  errors: Record<string, string>;
}

interface CampaignPriority {
  id: string;
  name: string;
  remainingImpressions: number;
  remainingDays: number;
  totalImpressions: number;
  maxTotalImpressions: number;
  priorityScore: number;
  consecutiveCap: number;
  status: 'high' | 'medium' | 'low' | 'warning';
}

export const PlanningStep: React.FC<PlanningStepProps> = ({ data, onChange, errors }) => {
  const { t } = useTranslation();
  const [prioritySimulation, setPrioritySimulation] = useState<CampaignPriority[]>([]);

  // Initialize default values if not set
  useEffect(() => {
    if (data.limitImpressions === undefined) {
      onChange({
        limitImpressions: data.limitImpressions || 100000,
      });
    }
  }, []);

  const handleStartDateChange = (date: Date | null) => {
    onChange({ startDate: date?.toISOString() });
  };

  const handleEndDateChange = (date: Date | null) => {
    onChange({ endDate: date?.toISOString() });
  };

  const handleImpressionLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 0;
    onChange({ limitImpressions: value });
  };


  const calculateDuration = () => {
    if (!data.startDate || !data.endDate) return null;
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateDailyRate = () => {
    const duration = calculateDuration();
    if (!duration || !data.limitImpressions) return 0;
    return Math.ceil(data.limitImpressions / duration);
  };

  // Calculate priority simulation
  useEffect(() => {
    if (data.startDate && data.endDate && data.limitImpressions) {
      const duration = calculateDuration();
      if (!duration) return;

      // Mock competing campaigns for simulation
      const activeCampaigns = mockCampaigns
        .filter(c => c.status === 'active')
        .slice(0, 4); // Take first 4 for demo

      // Add current campaign
      const campaigns = [
        {
          id: 'current',
          name: data.name || 'Новая кампания',
          remainingImpressions: data.limitImpressions,
          remainingDays: duration,
          totalImpressions: data.limitImpressions,
          maxTotalImpressions: Math.max(data.limitImpressions, 500000), // Assume max is at least current
          consecutiveCap: data.consecutiveCap || 3,
        },
        ...activeCampaigns.map(c => ({
          id: c.id,
          name: c.name,
          remainingImpressions: Math.floor(c.limitImpressions * (Math.random() * 0.8 + 0.1)), // 10-90% remaining
          remainingDays: Math.floor(Math.random() * 60 + 1), // 1-60 days
          totalImpressions: c.limitImpressions,
          maxTotalImpressions: 500000, // Mock max
          consecutiveCap: c.consecutiveCap,
        }))
      ];

      // Calculate priority scores
      const maxTotal = Math.max(...campaigns.map(c => c.totalImpressions));
      const priorityCampaigns = campaigns.map(campaign => {
        const priorityScore = campaign.remainingDays > 0 
          ? (campaign.remainingImpressions / campaign.remainingDays) * (campaign.totalImpressions / maxTotal)
          : 0;

        let status: 'high' | 'medium' | 'low' | 'warning' = 'medium';
        if (priorityScore > 5000) status = 'high';
        else if (priorityScore > 2000) status = 'medium';  
        else if (priorityScore > 500) status = 'low';
        else status = 'warning';

        return {
          ...campaign,
          priorityScore: Math.round(priorityScore),
          status,
        };
      }).sort((a, b) => b.priorityScore - a.priorityScore);

      setPrioritySimulation(priorityCampaigns);
    }
  }, [data.startDate, data.endDate, data.limitImpressions, data.consecutiveCap, data.name]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      case 'warning': return '#8E8E93';
      default: return '#8E8E93';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      case 'warning': return 'Требует внимания';
      default: return 'Неизвестно';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
          Планирование и приоритизация
        </Typography>
        <Typography variant="body2" sx={{ color: '#8E8E93', mb: 4 }}>
          Настройте расписание кампании и параметры приоритизации в системе показов
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Campaign Schedule */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday sx={{ fontSize: 20, color: '#007AFF' }} />
                Расписание кампании
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Дата начала"
                    value={data.startDate ? new Date(data.startDate) : null}
                    onChange={handleStartDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: Boolean(errors.dates),
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: '#F9F9F9',
                          },
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Дата окончания"
                    value={data.endDate ? new Date(data.endDate) : null}
                    onChange={handleEndDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: Boolean(errors.dates),
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: '#F9F9F9',
                          },
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
              
              {errors.dates && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {errors.dates}
                </FormHelperText>
              )}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Impression Settings */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp sx={{ fontSize: 20, color: '#007AFF' }} />
                Настройки показов
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Общее количество показов"
                    type="number"
                    value={data.limitImpressions || ''}
                    onChange={handleImpressionLimitChange}
                    error={Boolean(errors.limitImpressions)}
                    helperText={errors.limitImpressions || 'Общий лимит показов для кампании'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: '#F9F9F9',
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Priority Algorithm Explanation */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Speed sx={{ fontSize: 20, color: '#007AFF' }} />
                Алгоритм приоритизации
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Формула расчета приоритета:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: '#F0F8FF', p: 1, borderRadius: 1 }}>
                  PriorityScore = (Осталось показов / Осталось дней) × (Всего показов / Макс. показов)
                </Typography>
              </Alert>

              <Typography variant="body2" sx={{ color: '#8E8E93', mb: 2 }}>
                Этот алгоритм обеспечивает сбалансированное распределение показов, предотвращая ситуацию, 
                когда маленькие кампании "съедают" бюджет крупных партнеров.
              </Typography>
            </Box>

            {/* Priority Simulation */}
            {prioritySimulation.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Timeline sx={{ fontSize: 20, color: '#007AFF' }} />
                  Симуляция приоритетов
                </Typography>

                <TableContainer component={Paper} sx={{ borderRadius: '12px', border: '1px solid #E5E5EA' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#F9F9F9' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Позиция</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Кампания</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Осталось показов</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Осталось дней</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Priority Score</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Статус</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {prioritySimulation.map((campaign, index) => (
                        <TableRow 
                          key={campaign.id}
                          sx={{ 
                            bgcolor: campaign.id === 'current' ? '#FFF9E6' : 'transparent',
                            '&:hover': { bgcolor: campaign.id === 'current' ? '#FFF6D3' : '#F9F9F9' },
                          }}
                        >
                          <TableCell>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                color: index < 3 ? '#FF3B30' : '#8E8E93',
                                fontWeight: 600 
                              }}
                            >
                              #{index + 1}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {campaign.name}
                              </Typography>
                              {campaign.id === 'current' && (
                                <Chip 
                                  label="Текущая" 
                                  size="small" 
                                  sx={{ bgcolor: '#FFDD2D', color: '#000', fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {campaign.remainingImpressions.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {campaign.remainingDays} дн.
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 600, 
                                color: getStatusColor(campaign.status) 
                              }}
                            >
                              {campaign.priorityScore.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={getStatusLabel(campaign.status)}
                              size="small"
                              sx={{
                                bgcolor: `${getStatusColor(campaign.status)}20`,
                                color: getStatusColor(campaign.status),
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Это симуляция на основе текущих активных кампаний. Реальные приоритеты будут 
                    пересчитываться динамически при каждом запросе на показ.
                  </Typography>
                </Alert>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            {/* Schedule Summary */}
            <Paper 
              elevation={1}
              sx={{ 
                p: 3, 
                bgcolor: '#F5F5F7', 
                borderRadius: '16px',
                border: '1px solid #E5E5EA',
                mb: 3,
              }}
            >
              <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday sx={{ fontSize: 20, color: '#8E8E93' }} />
                Сводка по расписанию
              </Typography>

              {data.startDate && data.endDate && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Продолжительность
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#1C1C1E' }}>
                    {calculateDuration()} дней
                  </Typography>
                </Box>
              )}

              {data.limitImpressions && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Общее количество показов
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#1C1C1E' }}>
                    {data.limitImpressions.toLocaleString()}
                  </Typography>
                </Box>
              )}

              {calculateDailyRate() > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Показов в день
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                    ~{calculateDailyRate().toLocaleString()}
                  </Typography>
                </Box>
              )}


              {data.startDate && data.endDate && data.limitImpressions && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, bgcolor: '#E8F5E8', borderRadius: '8px' }}>
                  <CheckCircle sx={{ color: '#34C759', fontSize: 16 }} />
                  <Typography variant="caption" sx={{ color: '#34C759', fontWeight: 500 }}>
                    Расписание настроено
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* Algorithm Info */}
            <Paper 
              elevation={1}
              sx={{ 
                p: 3, 
                bgcolor: '#E3F2FD', 
                borderRadius: '16px',
                border: '1px solid #BBDEFB',
              }}
            >
              <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Info sx={{ fontSize: 20, color: '#1976D2' }} />
                Логика приоритизации
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                  Шаг 1: Фильтрация
                </Typography>
                <Typography variant="body2" sx={{ color: '#1976D2', lineHeight: 1.4 }}>
                  • Активные кампании с остатками показов
                  <br />
                  • Исключение нарушающих Consecutive Cap
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                  Шаг 2: Расчет приоритета
                </Typography>
                <Typography variant="body2" sx={{ color: '#1976D2', lineHeight: 1.4 }}>
                  • Учет скорости показов (показы/дни)
                  <br />
                  • Нормализация по размеру кампании
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                  Шаг 3: Выбор креатива
                </Typography>
                <Typography variant="body2" sx={{ color: '#1976D2', lineHeight: 1.4 }}>
                  • A/B тестирование внутри кампании
                  <br />
                  • Учет весов креативов
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};