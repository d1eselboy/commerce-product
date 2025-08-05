import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  Alert,
  Chip,
  LinearProgress,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Warning, CheckCircle } from '@mui/icons-material';
import { mockCampaigns } from '@/store/mockData';

interface WeightsStepProps {
  data: any;
  onChange: (updates: any) => void;
  errors: Record<string, string>;
}

export const WeightsStep: React.FC<WeightsStepProps> = ({ data, onChange, errors }) => {
  const { t } = useTranslation();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleWeightChange = (event: Event, newValue: number | number[]) => {
    onChange({ weight: newValue as number });
  };

  const handleConsecutiveCapChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 1;
    onChange({ consecutiveCap: value });
  };

  // Calculate distribution preview based on current weight and existing campaigns
  const getDistributionPreview = () => {
    const activeCampaigns = mockCampaigns
      .filter(c => c.status === 'active')
      .map(c => ({ name: c.name, weight: c.weight }));
    
    // Add current campaign
    const currentCampaign = {
      name: data.name || 'New Campaign',
      weight: data.weight || 10,
    };
    
    const allCampaigns = [...activeCampaigns, currentCampaign];
    const totalWeight = allCampaigns.reduce((sum, c) => sum + c.weight, 0);
    
    return allCampaigns.map(c => ({
      ...c,
      percentage: totalWeight > 0 ? Math.round((c.weight / totalWeight) * 100) : 0,
    }));
  };

  const distributionData = getDistributionPreview();
  const currentCampaignShare = distributionData.find(d => d.name === (data.name || 'New Campaign'))?.percentage || 0;

  // Colors for pie chart
  const colors = ['#FFDD2D', '#34C759', '#FF9500', '#007AFF', '#FF3B30', '#8E8E93', '#AF52DE'];

  // Conflict detection
  const getConflicts = () => {
    const conflicts = [];
    
    if (data.weight > 50) {
      conflicts.push({
        type: 'warning',
        message: 'High weight (>50%) may dominate other campaigns',
      });
    }
    
    if (data.weight < 5) {
      conflicts.push({
        type: 'warning',
        message: 'Low weight (<5%) may result in minimal impressions',
      });
    }

    if (data.consecutiveCap > 5) {
      conflicts.push({
        type: 'info',
        message: 'High consecutive cap may reduce user experience diversity',
      });
    }

    return conflicts;
  };

  const conflicts = getConflicts();

  // Performance prediction
  const getPredictedPerformance = () => {
    const dailyImpressions = data.limitImpressions && calculateDuration() 
      ? Math.floor(data.limitImpressions / calculateDuration()) 
      : 0;
    
    const expectedShare = currentCampaignShare / 100;
    const predictedDailyImpressions = Math.floor(dailyImpressions * expectedShare);
    
    return {
      dailyImpressions: predictedDailyImpressions,
      weeklyImpressions: predictedDailyImpressions * 7,
      estimatedCTR: 0.65, // Base CTR estimate
      estimatedClicks: Math.floor(predictedDailyImpressions * 0.0065),
    };
  };

  const calculateDuration = () => {
    if (!data.startDate || !data.endDate) return 1;
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const performance = getPredictedPerformance();

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
        {t('campaignEditor.weights.title', 'Campaign Weight & Distribution')}
      </Typography>
      <Typography variant="body2" sx={{ color: '#8E8E93', mb: 4 }}>
        Set the weight for auction-based rotation and configure consecutive caps
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Weight Slider */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              Campaign Weight
            </Typography>
            <Box sx={{ px: 3, mb: 2 }}>
              <Slider
                value={data.weight || 10}
                onChange={handleWeightChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                min={1}
                max={100}
                marks={[
                  { value: 1, label: '1%' },
                  { value: 25, label: '25%' },
                  { value: 50, label: '50%' },
                  { value: 75, label: '75%' },
                  { value: 100, label: '100%' },
                ]}
                sx={{
                  color: '#FFDD2D',
                  '& .MuiSlider-thumb': {
                    bgcolor: '#FFDD2D',
                    width: 20,
                    height: 20,
                    '&:hover': {
                      boxShadow: '0 0 0 8px rgba(255, 221, 45, 0.16)',
                    },
                  },
                  '& .MuiSlider-track': {
                    bgcolor: '#FFDD2D',
                    height: 6,
                  },
                  '& .MuiSlider-rail': {
                    bgcolor: '#E5E5EA',
                    height: 6,
                  },
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                Current weight: {data.weight || 10}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                Expected share: ~{currentCampaignShare}% of total impressions
              </Typography>
            </Box>
            {errors.weight && (
              <FormHelperText error sx={{ mt: 1 }}>
                {errors.weight}
              </FormHelperText>
            )}
          </Box>

          {/* Consecutive Cap */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              Consecutive Cap
            </Typography>
            <TextField
              type="number"
              placeholder="3"
              value={data.consecutiveCap || ''}
              onChange={handleConsecutiveCapChange}
              inputProps={{ min: 1, max: 10 }}
              sx={{ maxWidth: 200 }}
              helperText="Maximum consecutive shows for this campaign"
            />
          </Box>

          {/* Distribution Preview Chart */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              {t('campaignEditor.weights.previewDistribution')}
            </Typography>
            <Paper sx={{ p: 3, border: '1px solid #E5E5EA', borderRadius: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 2 }}>
                    Impression Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={distributionData.slice(0, 6)} // Show top 6 campaigns
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="percentage"
                        label={({ name, percentage }) => `${percentage}%`}
                      >
                        {distributionData.slice(0, 6).map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.name === (data.name || 'New Campaign') ? '#FFDD2D' : colors[index % colors.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                    </PieChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 2 }}>
                    Campaign List
                  </Typography>
                  <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {distributionData.map((campaign, index) => (
                      <Box 
                        key={campaign.name} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2, 
                          mb: 1,
                          p: 1,
                          borderRadius: 1,
                          bgcolor: campaign.name === (data.name || 'New Campaign') ? '#FFF9E6' : 'transparent',
                        }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: campaign.name === (data.name || 'New Campaign') ? '#FFDD2D' : colors[index % colors.length],
                          }}
                        />
                        <Typography variant="body2" sx={{ flex: 1, fontSize: '0.8rem' }}>
                          {campaign.name}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                          {campaign.percentage}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Conflicts & Warnings */}
          {conflicts.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
                Weight Analysis
              </Typography>
              {conflicts.map((conflict, index) => (
                <Alert 
                  key={index}
                  severity={conflict.type as any}
                  icon={conflict.type === 'warning' ? <Warning /> : <CheckCircle />}
                  sx={{ mb: 1 }}
                >
                  {conflict.message}
                </Alert>
              ))}
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Performance Prediction */}
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
              <TrendingUp sx={{ fontSize: 18, color: '#8E8E93' }} />
              Performance Prediction
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Expected Daily Impressions
              </Typography>
              <Typography variant="h6" sx={{ color: '#1C1C1E' }}>
                {performance.dailyImpressions.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Weekly Volume
              </Typography>
              <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                {performance.weeklyImpressions.toLocaleString()} impressions
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Estimated CTR
              </Typography>
              <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                {performance.estimatedCTR}%
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Expected Daily Clicks
              </Typography>
              <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                ~{performance.estimatedClicks} clicks
              </Typography>
            </Box>
          </Paper>

          {/* Weight Recommendations */}
          <Paper 
            sx={{ 
              p: 3, 
              bgcolor: '#E3F2FD', 
              borderRadius: 2,
              border: '1px solid #BBDEFB',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              Weight Recommendations
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Chip 
                label="Low Impact: 1-15%" 
                size="small" 
                sx={{ 
                  bgcolor: '#E5E5EA', 
                  color: '#8E8E93',
                  mr: 1,
                  mb: 1,
                }} 
              />
              <Typography variant="caption" sx={{ color: '#8E8E93', display: 'block' }}>
                For testing new creatives
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Chip 
                label="Balanced: 15-40%" 
                size="small" 
                sx={{ 
                  bgcolor: '#FFDD2D', 
                  color: '#000',
                  mr: 1,
                  mb: 1,
                }} 
              />
              <Typography variant="caption" sx={{ color: '#8E8E93', display: 'block' }}>
                Recommended for most campaigns
              </Typography>
            </Box>

            <Box>
              <Chip 
                label="High Impact: 40%+" 
                size="small" 
                sx={{ 
                  bgcolor: '#FF9500', 
                  color: '#FFF',
                  mr: 1,
                  mb: 1,
                }} 
              />
              <Typography variant="caption" sx={{ color: '#8E8E93', display: 'block' }}>
                For priority campaigns only
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};