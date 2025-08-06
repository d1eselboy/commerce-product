import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  FormControl,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Button,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  CloudUpload,
  People,
  Group,
  Assignment,
  CheckCircle,
  Info,
  Delete,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';

interface AudienceStepProps {
  data: any;
  onChange: (updates: any) => void;
  errors: Record<string, string>;
}

// Available audience roles
const audienceRoles = [
  { id: 'all_users', name: 'all_users', estimatedReach: 2500000 },
  { id: 'new_users', name: 'new_users', estimatedReach: 150000 },
  { id: 'active_users', name: 'active_users', estimatedReach: 850000 },
  { id: 'premium_users', name: 'premium_users', estimatedReach: 120000 },
  { id: 'business_users', name: 'business_users', estimatedReach: 75000 },
  { id: 'students', name: 'students', estimatedReach: 200000 },
  { id: 'drivers', name: 'drivers', estimatedReach: 450000 },
  { id: 'passengers', name: 'passengers', estimatedReach: 1200000 },
];

export const AudienceStep: React.FC<AudienceStepProps> = ({ data, onChange, errors }) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [fileProcessing, setFileProcessing] = useState(false);

  const targetingType = data.audienceTargeting?.type || 'role';
  const selectedRole = data.audienceTargeting?.role || '';
  const audienceFile = data.audienceTargeting?.file;
  const estimatedIds = data.audienceTargeting?.estimatedIds || 0;

  const handleTargetingTypeChange = (_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    const newTargeting = {
      type: value,
      role: value === 'role' ? 'all_users' : undefined,
      file: value === 'file' ? audienceFile : undefined,
      estimatedIds: value === 'role' ? getEstimatedReach('all_users') : estimatedIds,
    };
    
    onChange({
      audienceTargeting: newTargeting
    });
  };

  const handleRoleChange = (event: any) => {
    const role = event.target.value;
    onChange({
      audienceTargeting: {
        ...data.audienceTargeting,
        role: role,
        estimatedIds: getEstimatedReach(role),
      }
    });
  };

  const getEstimatedReach = (roleId: string) => {
    const role = audienceRoles.find(r => r.id === roleId);
    return role ? role.estimatedReach : 0;
  };

  const getRoleName = (roleId: string) => {
    return t(`campaignEditor.audience.roles.${roleId}`, roleId);
  };

  // File upload for audience IDs
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setFileProcessing(true);

    // Simulate file processing
    setTimeout(() => {
      // Mock processing - count lines in file as estimated IDs
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter(line => line.trim().length > 0);
        const estimatedIds = lines.length;

        onChange({
          audienceTargeting: {
            ...data.audienceTargeting,
            type: 'file',
            file: file,
            fileName: file.name,
            fileSize: file.size,
            estimatedIds: estimatedIds,
          }
        });

        setUploading(false);
        setFileProcessing(false);
      };
      reader.readAsText(file);
    }, 2000);
  }, [data.audienceTargeting, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
    },
    maxSize: 1 * 1024 * 1024, // 1MB
    multiple: false,
  });

  const handleRemoveFile = () => {
    onChange({
      audienceTargeting: {
        ...data.audienceTargeting,
        file: undefined,
        fileName: undefined,
        fileSize: undefined,
        estimatedIds: 0,
      }
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 байт';
    const k = 1024;
    const sizes = ['байт', 'КБ', 'МБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const currentEstimatedReach = targetingType === 'role' 
    ? getEstimatedReach(selectedRole)
    : estimatedIds;

  return (
    <Box>
      <Typography variant="h2" sx={{ mb: 1 }}>
        {t('campaignEditor.audience.title')}
      </Typography>
      <Typography variant="body1" sx={{ color: '#8E8E93', mb: 4 }}>
        {t('campaignEditor.audience.description')}
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Targeting Type Selection */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              {t('campaignEditor.audience.targetingType')}
            </Typography>
            
            <FormControl component="fieldset">
              <RadioGroup
                value={targetingType}
                onChange={handleTargetingTypeChange}
                sx={{ gap: 2 }}
              >
                <Paper sx={{ p: 3, border: targetingType === 'role' ? '2px solid #007AFF' : '1px solid #E5E5EA', borderRadius: '16px' }}>
                  <FormControlLabel
                    value="role"
                    control={<Radio sx={{ color: '#007AFF' }} />}
                    label={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Group sx={{ color: '#007AFF', fontSize: 20 }} />
                          <Typography variant="subtitle1">
                            {t('campaignEditor.audience.roleBasedTargeting')}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                          Выберите готовую роль пользователей из предустановленных категорий
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start', m: 0 }}
                  />
                </Paper>

                <Paper sx={{ p: 3, border: targetingType === 'file' ? '2px solid #007AFF' : '1px solid #E5E5EA', borderRadius: '16px' }}>
                  <FormControlLabel
                    value="file"
                    control={<Radio sx={{ color: '#007AFF' }} />}
                    label={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Assignment sx={{ color: '#007AFF', fontSize: 20 }} />
                          <Typography variant="subtitle1">
                            {t('campaignEditor.audience.fileBasedTargeting')}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                          Загрузите файл с конкретными ID пользователей для точного таргетинга
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start', m: 0 }}
                  />
                </Paper>
              </RadioGroup>
            </FormControl>
          </Box>

          {/* Role Selection */}
          {targetingType === 'role' && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {t('campaignEditor.audience.selectRole')}
              </Typography>
              
              <FormControl fullWidth sx={{ maxWidth: 400 }}>
                <Select
                  value={selectedRole}
                  onChange={handleRoleChange}
                  displayEmpty
                  sx={{
                    borderRadius: '12px',
                    bgcolor: '#FAFAFA',
                    '&:hover': {
                      bgcolor: '#F5F5F5',
                    },
                    '&.Mui-focused': {
                      bgcolor: '#FFFFFF',
                    },
                  }}
                >
                  {audienceRoles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Typography variant="body1">
                          {getRoleName(role.id)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#8E8E93', ml: 2 }}>
                          ~{role.estimatedReach.toLocaleString()} польз.
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {/* File Upload */}
          {targetingType === 'file' && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {t('campaignEditor.audience.uploadFile')}
              </Typography>
              
              {!audienceFile ? (
                <Paper
                  {...getRootProps()}
                  sx={{
                    p: 4,
                    border: '2px dashed #C7C7CC',
                    borderRadius: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: isDragActive ? '#F2F2F7' : '#FAFAFA',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: '#007AFF',
                      bgcolor: '#F0F8FF',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 122, 255, 0.15)',
                    },
                  }}
                >
                  <input {...getInputProps()} />
                  <CloudUpload sx={{ fontSize: 48, color: '#8E8E93', mb: 2 }} />
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    {isDragActive ? 'Отпустите файл здесь' : 'Перетащите файл сюда или нажмите для выбора'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#8E8E93', mb: 2 }}>
                    {t('campaignEditor.audience.fileFormat')}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                    {t('campaignEditor.audience.maxFileSize')}
                  </Typography>
                </Paper>
              ) : (
                <Paper sx={{ p: 3, border: '1px solid #E5E5EA', borderRadius: '12px', bgcolor: '#F9F9F9' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Assignment sx={{ color: '#007AFF', fontSize: 24 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {data.audienceTargeting.fileName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                          {formatFileSize(data.audienceTargeting.fileSize)} • {estimatedIds.toLocaleString()} ID
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      onClick={handleRemoveFile}
                      startIcon={<Delete />}
                      sx={{ color: '#FF3B30' }}
                    >
                      {t('campaignEditor.buttons.removeFile')}
                    </Button>
                  </Box>
                </Paper>
              )}

              {uploading && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {fileProcessing ? 'Обработка файла...' : 'Загрузка...'}
                  </Typography>
                  <LinearProgress />
                </Box>
              )}
            </Box>
          )}

          {/* Validation Errors */}
          {errors.audience && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.audience}
            </Alert>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Current Audience Summary */}
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
              <People sx={{ fontSize: 20, color: '#8E8E93' }} />
              {t('campaignEditor.audience.currentAudience')}
            </Typography>

            {targetingType === 'role' && selectedRole && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Выбранная роль:
                </Typography>
                <Chip 
                  label={getRoleName(selectedRole)}
                  sx={{ 
                    bgcolor: '#007AFF', 
                    color: '#FFFFFF',
                    fontWeight: 500 
                  }}
                />
              </Box>
            )}

            {targetingType === 'file' && audienceFile && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Загруженный файл:
                </Typography>
                <Typography variant="body2" sx={{ color: '#1C1C1E' }}>
                  {data.audienceTargeting.fileName}
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {t('campaignEditor.audience.estimatedReach')}:
              </Typography>
              <Typography variant="h4" sx={{ color: '#1C1C1E' }}>
                {currentEstimatedReach.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                пользователей
              </Typography>
            </Box>

            {currentEstimatedReach > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, bgcolor: '#E8F5E8', borderRadius: '8px' }}>
                <CheckCircle sx={{ color: '#34C759', fontSize: 16 }} />
                <Typography variant="caption" sx={{ color: '#34C759', fontWeight: 500 }}>
                  Аудитория настроена
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Targeting Tips */}
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
              Рекомендации по таргетингу
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>
                Роли аудитории:
              </Typography>
              <Typography variant="caption" sx={{ color: '#1976D2', display: 'block', lineHeight: 1.4 }}>
                • Быстрая настройка для стандартных сегментов
                <br />
                • Автоматическое обновление списка пользователей
                <br />
                • Рекомендуется для широких кампаний
              </Typography>
            </Box>

            <Divider sx={{ my: 2, borderColor: '#BBDEFB' }} />

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>
                Файл с ID:
              </Typography>
              <Typography variant="caption" sx={{ color: '#1976D2', display: 'block', lineHeight: 1.4 }}>
                • Точное управление аудиторией
                <br />
                • Один ID пользователя на строку
                <br />
                • Максимальная гибкость таргетинга
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};