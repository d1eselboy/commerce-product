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
  TextField,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import {
  CloudUpload,
  Group,
  Assignment,
  Delete,
  Link,
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
  const selectedRoles = data.audienceTargeting?.roles || [];
  const ytSegmentUrl = data.audienceTargeting?.ytSegmentUrl || '';
  const audienceFile = data.audienceTargeting?.file;
  const estimatedIds = data.audienceTargeting?.estimatedIds || 0;

  const handleTargetingTypeChange = (_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    const newTargeting = {
      type: value,
      roles: value === 'role' ? ['all_users'] : undefined,
      ytSegmentUrl: value === 'yt-segment' ? '' : undefined,
      file: value === 'file' ? audienceFile : undefined,
      estimatedIds: value === 'role' ? getEstimatedReach(['all_users']) : 0,
    };
    
    onChange({
      audienceTargeting: newTargeting
    });
  };

  const handleRolesChange = (event: any) => {
    const roles = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
    onChange({
      audienceTargeting: {
        ...data.audienceTargeting,
        roles: roles,
        estimatedIds: getEstimatedReach(roles),
      }
    });
  };


  const handleYtSegmentUrlChange = (event: any) => {
    const url = event.target.value;
    onChange({
      audienceTargeting: {
        ...data.audienceTargeting,
        ytSegmentUrl: url,
        estimatedIds: url ? 500000 : 0, // Mock estimated reach for YT segment
      }
    });
  };

  const getEstimatedReach = (roleIds: string[]) => {
    if (!roleIds || roleIds.length === 0) return 0;
    
    // Calculate overlap - simple approximation
    const totalReach = roleIds.reduce((sum, roleId) => {
      const role = audienceRoles.find(r => r.id === roleId);
      return sum + (role ? role.estimatedReach : 0);
    }, 0);
    
    // Apply overlap reduction based on number of selected roles
    const overlapFactor = roleIds.length > 1 ? 0.7 : 1; // 30% overlap reduction for multiple roles
    return Math.floor(totalReach * overlapFactor);
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
    ? getEstimatedReach(selectedRoles)
    : targetingType === 'yt-segment'
    ? (ytSegmentUrl ? 500000 : 0)
    : estimatedIds;

  return (
    <Box>
      <Typography variant="h2" sx={{ mb: 1 }}>
        {t('campaignEditor.audience.title')}
      </Typography>
      <Typography variant="body1" sx={{ color: '#8E8E93', mb: 4 }}>
        {t('campaignEditor.audience.description')}
      </Typography>

      <Box sx={{ maxWidth: 800 }}>
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
                            По ролям
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                          Multi-select roles with overlap calculation
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start', m: 0 }}
                  />
                </Paper>

                <Paper sx={{ p: 3, border: targetingType === 'yt-segment' ? '2px solid #007AFF' : '1px solid #E5E5EA', borderRadius: '16px' }}>
                  <FormControlLabel
                    value="yt-segment"
                    control={<Radio sx={{ color: '#007AFF' }} />}
                    label={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Link sx={{ color: '#007AFF', fontSize: 20 }} />
                          <Typography variant="subtitle1">
                            Сегмент Таргетинг по ID
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                          "YT" segment URL input – it will be a URL link to table
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
                Выберите роли (кампания покажется на каждой из ролей)
              </Typography>
              
              <FormControl fullWidth sx={{ maxWidth: 600 }}>
                <Select
                  multiple
                  value={selectedRoles}
                  onChange={handleRolesChange}
                  input={<OutlinedInput />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={getRoleName(value)} 
                          size="small"
                          sx={{ bgcolor: '#E3F2FD', color: '#1976D2' }}
                        />
                      ))}
                    </Box>
                  )}
                  sx={{
                    borderRadius: '12px',
                    bgcolor: '#FAFAFA',
                    minHeight: 56,
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
                      <Checkbox 
                        checked={selectedRoles.indexOf(role.id) > -1}
                        sx={{ color: '#007AFF' }}
                      />
                      <ListItemText 
                        primary={getRoleName(role.id)}
                        secondary={`~${role.estimatedReach.toLocaleString()} польз.`}
                      />
                    </MenuItem>
                  ))}
                </Select>
                
                {selectedRoles.length > 1 && (
                  <Typography variant="caption" sx={{ color: '#8E8E93', mt: 1 }}>
                    * Учитывается объединение аудиторий
                  </Typography>
                )}
              </FormControl>
            </Box>
          )}

          {/* YT Segment URL Input */}
          {targetingType === 'yt-segment' && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                URL ссылка на YT сегмент
              </Typography>
              
              <TextField
                fullWidth
                value={ytSegmentUrl}
                onChange={handleYtSegmentUrlChange}
                placeholder="https://example.com/yt-segment-table"
                sx={{
                  maxWidth: 600,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: '#FAFAFA',
                    '&:hover': {
                      bgcolor: '#F5F5F5',
                    },
                    '&.Mui-focused': {
                      bgcolor: '#FFFFFF',
                    },
                  }
                }}
                InputProps={{
                  startAdornment: <Link sx={{ color: '#8E8E93', mr: 1 }} />
                }}
              />
              
              <Typography variant="caption" sx={{ color: '#8E8E93', display: 'block', mt: 1 }}>
                Введите URL ссылку на таблицу с YT сегментом для точного таргетинга
              </Typography>
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
      </Box>
    </Box>
  );
};