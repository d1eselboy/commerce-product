import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Add,
  Search,
  MoreVert,
  Edit,
  Delete,
  FileCopy,
  Pause,
  PlayArrow,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useListCampaignsQuery, useUpdateCampaignMutation } from '@/store/api';
import type { CampaignSummary } from '@/types/campaign';

const statusColors = {
  draft: 'default',
  active: 'success',
  paused: 'warning',
  completed: 'info',
} as const;

interface ActionMenuProps {
  campaign: CampaignSummary;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onTogglePause: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  campaign,
  onEdit,
  onDelete,
  onDuplicate,
  onTogglePause,
}) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: () => void) => {
    action();
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleAction(onEdit)}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          {t('campaigns.edit')}
        </MenuItem>
        <MenuItem onClick={() => handleAction(onDuplicate)}>
          <FileCopy fontSize="small" sx={{ mr: 1 }} />
          {t('campaigns.duplicate')}
        </MenuItem>
        {campaign.status === 'active' ? (
          <MenuItem onClick={() => handleAction(onTogglePause)}>
            <Pause fontSize="small" sx={{ mr: 1 }} />
            {t('campaigns.pause')}
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleAction(onTogglePause)}>
            <PlayArrow fontSize="small" sx={{ mr: 1 }} />
            {t('campaigns.resume')}
          </MenuItem>
        )}
        <MenuItem onClick={() => handleAction(onDelete)} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          {t('campaigns.delete')}
        </MenuItem>
      </Menu>
    </>
  );
};

export const CampaignList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  
  const { data: campaigns, isLoading, error } = useListCampaignsQuery({
    search: search || undefined,
    status: statusFilter.length > 0 ? statusFilter as any : undefined,
  });
  
  const [updateCampaign] = useUpdateCampaignMutation();

  const handleCreateCampaign = () => {
    navigate('/campaigns/new');
  };

  const handleEditCampaign = (id: string) => {
    navigate(`/campaigns/${id}/edit`);
  };

  const handleDeleteCampaign = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      // Implement delete logic
    }
  };

  const handleDuplicateCampaign = (campaign: CampaignSummary) => {
    navigate('/campaigns/new', { state: { duplicateFrom: campaign } });
  };

  const handleTogglePause = async (campaign: CampaignSummary) => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    await updateCampaign({
      id: campaign.id,
      data: { status: newStatus },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const calculateProgress = (done: number, plan: number) => {
    return Math.round((done / plan) * 100);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>{t('common.loading')}</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {t('common.error')}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Filters Bar */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<Add />}
          sx={{
            bgcolor: '#F5F5F7',
            border: 'none',
            color: '#1C1C1E',
            '&:hover': {
              bgcolor: '#E5E5EA',
              border: 'none',
            },
          }}
        >
          Фильтры
        </Button>
      </Box>

      {/* Main Campaign Table */}
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
                <TableCell sx={{ bgcolor: '#F5F5F7', py: 1.5, fontWeight: 500 }}>
                  Статус
                </TableCell>
                <TableCell sx={{ bgcolor: '#F5F5F7', py: 1.5, fontWeight: 500 }}>
                  Название кампании
                </TableCell>
                <TableCell sx={{ bgcolor: '#F5F5F7', py: 1.5, fontWeight: 500 }}>
                  Вес
                </TableCell>
                <TableCell sx={{ bgcolor: '#F5F5F7', py: 1.5, fontWeight: 500 }}>
                  Показы
                </TableCell>
                <TableCell sx={{ bgcolor: '#F5F5F7', py: 1.5, fontWeight: 500 }}>
                  CTR
                </TableCell>
                <TableCell sx={{ bgcolor: '#F5F5F7', py: 1.5, fontWeight: 500 }}>
                  Прогресс
                </TableCell>
                <TableCell sx={{ bgcolor: '#F5F5F7', py: 1.5, fontWeight: 500 }}>
                  Действия
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns?.map((campaign) => {
                const progress = calculateProgress(campaign.impressionsDone, campaign.limitImpressions);
                const statusColor = campaign.status === 'active' ? '#34C759' : 
                                  campaign.status === 'paused' ? '#FF9500' : '#8E8E93';
                const statusText = campaign.status === 'active' ? 'Активная' :
                                 campaign.status === 'paused' ? 'Приостановлена' : 
                                 campaign.status === 'draft' ? 'Черновик' : 'Завершена';
                
                return (
                  <TableRow key={campaign.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: statusColor,
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {statusText}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {campaign.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                        {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{campaign.weight}%</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {campaign.impressionsDone.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                        из {campaign.limitImpressions.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {campaign.ctr ? `${campaign.ctr}%` : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 120 }}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(progress, 100)}
                          sx={{
                            flexGrow: 1,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: '#E5E5EA',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: progress > 80 ? '#FF9500' : progress > 50 ? '#FFDD2D' : '#34C759',
                              borderRadius: 3,
                            },
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#8E8E93', minWidth: 35 }}>
                          {progress}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <ActionMenu
                        campaign={campaign}
                        onEdit={() => handleEditCampaign(campaign.id)}
                        onDelete={() => handleDeleteCampaign(campaign.id)}
                        onDuplicate={() => handleDuplicateCampaign(campaign)}
                        onTogglePause={() => handleTogglePause(campaign)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {campaigns?.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Кампании не найдены
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Создайте первую кампанию для начала работы
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateCampaign}
            sx={{
              bgcolor: '#FFDD2D',
              color: '#000',
              '&:hover': {
                bgcolor: '#E6C429',
              },
            }}
          >
            Создать кампанию
          </Button>
        </Box>
      )}
    </Box>
  );
};