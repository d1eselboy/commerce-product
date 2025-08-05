import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormHelperText,
  Grid,
  FormControlLabel,
  Checkbox,
  Slider,
  Paper,
  Chip,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { AccessTime, CalendarToday, TrendingUp } from '@mui/icons-material';

interface SchedulingStepProps {
  data: any;
  onChange: (updates: any) => void;
  errors: Record<string, string>;
}


export const SchedulingStep: React.FC<SchedulingStepProps> = ({ data, onChange, errors }) => {
  const { t } = useTranslation();

  const handleStartDateChange = (date: Date | null) => {
    onChange({ startDate: date?.toISOString() });
  };

  const handleEndDateChange = (date: Date | null) => {
    onChange({ endDate: date?.toISOString() });
  };

  const handleImpressionLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 0;
    onChange({ limitImpressions: value });
  };


  const calculateDuration = () => {
    if (!data.startDate || !data.endDate) return null;
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const estimateReach = () => {
    const duration = calculateDuration();
    const dailyImpressions = data.limitImpressions && duration ? Math.floor(data.limitImpressions / duration) : 0;
    return dailyImpressions;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
          {t('campaignEditor.scheduling.title', 'Campaign Schedule')}
        </Typography>
        <Typography variant="body2" sx={{ color: '#8E8E93', mb: 4 }}>
          Set up when your campaign will run and how many impressions to deliver
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Date Range */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
                Campaign Period
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label={t('campaignEditor.scheduling.startDate')}
                    value={data.startDate ? new Date(data.startDate) : null}
                    onChange={handleStartDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: Boolean(errors.dates),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label={t('campaignEditor.scheduling.endDate')}
                    value={data.endDate ? new Date(data.endDate) : null}
                    onChange={handleEndDateChange}
                    minDate={data.startDate ? new Date(data.startDate) : undefined}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: Boolean(errors.dates),
                      },
                    }}
                  />
                </Grid>
              </Grid>
              {errors.dates && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {errors.dates}
                </FormHelperText>
              )}
              {calculateDuration() && (
                <Alert severity="info" sx={{ mt: 2, bgcolor: '#E3F2FD', border: '1px solid #BBDEFB' }}>
                  Campaign duration: {calculateDuration()} days
                </Alert>
              )}
            </Box>

            {/* Impression Limit */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
                {t('campaignEditor.scheduling.limitImpressions')}
              </Typography>
              <TextField
                fullWidth
                type="number"
                placeholder="10000"
                value={data.limitImpressions || ''}
                onChange={handleImpressionLimitChange}
                error={Boolean(errors.limitImpressions)}
                InputProps={{
                  endAdornment: <Typography variant="body2" sx={{ color: '#8E8E93' }}>impressions</Typography>,
                }}
                sx={{
                  maxWidth: 300,
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      py: 1.5,
                    },
                  },
                }}
              />
              {errors.limitImpressions && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {errors.limitImpressions}
                </FormHelperText>
              )}
              {estimateReach() > 0 && (
                <FormHelperText sx={{ mt: 1, color: '#8E8E93' }}>
                  Estimated daily impressions: {estimateReach().toLocaleString()}
                </FormHelperText>
              )}
            </Box>

          </Grid>

          <Grid item xs={12} md={4}>
            {/* Campaign Preview */}
            <Paper 
              sx={{ 
                p: 3, 
                bgcolor: '#F5F5F7', 
                borderRadius: 2,
                border: '1px solid #E5E5EA',
                mb: 3,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday sx={{ fontSize: 18, color: '#8E8E93' }} />
                Schedule Preview
              </Typography>

              {data.startDate && data.endDate && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Duration
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                    {calculateDuration()} days
                  </Typography>
                </Box>
              )}

              {data.limitImpressions && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Total Impressions
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                    {data.limitImpressions.toLocaleString()}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Campaign Type
                </Typography>
                <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                  Standard Display
                </Typography>
              </Box>
            </Paper>

            {/* Performance Tips */}
            <Paper 
              sx={{ 
                p: 3, 
                bgcolor: '#FFF3CD', 
                borderRadius: 2,
                border: '1px solid #FFE69C',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp sx={{ fontSize: 18, color: '#856404' }} />
                Optimization Tips
              </Typography>

              <Typography variant="body2" sx={{ color: '#856404', lineHeight: 1.5 }}>
                • Peak hours: 9-12 and 18-21 show highest engagement
                <br />
                • Weekdays typically perform better for B2B campaigns
                <br />
                • Consider timezone of your target audience
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};