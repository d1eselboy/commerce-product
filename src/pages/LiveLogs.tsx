import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  FormControl,
  Select,
  MenuItem,
  TextField,
  LinearProgress,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Pause,
  PlayArrow,
  Refresh,
  FilterList,
} from '@mui/icons-material';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  campaign: string;
  surface: string;
  event: string;
  details: string;
  userId?: string;
}

export const LiveLogs: React.FC = () => {
  const { t } = useTranslation();
  const [isLive, setIsLive] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock log data generator
  const generateMockLog = (): LogEntry => {
    const campaigns = ['VTB Premium', 'Sberbank Auto', 'Tinkoff Business'];
    const surfaces = ['promo_block', 'map_object'];
    const events = ['impression', 'click', 'error', 'load', 'view'];
    const levels: ('info' | 'warning' | 'error' | 'success')[] = ['info', 'warning', 'error', 'success'];
    
    const level = levels[Math.floor(Math.random() * levels.length)];
    const campaign = campaigns[Math.floor(Math.random() * campaigns.length)];
    const surface = surfaces[Math.floor(Math.random() * surfaces.length)];
    const event = events[Math.floor(Math.random() * events.length)];
    
    return {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date().toLocaleTimeString('ru-RU'),
      level,
      campaign,
      surface,
      event,
      details: `${event} event for ${campaign} on ${surface}`,
      userId: Math.random() > 0.5 ? `user_${Math.floor(Math.random() * 10000)}` : undefined,
    };
  };

  // Simulate live log streaming
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLive) {
      interval = setInterval(() => {
        const newLog = generateMockLog();
        setLogs(prev => [newLog, ...prev.slice(0, 99)]); // Keep only last 100 logs
      }, Math.random() * 2000 + 1000); // Random interval 1-3 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive]);

  // Initial logs
  useEffect(() => {
    const initialLogs = Array.from({ length: 10 }, () => generateMockLog());
    setLogs(initialLogs);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      const newLogs = Array.from({ length: 20 }, () => generateMockLog());
      setLogs(newLogs);
      setLoading(false);
    }, 1000);
  };

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.level === filter;
    const matchesSearch = searchTerm === '' || 
      log.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return '#FF3B30';
      case 'warning': return '#FF9500';
      case 'success': return '#34C759';
      case 'info': 
      default: return '#007AFF';
    }
  };

  const getLevelBgColor = (level: string) => {
    switch (level) {
      case 'error': return '#FFEBEE';
      case 'warning': return '#FFF3E0';
      case 'success': return '#E8F5E8';
      case 'info': 
      default: return '#E3F2FD';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Живые логи системы
          </Typography>
          <Typography variant="body1" sx={{ color: '#8E8E93' }}>
            Мониторинг событий кампаний в реальном времени
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            startIcon={isLive ? <Pause /> : <PlayArrow />}
            onClick={() => setIsLive(!isLive)}
            variant={isLive ? 'contained' : 'outlined'}
            sx={{
              bgcolor: isLive ? '#34C759' : 'transparent',
              borderColor: isLive ? '#34C759' : '#E5E5EA',
              color: isLive ? 'white' : '#1C1C1E',
              '&:hover': {
                bgcolor: isLive ? '#30A855' : '#F2F2F7',
              },
            }}
          >
            {isLive ? 'Пауза' : 'Запустить'}
          </Button>
          
          <Button
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={loading}
            sx={{ color: '#8E8E93' }}
          >
            Обновить
          </Button>
        </Box>
      </Box>

      {/* Status indicator */}
      <Alert
        severity={isLive ? 'success' : 'info'}
        sx={{ mb: 3 }}
        icon={isLive ? <PlayArrow /> : <Pause />}
      >
        {isLive ? 'Логи обновляются в реальном времени' : 'Трансляция логов приостановлена'}
        {isLive && <LinearProgress sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />}
      </Alert>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: '12px', border: '1px solid #E5E5EA' }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <FilterList sx={{ color: '#8E8E93' }} />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ bgcolor: '#F9F9F9' }}
            >
              <MenuItem value="all">Все уровни</MenuItem>
              <MenuItem value="info">Информация</MenuItem>
              <MenuItem value="success">Успех</MenuItem>
              <MenuItem value="warning">Предупреждения</MenuItem>
              <MenuItem value="error">Ошибки</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            size="small"
            placeholder="Поиск по кампании, событию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              minWidth: 250,
              '& .MuiOutlinedInput-root': {
                bgcolor: '#F9F9F9',
              },
            }}
          />
          
          <Typography variant="body2" sx={{ color: '#8E8E93', ml: 'auto' }}>
            Показано: {filteredLogs.length} из {logs.length} записей
          </Typography>
        </Box>
      </Paper>

      {/* Logs table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: '12px', 
          border: '1px solid #E5E5EA',
          maxHeight: '70vh',
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Время</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Уровень</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Кампания</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Поверхность</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Событие</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Детали</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Пользователь</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                  <LinearProgress sx={{ mb: 2 }} />
                  <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                    Загрузка логов...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                    Нет логов для отображения
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow 
                  key={log.id}
                  sx={{ 
                    '&:hover': { 
                      bgcolor: '#F9F9F9' 
                    },
                    animation: isLive && logs[0]?.id === log.id ? 'fadeIn 0.5s ease-in' : 'none',
                    '@keyframes fadeIn': {
                      from: { backgroundColor: '#E8F5E8' },
                      to: { backgroundColor: 'transparent' },
                    },
                  }}
                >
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.level.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: getLevelBgColor(log.level),
                        color: getLevelColor(log.level),
                        fontWeight: 500,
                        fontSize: '0.75rem',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {log.campaign}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.surface}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  </TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>
                    {log.event}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300, wordBreak: 'break-word' }}>
                    {log.details}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#8E8E93' }}>
                    {log.userId || '—'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};