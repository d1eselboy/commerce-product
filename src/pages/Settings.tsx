import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Save,
  Refresh,
  Delete,
  Add,
  Settings as SettingsIcon,
  Security,
  Notifications,
  Language,
} from '@mui/icons-material';

export const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    defaultConsecutiveCap: 3,
    viewabilityThreshold: 50,
    apiBaseUrl: 'https://api.example.com',
    enableNotifications: true,
    enableAnalytics: true,
    enableDebugMode: false,
    defaultLanguage: 'ru',
    maxFileSize: 5,
    cacheTimeout: 3600,
  });

  const [users] = useState([
    { id: '1', name: 'Иван Иванов', email: 'ivan@example.com', role: 'admin', lastLogin: '2024-01-15 14:30' },
    { id: '2', name: 'Мария Петрова', email: 'maria@example.com', role: 'manager', lastLogin: '2024-01-15 12:15' },
    { id: '3', name: 'Алексей Сидоров', email: 'alexey@example.com', role: 'viewer', lastLogin: '2024-01-14 16:45' },
  ]);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Simulate saving
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getRoleChip = (role: string) => {
    const config = {
      admin: { label: 'Администратор', color: '#FF3B30', bgcolor: '#FFEBEE' },
      manager: { label: 'Менеджер', color: '#FF9500', bgcolor: '#FFF3E0' },
      viewer: { label: 'Наблюдатель', color: '#34C759', bgcolor: '#E8F5E8' },
    };
    const roleConfig = config[role as keyof typeof config] || config.viewer;
    
    return (
      <Chip
        label={roleConfig.label}
        size="small"
        sx={{
          bgcolor: roleConfig.bgcolor,
          color: roleConfig.color,
          fontWeight: 500,
        }}
      />
    );
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Настройки системы
      </Typography>
      <Typography variant="body1" sx={{ color: '#8E8E93', mb: 4 }}>
        Управление глобальными настройками и параметрами системы
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Настройки успешно сохранены
        </Alert>
      )}

      <Paper sx={{ borderRadius: '16px', border: '1px solid #E5E5EA', overflow: 'hidden' }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: '1px solid #E5E5EA', bgcolor: '#F9F9F9' }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, value) => setActiveTab(value)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
              },
            }}
          >
            <Tab 
              icon={<SettingsIcon />} 
              label="Основные" 
              iconPosition="start"
            />
            <Tab 
              icon={<Security />} 
              label="Пользователи" 
              iconPosition="start"
            />
            <Tab 
              icon={<Notifications />} 
              label="Уведомления" 
              iconPosition="start"
            />
            <Tab 
              icon={<Language />} 
              label="Локализация" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ p: 4 }}>
          {/* General Settings */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Глобальные настройки по умолчанию
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Consecutive Cap по умолчанию"
                    type="number"
                    value={settings.defaultConsecutiveCap}
                    onChange={(e) => handleSettingChange('defaultConsecutiveCap', parseInt(e.target.value))}
                    helperText="Максимальное количество последовательных показов"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Порог видимости (%)"
                    type="number"
                    value={settings.viewabilityThreshold}
                    onChange={(e) => handleSettingChange('viewabilityThreshold', parseInt(e.target.value))}
                    helperText="Минимальный процент видимости для засчета показа"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Базовый URL API"
                    value={settings.apiBaseUrl}
                    onChange={(e) => handleSettingChange('apiBaseUrl', e.target.value)}
                    helperText="Основной адрес API для взаимодействия с сервером"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Максимальный размер файла (МБ)"
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                    helperText="Максимальный размер загружаемых файлов"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Время кеша (секунды)"
                    type="number"
                    value={settings.cacheTimeout}
                    onChange={(e) => handleSettingChange('cacheTimeout', parseInt(e.target.value))}
                    helperText="Время жизни кеша в секундах"
                  />
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h6" sx={{ mb: 3 }}>
                Системные флаги
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableAnalytics}
                      onChange={(e) => handleSettingChange('enableAnalytics', e.target.checked)}
                    />
                  }
                  label="Включить аналитику"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableDebugMode}
                      onChange={(e) => handleSettingChange('enableDebugMode', e.target.checked)}
                    />
                  }
                  label="Режим отладки"
                />
              </Box>
            </Box>
          )}

          {/* Users Management */}
          {activeTab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Управление пользователями
                </Typography>
                <Button
                  startIcon={<Add />}
                  variant="contained"
                  sx={{
                    bgcolor: '#FFDD2D',
                    color: '#000',
                    '&:hover': {
                      bgcolor: '#E6C429',
                    },
                  }}
                >
                  Добавить пользователя
                </Button>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Пользователь</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Роль</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Последний вход</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} sx={{ '&:hover': { bgcolor: '#F9F9F9' } }}>
                        <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleChip(user.role)}</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                          {user.lastLogin}
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" sx={{ color: '#8E8E93', mr: 1 }}>
                            <SettingsIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton size="small" sx={{ color: '#FF3B30' }}>
                            <Delete sx={{ fontSize: 18 }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Notifications */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Настройки уведомлений
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableNotifications}
                      onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
                    />
                  }
                  label="Включить уведомления"
                />
                
                <Paper sx={{ p: 3, bgcolor: '#F9F9F9', borderRadius: '12px' }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                    Типы уведомлений
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Достижение лимита показов"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Ошибки в кампаниях"
                    />
                    <FormControlLabel
                      control={<Switch />}
                      label="Завершение кампаний"
                    />
                    <FormControlLabel
                      control={<Switch />}
                      label="Еженедельные отчеты"
                    />
                  </Box>
                </Paper>
              </Box>
            </Box>
          )}

          {/* Localization */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Настройки локализации
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Язык по умолчанию"
                    value={settings.defaultLanguage}
                    onChange={(e) => handleSettingChange('defaultLanguage', e.target.value)}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </TextField>
                </Grid>
              </Grid>
              
              <Alert severity="info" sx={{ mt: 3 }}>
                Изменение языка по умолчанию применится для новых пользователей. 
                Существующие пользователи могут изменить язык в личных настройках.
              </Alert>
            </Box>
          )}
        </Box>
        
        {/* Save Button */}
        <Box 
          sx={{ 
            p: 3, 
            bgcolor: '#F9F9F9', 
            borderTop: '1px solid #E5E5EA',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: '#8E8E93' }}>
            * Изменения будут применены после сохранения
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<Refresh />}
              sx={{ color: '#8E8E93' }}
            >
              Сбросить
            </Button>
            <Button
              startIcon={<Save />}
              variant="contained"
              onClick={handleSave}
              sx={{
                bgcolor: '#FFDD2D',
                color: '#000',
                '&:hover': {
                  bgcolor: '#E6C429',
                },
              }}
            >
              Сохранить настройки
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};