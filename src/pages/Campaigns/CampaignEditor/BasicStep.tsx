import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormHelperText,
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


  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
        {t('campaignEditor.basic.title', 'Детали кампании')}
      </Typography>
      <Typography variant="body2" sx={{ color: '#8E8E93', mb: 4 }}>
        Начните с базовой информации о вашей рекламной кампании
      </Typography>

      <Box sx={{ maxWidth: 600 }}>
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
      </Box>
    </Box>
  );
};