import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormHelperText,
  Chip,
  Grid,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface BasicStepProps {
  data: any;
  onChange: (updates: any) => void;
  errors: Record<string, string>;
}

export const BasicStep: React.FC<BasicStepProps> = ({ data, onChange, errors }) => {
  const { t } = useTranslation();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ name: event.target.value });
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ description: event.target.value });
  };

  // Generate campaign suggestions based on current trends
  const campaignSuggestions = [
    'Черная пятница 2024',
    'Новогодняя распродажа',
    'Весенняя коллекция',
    'Запуск мобильного приложения',
    'Промо премиум услуг',
    'Студенческая скидка',
  ];

  const handleSuggestionClick = (suggestion: string) => {
    onChange({ name: suggestion });
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
        {t('campaignEditor.basic.title', 'Детали кампании')}
      </Typography>
      <Typography variant="body2" sx={{ color: '#8E8E93', mb: 4 }}>
        Начните с базовой информации о вашей рекламной кампании
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              {t('campaignEditor.basic.name')}
            </Typography>
            <TextField
              fullWidth
              placeholder={t('campaignEditor.basic.namePlaceholder')}
              value={data.name || ''}
              onChange={handleNameChange}
              error={Boolean(errors.name)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '1rem',
                  borderRadius: '12px',
                  backgroundColor: '#FAFAFA',
                  border: '1px solid #E5E5EA',
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: '#007AFF',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#007AFF',
                    borderWidth: '2px',
                  },
                  '& input': {
                    py: '14px',
                    px: '16px',
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#1C1C1E',
                    '&::placeholder': {
                      color: '#8E8E93',
                      opacity: 1,
                    },
                  },
                  '&.Mui-error': {
                    backgroundColor: '#FFF5F5',
                    '& fieldset': {
                      borderColor: '#FF3B30',
                    },
                  },
                },
              }}
            />
            {errors.name && (
              <FormHelperText error sx={{ mt: 1, fontSize: '0.875rem' }}>
                {errors.name}
              </FormHelperText>
            )}
            
            {/* Campaign name suggestions */}
            {!data.name && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ color: '#8E8E93', mb: 1, display: 'block' }}>
                  Популярные названия кампаний:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {campaignSuggestions.map((suggestion) => (
                    <Chip
                      key={suggestion}
                      label={suggestion}
                      size="small"
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{
                        bgcolor: '#F2F2F7',
                        color: '#1C1C1E',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 500,
                        height: '32px',
                        '&:hover': {
                          bgcolor: '#007AFF',
                          color: '#FFFFFF',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 2px 8px rgba(0, 122, 255, 0.3)',
                        },
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              {t('campaignEditor.basic.description')}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder={t('campaignEditor.basic.descriptionPlaceholder')}
              value={data.description || ''}
              onChange={handleDescriptionChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                  borderRadius: '12px',
                  backgroundColor: '#FAFAFA',
                  border: '1px solid #E5E5EA',
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: '#007AFF',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#007AFF',
                    borderWidth: '2px',
                  },
                  '& textarea': {
                    py: '14px',
                    px: '16px',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#1C1C1E',
                    '&::placeholder': {
                      color: '#8E8E93',
                      opacity: 1,
                    },
                  },
                },
              }}
            />
            <FormHelperText sx={{ mt: 1, color: '#8E8E93' }}>
              Необязательно: Опишите цели кампании и целевую аудиторию
            </FormHelperText>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={1} 
            sx={{ 
              p: 3, 
              bgcolor: '#F5F5F7', 
              borderRadius: '16px',
              border: '1px solid #E5E5EA',
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              Советы по кампаниям
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                Лучшие практики именования
              </Typography>
              <Typography variant="body2" sx={{ color: '#8E8E93', lineHeight: 1.4 }}>
                Используйте четкие, описательные названия, включающие бренд, продукт и временной период
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                Целевая аудитория
              </Typography>
              <Typography variant="body2" sx={{ color: '#8E8E93', lineHeight: 1.4 }}>
                Учитывайте вашу аудиторию при создании описания кампании
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                Отслеживание эффективности
              </Typography>
              <Typography variant="body2" sx={{ color: '#8E8E93', lineHeight: 1.4 }}>
                Четкие названия помогают с анализом производительности и отчетностью
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};