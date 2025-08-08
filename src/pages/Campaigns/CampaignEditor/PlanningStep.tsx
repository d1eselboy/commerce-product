import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormHelperText,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import {
  CalendarToday,
  TrendingUp,
} from '@mui/icons-material';

interface PlanningStepProps {
  data: any;
  onChange: (updates: any) => void;
  errors: Record<string, string>;
}

export const PlanningStep: React.FC<PlanningStepProps> = ({ data, onChange, errors }) => {
  const { t } = useTranslation();

  // Initialize default values if not set
  useEffect(() => {
    if (data.limitImpressions === undefined) {
      onChange({
        limitImpressions: data.limitImpressions || 100000,
      });
    }
  }, []);

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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
          Планирование кампании
        </Typography>
        <Typography variant="body2" sx={{ color: '#8E8E93', mb: 4 }}>
          Настройте расписание и лимит показов для вашей кампании
        </Typography>

        <Box sx={{ maxWidth: 800 }}>
            {/* Campaign Schedule */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday sx={{ fontSize: 20, color: '#007AFF' }} />
                Расписание кампании
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Дата начала"
                    value={data.startDate ? new Date(data.startDate) : null}
                    onChange={handleStartDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: Boolean(errors.dates),
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: '#F9F9F9',
                          },
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Дата окончания"
                    value={data.endDate ? new Date(data.endDate) : null}
                    onChange={handleEndDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: Boolean(errors.dates),
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: '#F9F9F9',
                          },
                        },
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
            </Box>

            {/* Impression Settings */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp sx={{ fontSize: 20, color: '#007AFF' }} />
                Настройки показов
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Общее количество показов"
                    type="number"
                    value={data.limitImpressions || ''}
                    onChange={handleImpressionLimitChange}
                    error={Boolean(errors.limitImpressions)}
                    helperText={errors.limitImpressions || 'Общий лимит показов для кампании'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: '#F9F9F9',
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};