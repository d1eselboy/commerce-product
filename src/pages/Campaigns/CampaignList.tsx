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
  LinearProgress,
  Alert,
  Checkbox,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Grid,
  Card,
  CardContent,
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
  FileDownload,
  Tune,
  Visibility,
  FilterList,
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
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<'pause' | 'resume' | 'delete' | 'weight' | null>(null);
  const [bulkWeight, setBulkWeight] = useState(10);
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'weight' | 'impressions' | 'ctr'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
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

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCampaigns(campaigns?.map(c => c.id) || []);
    } else {
      setSelectedCampaigns([]);
    }
  };

  const handleSelectCampaign = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCampaigns(prev => [...prev, id]);
    } else {
      setSelectedCampaigns(prev => prev.filter(cId => cId !== id));
    }
  };

  // Bulk operations
  const handleBulkAction = (action: 'pause' | 'resume' | 'delete' | 'weight') => {
    setBulkAction(action);
    setBulkActionOpen(true);
  };

  const executeBulkAction = async () => {
    if (!bulkAction) return;

    try {
      for (const campaignId of selectedCampaigns) {
        switch (bulkAction) {
          case 'pause':
            await updateCampaign({ id: campaignId, data: { status: 'paused' } });
            break;
          case 'resume':
            await updateCampaign({ id: campaignId, data: { status: 'active' } });
            break;
          case 'weight':
            await updateCampaign({ id: campaignId, data: { weight: bulkWeight } });
            break;
          case 'delete':
            // Implement delete logic
            break;
        }
      }
      setSelectedCampaigns([]);
      setBulkActionOpen(false);
      setBulkAction(null);
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const exportCampaigns = () => {
    const selectedData = campaigns?.filter(c => selectedCampaigns.includes(c.id)) || [];
    const csvContent = [
      ['Name', 'Status', 'Weight', 'Impressions Done', 'Limit', 'CTR', 'eCPM'].join(','),
      ...selectedData.map(c => [
        c.name,
        c.status,
        c.weight,
        c.impressionsDone,
        c.limitImpressions,
        c.ctr || 0,
        c.ecpm || 0,
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaigns.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Sorting
  const sortedCampaigns = React.useMemo(() => {
    if (!campaigns) return [];
    
    return [...campaigns].sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'impressions') {
        aValue = a.impressionsDone;
        bValue = b.impressionsDone;
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [campaigns, sortBy, sortOrder]);

  // Quick stats
  const quickStats = React.useMemo(() => {
    if (!campaigns) return { total: 0, active: 0, paused: 0, totalImpressions: 0, avgCtr: 0 };
    
    const active = campaigns.filter(c => c.status === 'active').length;
    const paused = campaigns.filter(c => c.status === 'paused').length;
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressionsDone, 0);
    const avgCtr = campaigns.reduce((sum, c) => sum + (c.ctr || 0), 0) / campaigns.length;
    
    return {
      total: campaigns.length,
      active,
      paused,
      totalImpressions,
      avgCtr,
    };
  }, [campaigns]);

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
      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              border: '1px solid #E5E5EA',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                border: '1px solid #D1D1D6',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ color: '#8E8E93', fontWeight: 600, letterSpacing: '0.5px' }}>
                ВСЕГО КАМПАНИЙ
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, mt: 1, color: '#1C1C1E' }}>
                {quickStats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              border: '1px solid #E5E5EA',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                border: '1px solid #D1D1D6',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ color: '#8E8E93', fontWeight: 600, letterSpacing: '0.5px' }}>
                АКТИВНЫЕ
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, mt: 1, color: '#34C759' }}>
                {quickStats.active}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              border: '1px solid #E5E5EA',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                border: '1px solid #D1D1D6',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ color: '#8E8E93', fontWeight: 600, letterSpacing: '0.5px' }}>
                ПОКАЗЫ
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, mt: 1, color: '#1C1C1E' }}>
                {quickStats.totalImpressions.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              border: '1px solid #E5E5EA',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                border: '1px solid #D1D1D6',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ color: '#8E8E93', fontWeight: 600, letterSpacing: '0.5px' }}>
                СРЕДНИЙ CTR
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, mt: 1, color: '#1C1C1E' }}>
                {quickStats.avgCtr.toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Поиск кампаний..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 18, color: '#8E8E93' }} />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{
              bgcolor: '#F5F5F7',
              border: 'none',
              color: '#1C1C1E',
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              fontWeight: 600,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                bgcolor: '#E5E5EA',
                border: 'none',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            Фильтры
          </Button>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateCampaign}
          sx={{
            bgcolor: '#FFDD2D',
            color: '#000',
            borderRadius: '12px',
            px: 3,
            py: 1.5,
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(255, 221, 45, 0.3)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              bgcolor: '#E6C429',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 16px rgba(255, 221, 45, 0.4)',
            },
          }}
        >
          Создать кампанию
        </Button>
      </Box>

      {/* Bulk Actions Toolbar */}
      {selectedCampaigns.length > 0 && (
        <Toolbar
          sx={{
            mb: 2,
            bgcolor: '#E3F2FD',
            borderRadius: 1,
            border: '1px solid #BBDEFB',
            minHeight: '56px !important',
          }}
        >
          <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
            {selectedCampaigns.length} кампаний выбрано
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              startIcon={<PlayArrow />}
              onClick={() => handleBulkAction('resume')}
            >
              Запустить
            </Button>
            <Button
              size="small"
              startIcon={<Pause />}
              onClick={() => handleBulkAction('pause')}
            >
              Остановить
            </Button>
            <Button
              size="small"
              startIcon={<Tune />}
              onClick={() => handleBulkAction('weight')}
            >
              Изменить вес
            </Button>
            <Button
              size="small"
              startIcon={<FileDownload />}
              onClick={exportCampaigns}
            >
              Экспорт
            </Button>
            <Button
              size="small"
              startIcon={<Delete />}
              onClick={() => handleBulkAction('delete')}
              sx={{ color: '#FF3B30' }}
            >
              Удалить
            </Button>
          </Box>
        </Toolbar>
      )}

      {/* Main Campaign Table */}
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
                    width: 48,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#8E8E93',
                    borderBottom: '1px solid #E5E5EA',
                  }}
                >
                  <Checkbox
                    indeterminate={selectedCampaigns.length > 0 && selectedCampaigns.length < (campaigns?.length || 0)}
                    checked={campaigns ? selectedCampaigns.length === campaigns.length : false}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    size="small"
                    sx={{
                      color: '#8E8E93',
                      '&.Mui-checked': {
                        color: '#FFDD2D',
                      },
                    }}
                  />
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
                    cursor: 'pointer',
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': {
                      color: '#1C1C1E',
                    },
                  }}
                  onClick={() => {
                    setSortBy('status');
                    setSortOrder(sortBy === 'status' && sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  Статус {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
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
                    cursor: 'pointer',
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': {
                      color: '#1C1C1E',
                    },
                  }}
                  onClick={() => {
                    setSortBy('name');
                    setSortOrder(sortBy === 'name' && sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  Название кампании {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
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
                    cursor: 'pointer',
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': {
                      color: '#1C1C1E',
                    },
                  }}
                  onClick={() => {
                    setSortBy('weight');
                    setSortOrder(sortBy === 'weight' && sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  Вес {sortBy === 'weight' && (sortOrder === 'asc' ? '↑' : '↓')}
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
                    cursor: 'pointer',
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': {
                      color: '#1C1C1E',
                    },
                  }}
                  onClick={() => {
                    setSortBy('impressions');
                    setSortOrder(sortBy === 'impressions' && sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  Показы {sortBy === 'impressions' && (sortOrder === 'asc' ? '↑' : '↓')}
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
                    cursor: 'pointer',
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': {
                      color: '#1C1C1E',
                    },
                  }}
                  onClick={() => {
                    setSortBy('ctr');
                    setSortOrder(sortBy === 'ctr' && sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  CTR {sortBy === 'ctr' && (sortOrder === 'asc' ? '↑' : '↓')}
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
                  Действия
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedCampaigns?.map((campaign) => {
                const progress = calculateProgress(campaign.impressionsDone, campaign.limitImpressions);
                const statusColor = campaign.status === 'active' ? '#34C759' : 
                                  campaign.status === 'paused' ? '#FF9500' : '#8E8E93';
                const statusText = campaign.status === 'active' ? 'Активная' :
                                 campaign.status === 'paused' ? 'Приостановлена' : 
                                 campaign.status === 'draft' ? 'Черновик' : 'Завершена';
                
                return (
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
                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()} sx={{ py: 2.5, px: 3, borderBottom: '1px solid #F0F0F0' }}>
                      <Checkbox
                        checked={selectedCampaigns.includes(campaign.id)}
                        onChange={(e) => handleSelectCampaign(campaign.id, e.target.checked)}
                        size="small"
                        sx={{
                          color: '#8E8E93',
                          '&.Mui-checked': {
                            color: '#FFDD2D',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2.5, px: 3, borderBottom: '1px solid #F0F0F0' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: statusColor,
                            boxShadow: `0 0 0 2px ${statusColor}20`,
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1C1C1E' }}>
                          {statusText}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2.5, px: 3, borderBottom: '1px solid #F0F0F0' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1C1C1E', mb: 0.5 }}>
                        {campaign.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8E8E93', fontWeight: 500 }}>
                        {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2.5, px: 3, borderBottom: '1px solid #F0F0F0' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1C1C1E' }}>
                        {campaign.weight}%
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2.5, px: 3, borderBottom: '1px solid #F0F0F0' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1C1C1E', mb: 0.5 }}>
                        {campaign.impressionsDone.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8E8E93', fontWeight: 500 }}>
                        из {campaign.limitImpressions.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2.5, px: 3, borderBottom: '1px solid #F0F0F0' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1C1C1E' }}>
                        {campaign.ctr ? `${campaign.ctr}%` : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2.5, px: 3, borderBottom: '1px solid #F0F0F0' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, minWidth: 140 }}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(progress, 100)}
                          sx={{
                            flexGrow: 1,
                            height: 8,
                            borderRadius: '4px',
                            bgcolor: '#E5E5EA',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: progress > 80 ? '#FF9500' : progress > 50 ? '#FFDD2D' : '#34C759',
                              borderRadius: '4px',
                              transition: 'all 0.3s ease-in-out',
                            },
                          }}
                        />
                        <Typography variant="body2" sx={{ color: '#8E8E93', minWidth: 40, fontWeight: 500 }}>
                          {progress}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()} sx={{ py: 2.5, px: 3, borderBottom: '1px solid #F0F0F0' }}>
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

      {/* Bulk Action Dialog */}
      <Dialog open={bulkActionOpen} onClose={() => setBulkActionOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {bulkAction === 'pause' && 'Приостановить кампании'}
          {bulkAction === 'resume' && 'Запустить кампании'}
          {bulkAction === 'delete' && 'Удалить кампании'}
          {bulkAction === 'weight' && 'Изменить вес кампаний'}
        </DialogTitle>
        <DialogContent>
          {bulkAction === 'delete' ? (
            <Alert severity="warning">
              Вы действительно хотите удалить {selectedCampaigns.length} кампаний? 
              Это действие нельзя отменить.
            </Alert>
          ) : bulkAction === 'weight' ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Установить новый вес для {selectedCampaigns.length} выбранных кампаний:
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={bulkWeight}
                  onChange={(_, value) => setBulkWeight(value as number)}
                  min={1}
                  max={100}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                  marks={[
                    { value: 1, label: '1%' },
                    { value: 25, label: '25%' },
                    { value: 50, label: '50%' },
                    { value: 75, label: '75%' },
                    { value: 100, label: '100%' },
                  ]}
                  sx={{
                    color: '#FFDD2D',
                    '& .MuiSlider-thumb': {
                      bgcolor: '#FFDD2D',
                    },
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: '#8E8E93', mt: 2, display: 'block' }}>
                Новый вес: {bulkWeight}%
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2">
              {bulkAction === 'pause' && `Приостановить ${selectedCampaigns.length} кампаний?`}
              {bulkAction === 'resume' && `Запустить ${selectedCampaigns.length} кампаний?`}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionOpen(false)}>
            Отмена
          </Button>
          <Button 
            onClick={executeBulkAction} 
            variant="contained"
            color={bulkAction === 'delete' ? 'error' : 'primary'}
            sx={bulkAction !== 'delete' ? {
              bgcolor: '#FFDD2D',
              color: '#000',
              '&:hover': {
                bgcolor: '#E6C429',
              },
            } : {}}
          >
            {bulkAction === 'pause' && 'Приостановить'}
            {bulkAction === 'resume' && 'Запустить'}
            {bulkAction === 'delete' && 'Удалить'}
            {bulkAction === 'weight' && 'Применить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};