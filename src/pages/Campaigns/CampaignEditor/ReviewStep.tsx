import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingUp,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface ReviewStepProps {
  data: any;
  onChange: (updates: any) => void;
  errors: Record<string, string>;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ data }) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateDuration = () => {
    if (!data.startDate || !data.endDate) return 0;
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getReadinessStatus = () => {
    const issues = [];
    const warnings = [];

    // Check required fields
    if (!data.name?.trim()) issues.push('Campaign name is required');
    if (!data.startDate || !data.endDate) issues.push('Campaign dates are required');
    if (!data.limitImpressions || data.limitImpressions <= 0) issues.push('Impression limit is required');
    if (data.weight === 0) issues.push('Campaign weight cannot be zero');
    if (!data.creativeFiles?.length) issues.push('At least one creative is required');

    // Check for warnings
    if (data.weight > 50) warnings.push('High weight (>50%) may dominate other campaigns');
    if (data.weight < 5) warnings.push('Low weight (<5%) may result in minimal impressions');
    if (data.consecutiveCap > 5) warnings.push('High consecutive cap may reduce user experience');

    // Check creative formats
    const creatives = data.creativeFiles || [];
    creatives.forEach((creative: any) => {
      if (creative.surface === 'promo_block') {
        const ratio = creative.dimensions.width / creative.dimensions.height;
        if (Math.abs(ratio - 1.91) > 0.1) {
          warnings.push(`${creative.name}: Promo block ratio should be 1.91:1`);
        }
      }
      if (creative.surface === 'map_object') {
        const ratio = creative.dimensions.width / creative.dimensions.height;
        if (Math.abs(ratio - 1) > 0.1) {
          warnings.push(`${creative.name}: Map object should be square`);
        }
      }
      if (creative.size > 500 * 1024) {
        warnings.push(`${creative.name}: File size exceeds 500KB`);
      }
    });

    const totalWeight = creatives.reduce((sum: number, c: any) => sum + c.weight, 0);
    if (Math.abs(totalWeight - 100) > 5) {
      warnings.push(`Creative weights total ${totalWeight}% (should be ~100%)`);
    }

    return { issues, warnings, isReady: issues.length === 0 };
  };

  const readiness = getReadinessStatus();
  const duration = calculateDuration();
  const dailyImpressions = duration > 0 ? Math.floor(data.limitImpressions / duration) : 0;

  // Performance prediction data
  const performanceData = [
    { name: 'Week 1', impressions: dailyImpressions * 7, clicks: Math.floor(dailyImpressions * 7 * 0.007) },
    { name: 'Week 2', impressions: dailyImpressions * 7, clicks: Math.floor(dailyImpressions * 7 * 0.008) },
    { name: 'Week 3', impressions: dailyImpressions * 7, clicks: Math.floor(dailyImpressions * 7 * 0.006) },
    { name: 'Week 4', impressions: dailyImpressions * 7, clicks: Math.floor(dailyImpressions * 7 * 0.009) },
  ];

  // Creative weight distribution for pie chart
  const creativeDistribution = (data.creativeFiles || []).map((creative: any, index: number) => ({
    name: creative.name,
    value: creative.weight,
    color: ['#FFDD2D', '#34C759', '#FF9500', '#007AFF', '#FF3B30'][index % 5],
  }));

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
        {t('campaignEditor.review.title', 'Review & Publish')}
      </Typography>
      <Typography variant="body2" sx={{ color: '#8E8E93', mb: 4 }}>
        Review all campaign details before publishing to ensure everything is configured correctly
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Readiness Status */}
          <Paper sx={{ p: 3, mb: 3, border: '1px solid #E5E5EA', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {readiness.isReady ? (
                <CheckCircle sx={{ color: '#34C759', fontSize: 24 }} />
              ) : (
                <Warning sx={{ color: '#FF9500', fontSize: 24 }} />
              )}
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Campaign Readiness
              </Typography>
              <Chip
                label={readiness.isReady ? 'Ready to Publish' : 'Issues Found'}
                color={readiness.isReady ? 'success' : 'warning'}
                sx={{ ml: 'auto' }}
              />
            </Box>

            {readiness.issues.length > 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Issues that must be resolved:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {readiness.issues.map((issue, index) => (
                    <li key={index}>
                      <Typography variant="body2">{issue}</Typography>
                    </li>
                  ))}
                </ul>
              </Alert>
            )}

            {readiness.warnings.length > 0 && (
              <Alert severity="warning">
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Recommendations:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {readiness.warnings.map((warning, index) => (
                    <li key={index}>
                      <Typography variant="body2">{warning}</Typography>
                    </li>
                  ))}
                </ul>
              </Alert>
            )}
          </Paper>

          {/* Campaign Summary */}
          <Paper sx={{ p: 3, mb: 3, border: '1px solid #E5E5EA', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
              Campaign Summary
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: '#8E8E93' }}>
                    NAME
                  </Typography>
                  <Typography variant="body1">{data.name || 'Untitled Campaign'}</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: '#8E8E93' }}>
                    PERIOD
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(data.startDate)} - {formatDate(data.endDate)}
                  </Typography>
                  {duration > 0 && (
                    <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                      {duration} days total
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: '#8E8E93' }}>
                    TARGETING
                  </Typography>
                  <Typography variant="body1">
                    {data.timeTargeting?.days?.length || 5} days/week • {' '}
                    {(data.timeTargeting?.endHour || 21) - (data.timeTargeting?.startHour || 9)} hours/day
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: '#8E8E93' }}>
                    WEIGHT & CAP
                  </Typography>
                  <Typography variant="body1">
                    {data.weight || 10}% weight • Max {data.consecutiveCap || 3} consecutive
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: '#8E8E93' }}>
                    IMPRESSIONS
                  </Typography>
                  <Typography variant="body1">
                    {(data.limitImpressions || 0).toLocaleString()} total
                  </Typography>
                  {dailyImpressions > 0 && (
                    <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                      ~{dailyImpressions.toLocaleString()}/day
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: '#8E8E93' }}>
                    CREATIVES
                  </Typography>
                  <Typography variant="body1">
                    {(data.creativeFiles || []).length} creative{(data.creativeFiles || []).length !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Creative Details */}
          {data.creativeFiles?.length > 0 && (
            <Paper sx={{ p: 3, mb: 3, border: '1px solid #E5E5EA', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
                Creative Configuration
              </Typography>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 500 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>Surface</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>Dimensions</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>Weight</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>Size</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.creativeFiles.map((creative: any) => (
                      <TableRow key={creative.id}>
                        <TableCell>{creative.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={creative.surface === 'promo_block' ? 'Promo Block' : 'Map Object'}
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell>
                          {creative.dimensions.width}×{creative.dimensions.height}
                        </TableCell>
                        <TableCell>{creative.weight}%</TableCell>
                        <TableCell>{(creative.size / 1024).toFixed(1)}KB</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* Performance Prediction */}
          {readiness.isReady && (
            <Paper sx={{ p: 3, border: '1px solid #E5E5EA', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
                Performance Forecast
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 2 }}>
                    Weekly Impressions & Clicks
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={performanceData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="impressions" fill="#FFDD2D" name="Impressions" />
                      <Bar dataKey="clicks" fill="#34C759" name="Clicks" />
                    </BarChart>
                  </ResponsiveContainer>
                </Grid>

                {creativeDistribution.length > 1 && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 2 }}>
                      Creative Weight Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={creativeDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                          label={({ value }) => `${value}%`}
                        >
                          {creativeDistribution.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Weight']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Grid>
                )}
              </Grid>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Key Metrics */}
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
              Expected Performance
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Total Impressions
              </Typography>
              <Typography variant="h5" sx={{ color: '#1C1C1E' }}>
                {(data.limitImpressions || 0).toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Estimated CTR
              </Typography>
              <Typography variant="body1" sx={{ color: '#34C759' }}>
                0.65% - 0.85%
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Expected Clicks
              </Typography>
              <Typography variant="body1" sx={{ color: '#1C1C1E' }}>
                {Math.floor((data.limitImpressions || 0) * 0.0075).toLocaleString()}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Daily Budget Impact
              </Typography>
              <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                ~{Math.floor(dailyImpressions * 0.15)} ₽/day
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Campaign ROI Estimate
              </Typography>
              <Typography variant="body2" sx={{ color: '#34C759' }}>
                125% - 180%
              </Typography>
            </Box>
          </Paper>

          {/* Next Steps */}
          <Paper 
            sx={{ 
              p: 3, 
              bgcolor: '#E3F2FD', 
              borderRadius: 2,
              border: '1px solid #BBDEFB',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              After Publishing
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                📊 Monitor Performance
              </Typography>
              <Typography variant="caption" sx={{ color: '#8E8E93', lineHeight: 1.4 }}>
                Check dashboard for real-time metrics and optimization opportunities
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                ⚡ Optimize Weights
              </Typography>
              <Typography variant="caption" sx={{ color: '#8E8E93', lineHeight: 1.4 }}>
                Adjust creative weights based on performance data after 24-48 hours
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                🎯 A/B Test Results
              </Typography>
              <Typography variant="caption" sx={{ color: '#8E8E93', lineHeight: 1.4 }}>
                Compare creative performance to identify winning variants
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};