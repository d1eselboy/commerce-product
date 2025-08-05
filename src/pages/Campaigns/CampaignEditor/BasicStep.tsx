import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormHelperText,
  Chip,
  Grid,
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
    'Black Friday 2024',
    'New Year Sale',
    'Spring Collection',
    'Mobile App Launch',
    'Premium Service Promo',
    'Student Discount',
  ];

  const handleSuggestionClick = (suggestion: string) => {
    onChange({ name: suggestion });
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
        {t('campaignEditor.basic.title', 'Campaign Details')}
      </Typography>
      <Typography variant="body2" sx={{ color: '#8E8E93', mb: 4 }}>
        Start with basic information about your advertising campaign
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
                  '& input': {
                    py: 1.5,
                  },
                  '&.Mui-error': {
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
                <Typography variant="caption" sx={{ color: '#8E8E93', mb: 1, display: 'block' }}>
                  Popular campaign names:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {campaignSuggestions.map((suggestion) => (
                    <Chip
                      key={suggestion}
                      label={suggestion}
                      size="small"
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{
                        bgcolor: '#F5F5F7',
                        color: '#1C1C1E',
                        '&:hover': {
                          bgcolor: '#FFDD2D',
                          color: '#000',
                        },
                        cursor: 'pointer',
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
                  '& textarea': {
                    py: 1.5,
                  },
                },
              }}
            />
            <FormHelperText sx={{ mt: 1, color: '#8E8E93' }}>
              Optional: Describe your campaign goals and target audience
            </FormHelperText>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box 
            sx={{ 
              p: 3, 
              bgcolor: '#F5F5F7', 
              borderRadius: 2,
              border: '1px solid #E5E5EA',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              Campaign Tips
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                📝 Naming Best Practices
              </Typography>
              <Typography variant="caption" sx={{ color: '#8E8E93', lineHeight: 1.4 }}>
                Use clear, descriptive names that include the brand, product, and time period
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                🎯 Target Audience
              </Typography>
              <Typography variant="caption" sx={{ color: '#8E8E93', lineHeight: 1.4 }}>
                Consider your audience when crafting the campaign description
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                📊 Performance Tracking
              </Typography>
              <Typography variant="caption" sx={{ color: '#8E8E93', lineHeight: 1.4 }}>
                Clear names help with performance analysis and reporting
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};