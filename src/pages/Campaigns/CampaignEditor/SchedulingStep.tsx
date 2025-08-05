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

const weekDays = [
  { value: 1, label: 'Пн' },
  { value: 2, label: 'Вт' },
  { value: 3, label: 'Ср' },
  { value: 4, label: 'Чт' },
  { value: 5, label: 'Пт' },
  { value: 6, label: 'Сб' },
  { value: 0, label: 'Вс' },
];

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

  const handleDayToggle = (day: number) => {
    const currentDays = data.timeTargeting?.days || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d: number) => d !== day)
      : [...currentDays, day].sort();
    
    onChange({
      timeTargeting: {
        ...data.timeTargeting,
        days: newDays,
      },
    });
  };

  const handleTimeRangeChange = (event: Event, newValue: number | number[]) => {
    const [startHour, endHour] = newValue as number[];
    onChange({
      timeTargeting: {
        ...data.timeTargeting,
        startHour,
        endHour,
      },
    });
  };

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
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

            {/* Time Targeting */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
                {t('campaignEditor.scheduling.timeTargeting')}
              </Typography>
              
              {/* Days of Week */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Days of Week
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {weekDays.map((day) => (
                    <Chip
                      key={day.value}
                      label={day.label}
                      onClick={() => handleDayToggle(day.value)}
                      sx={{
                        bgcolor: data.timeTargeting?.days?.includes(day.value) ? '#FFDD2D' : '#F5F5F7',
                        color: data.timeTargeting?.days?.includes(day.value) ? '#000' : '#8E8E93',
                        '&:hover': {
                          bgcolor: data.timeTargeting?.days?.includes(day.value) ? '#E6C429' : '#E5E5EA',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Time Range */}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 2 }}>
                  Time Range
                </Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={[data.timeTargeting?.startHour || 9, data.timeTargeting?.endHour || 21]}
                    onChange={handleTimeRangeChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={formatHour}
                    min={0}
                    max={23}
                    marks={[
                      { value: 0, label: '00:00' },
                      { value: 6, label: '06:00' },
                      { value: 12, label: '12:00' },
                      { value: 18, label: '18:00' },
                      { value: 23, label: '23:00' },
                    ]}
                    sx={{
                      color: '#FFDD2D',
                      '& .MuiSlider-thumb': {
                        bgcolor: '#FFDD2D',
                        '&:hover': {
                          boxShadow: '0 0 0 8px rgba(255, 221, 45, 0.16)',
                        },
                      },
                      '& .MuiSlider-track': {
                        bgcolor: '#FFDD2D',
                      },
                      '& .MuiSlider-rail': {
                        bgcolor: '#E5E5EA',
                      },
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#8E8E93', mt: 1, display: 'block' }}>
                  Active hours: {formatHour(data.timeTargeting?.startHour || 9)} - {formatHour(data.timeTargeting?.endHour || 21)}
                </Typography>
              </Box>
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

              {data.timeTargeting?.days?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Active Days
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                    {data.timeTargeting.days.length} days/week
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Daily Hours
                </Typography>
                <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                  {(data.timeTargeting?.endHour || 21) - (data.timeTargeting?.startHour || 9)} hours/day
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