import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Edit,
  Delete,
  FileCopy,
  MoreVert,
  CalendarToday,
  TrendingUp,
  AspectRatio,
  CropSquare,
  VideoLibrary,
  ArrowBack,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetCampaignQuery, useUpdateCampaignMutation } from '@/store/api';

export const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'pause' | 'resume' | 'delete' | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  
  const { data: campaign, isLoading, error } = useGetCampaignQuery(id!);
  const [updateCampaign] = useUpdateCampaignMutation();

  const handleStatusAction = (action: 'pause' | 'resume' | 'delete') => {
    setActionType(action);
    setActionDialogOpen(true);
    setMenuAnchorEl(null);
  };

  const executeAction = async () => {
    if (!campaign || !actionType) return;

    try {
      switch (actionType) {
        case 'pause':
          await updateCampaign({ id: campaign.id, data: { status: 'paused' } });
          break;
        case 'resume':
          await updateCampaign({ id: campaign.id, data: { status: 'active' } });
          break;
        case 'delete':
          // Implement delete logic
          navigate('/campaigns');
          break;
      }
      setActionDialogOpen(false);
      setActionType(null);
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateProgress = (done: number, plan: number) => {
    return Math.round((done / plan) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#34C759';
      case 'paused': return '#FF9500';
      case 'completed': return '#007AFF';
      default: return '#8E8E93';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активная';
      case 'paused': return 'Приостановлена';
      case 'completed': return 'Завершена';
      default: return 'Черновик';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'banner': return <AspectRatio sx={{ fontSize: 16 }} />;
      case 'icon': return <CropSquare sx={{ fontSize: 16 }} />;
      case 'video': return <VideoLibrary sx={{ fontSize: 16 }} />;
      default: return <AspectRatio sx={{ fontSize: 16 }} />;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading campaign details...</Typography>
      </Box>
    );
  }

  if (error || !campaign) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Campaign not found or failed to load
      </Alert>
    );
  }

  const progress = calculateProgress(campaign.impressionsDone, campaign.limitImpressions);
  const statusColor = getStatusColor(campaign.status);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/campaigns')} sx={{ color: '#8E8E93' }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 500 }}>
              {campaign.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: statusColor,
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#8E8E93' }}>
                {getStatusText(campaign.status)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {campaign.status === 'active' ? (
            <Button
              variant="outlined"
              startIcon={<Pause />}
              onClick={() => handleStatusAction('pause')}
              sx={{ borderColor: '#FF9500', color: '#FF9500' }}
            >
              Приостановить
            </Button>
          ) : campaign.status === 'paused' ? (
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={() => handleStatusAction('resume')}
              sx={{
                bgcolor: '#34C759',
                '&:hover': { bgcolor: '#30B456' },
              }}
            >
              Запустить
            </Button>
          ) : null}
          
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}
            sx={{ borderColor: '#E5E5EA', color: '#1C1C1E' }}
          >
            Редактировать
          </Button>

          <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Main Info */}
        <Grid item xs={12} md={8}>
          {/* Campaign Stats */}
          <Paper sx={{ p: 3, mb: 3, border: '1px solid #E5E5EA' }}>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
              Статистика кампании
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                    ПОКАЗЫ
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 500 }}>
                    {campaign.impressionsDone.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                    из {campaign.limitImpressions.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                    CTR
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 500 }}>
                    {campaign.ctr ? `${campaign.ctr}%` : '—'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                    eCPM
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 500 }}>
                    {campaign.ecpm ? `₽${campaign.ecpm}` : '—'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                    ВЕС
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 500 }}>
                    {campaign.weight}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Progress Bar */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Прогресс выполнения
                </Typography>
                <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                  {progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(progress, 100)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#E5E5EA',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: progress > 80 ? '#FF9500' : progress > 50 ? '#FFDD2D' : '#34C759',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          </Paper>

          {/* Campaign Creatives */}
          <Paper sx={{ p: 3, border: '1px solid #E5E5EA' }}>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
              Креативы кампании ({campaign.creativeFiles?.length || 0})
            </Typography>

            {campaign.creativeFiles && campaign.creativeFiles.length > 0 ? (
              <Grid container spacing={2}>
                {campaign.creativeFiles.map((creative: any) => (
                  <Grid item xs={12} sm={6} md={4} key={creative.id}>
                    <Card sx={{ border: '1px solid #E5E5EA' }}>
                      <CardMedia
                        sx={{
                          height: 120,
                          bgcolor: '#F5F5F7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {creative.url ? (
                          <img 
                            src={creative.url} 
                            alt={creative.name}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          getFormatIcon(creative.format)
                        )}
                      </CardMedia>
                      
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                          {creative.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                          {creative.surfaces?.map((surface: string) => (
                            <Chip
                              key={surface}
                              label={surface === 'promo_block' ? 'Promo' : 'Map'}
                              size="small"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                          <Chip
                            label={creative.format}
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </Box>
                        
                        <Typography variant="caption" sx={{ color: '#8E8E93', display: 'block', mb: 1 }}>
                          {creative.dimensions?.width}×{creative.dimensions?.height} • {((creative.size || 0) / 1024).toFixed(1)}KB
                        </Typography>

                        <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                          Вес: {creative.weight}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                В кампании нет креативов
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Right Column - Campaign Info */}
        <Grid item xs={12} md={4}>
          {/* Schedule Info */}
          <Paper sx={{ p: 3, mb: 3, border: '1px solid #E5E5EA' }}>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday sx={{ fontSize: 18, color: '#8E8E93' }} />
              Расписание
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Начало
              </Typography>
              <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                {formatDate(campaign.startDate)}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Окончание
              </Typography>
              <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                {formatDate(campaign.endDate)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Длительность
              </Typography>
              <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                {Math.ceil((new Date(campaign.endDate).getTime() - new Date(campaign.startDate).getTime()) / (1000 * 60 * 60 * 24))} дней
              </Typography>
            </Box>
          </Paper>

          {/* Performance Tips */}
          <Paper 
            sx={{ 
              p: 3, 
              bgcolor: '#FFF3CD', 
              border: '1px solid #FFE69C',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp sx={{ fontSize: 18, color: '#856404' }} />
              Рекомендации
            </Typography>

            <Typography variant="body2" sx={{ color: '#856404', lineHeight: 1.5 }}>
              • Пиковые часы: 9-12 и 18-21 показывают наибольшую вовлеченность
              <br />
              • B2B кампании обычно лучше работают в будние дни
              <br />
              • Учитывайте часовой пояс целевой аудитории
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
      >
        <MenuItem onClick={() => navigate(`/campaigns/new?duplicate=${campaign.id}`)}>
          <FileCopy fontSize="small" sx={{ mr: 1 }} />
          Дублировать
        </MenuItem>
        <MenuItem onClick={() => handleStatusAction('delete')} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Удалить
        </MenuItem>
      </Menu>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'pause' && 'Приостановить кампанию'}
          {actionType === 'resume' && 'Запустить кампанию'}
          {actionType === 'delete' && 'Удалить кампанию'}
        </DialogTitle>
        <DialogContent>
          {actionType === 'delete' ? (
            <Alert severity="warning">
              Вы действительно хотите удалить кампанию "{campaign.name}"? 
              Это действие нельзя отменить.
            </Alert>
          ) : (
            <Typography variant="body2">
              {actionType === 'pause' && `Приостановить кампанию "${campaign.name}"?`}
              {actionType === 'resume' && `Запустить кампанию "${campaign.name}"?`}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>
            Отмена
          </Button>
          <Button 
            onClick={executeAction} 
            variant="contained"
            color={actionType === 'delete' ? 'error' : 'primary'}
            sx={actionType !== 'delete' ? {
              bgcolor: '#FFDD2D',
              color: '#000',
              '&:hover': {
                bgcolor: '#E6C429',
              },
            } : {}}
          >
            {actionType === 'pause' && 'Приостановить'}
            {actionType === 'resume' && 'Запустить'}
            {actionType === 'delete' && 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};