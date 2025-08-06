import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  AspectRatio,
  CropSquare,
  Settings,
  Visibility,
} from '@mui/icons-material';

export const Surfaces: React.FC = () => {
  const { t } = useTranslation();

  const surfaces = [
    {
      id: 'promo_block',
      name: 'Промоблоки',
      description: 'Рекламные блоки в основном интерфейсе приложения',
      icon: <AspectRatio sx={{ fontSize: 40 }} />,
      status: 'active',
      impressions: 125670,
      formats: ['JPEG', 'PNG', 'WebP'],
    },
    {
      id: 'map_object',
      name: 'Объекты на карте',
      description: 'Анимированные иконки на карте',
      icon: <CropSquare sx={{ fontSize: 40 }} />,
      status: 'active',
      impressions: 89340,
      formats: ['GIF', 'WebP'],
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Поверхности показа
      </Typography>
      <Typography variant="body1" sx={{ color: '#8E8E93', mb: 4 }}>
        Управление различными типами рекламных поверхностей и их настройками
      </Typography>

      <Grid container spacing={3}>
        {surfaces.map((surface) => (
          <Grid item xs={12} md={6} key={surface.id}>
            <Card 
              sx={{ 
                height: '100%',
                border: '1px solid #E5E5EA',
                borderRadius: '16px',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ color: '#007AFF' }}>
                    {surface.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                      {surface.name}
                    </Typography>
                    <Chip
                      label={surface.status === 'active' ? 'Активна' : 'Неактивна'}
                      size="small"
                      sx={{
                        bgcolor: surface.status === 'active' ? '#E8F5E8' : '#FFF3E0',
                        color: surface.status === 'active' ? '#34C759' : '#FF9500',
                      }}
                    />
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ color: '#8E8E93', mb: 3 }}>
                  {surface.description}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                        Показы
                      </Typography>
                      <Typography variant="h6">
                        {surface.impressions.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                        Статус
                      </Typography>
                      <Typography variant="h6">
                        Активен
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ color: '#8E8E93', mb: 1, display: 'block' }}>
                    Поддерживаемые форматы:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {surface.formats.map((format) => (
                      <Chip
                        key={format}
                        label={format}
                        size="small"
                        sx={{ bgcolor: '#F2F2F7', color: '#1C1C1E' }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    startIcon={<Settings />}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#E5E5EA',
                      color: '#1C1C1E',
                      '&:hover': {
                        bgcolor: '#F2F2F7',
                        borderColor: '#E5E5EA',
                      },
                    }}
                  >
                    Настроить
                  </Button>
                  <Button
                    startIcon={<Visibility />}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#E5E5EA',
                      color: '#1C1C1E',
                      '&:hover': {
                        bgcolor: '#F2F2F7',
                        borderColor: '#E5E5EA',
                      },
                    }}
                  >
                    Предпросмотр
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mt: 4, bgcolor: '#E3F2FD', border: '1px solid #BBDEFB', borderRadius: '16px' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Информация о поверхностях
        </Typography>
        <Typography variant="body2" sx={{ color: '#1976D2', lineHeight: 1.6 }}>
          • <strong>Промоблоки</strong> — основные рекламные блоки, отображаемые в интерфейсе приложения с поддержкой текста и изображений
          <br />
          • <strong>Объекты на карте</strong> — интерактивные анимированные элементы, размещаемые непосредственно на карте
          <br />
          • Каждая поверхность имеет свои требования к форматам и размерам креативов
        </Typography>
      </Paper>
    </Box>
  );
};