import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Tab,
  Tabs,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Alert,
  LinearProgress,
  Menu,
  MenuItem,
  TextField,
  Slider,
} from '@mui/material';
import {
  CloudUpload,
  Add,
  Delete,
  Edit,
  MoreVert,
  Image as ImageIcon,
  AspectRatio,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

interface CreativesStepProps {
  data: any;
  onChange: (updates: any) => void;
  errors: Record<string, string>;
}

interface Creative {
  id: string;
  name: string;
  file?: File;
  url?: string;
  surface: 'promo_block' | 'map_object';
  dimensions: { width: number; height: number };
  size: number;
  weight: number;
  format: string;
}

// Mock creative library data
const mockCreativeLibrary: Creative[] = [
  {
    id: '1',
    name: 'VTB Premium Banner',
    url: '/images/vtb-banner.jpg',
    surface: 'promo_block',
    dimensions: { width: 320, height: 168 },
    size: 45600,
    weight: 100,
    format: 'JPEG',
  },
  {
    id: '2',
    name: 'Sberbank Auto Promo',
    url: '/images/sber-auto.jpg',
    surface: 'promo_block',
    dimensions: { width: 320, height: 168 },
    size: 52300,
    weight: 100,
    format: 'JPEG',
  },
  {
    id: '3',
    name: 'Tinkoff Map Sticker',
    url: '/images/tinkoff-sticker.svg',
    surface: 'map_object',
    dimensions: { width: 64, height: 64 },
    size: 8900,
    weight: 100,
    format: 'SVG',
  },
];

export const CreativesStep: React.FC<CreativesStepProps> = ({ data, onChange, errors }) => {
  const { t } = useTranslation();
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCreatives, setSelectedCreatives] = useState<Creative[]>([]);
  const [uploading, setUploading] = useState(false);
  const [editingWeights, setEditingWeights] = useState(false);

  // Dropzone for file uploads
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newCreatives = acceptedFiles.map((file, index) => ({
        id: `upload-${Date.now()}-${index}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        file,
        surface: (file.name.includes('map') || file.name.includes('sticker')) ? 'map_object' : 'promo_block' as const,
        dimensions: { width: 320, height: 168 }, // Will be detected from actual file
        size: file.size,
        weight: 100,
        format: file.type.split('/')[1].toUpperCase(),
      }));
      
      const currentCreatives = data.creativeFiles || [];
      onChange({ 
        creativeFiles: [...currentCreatives, ...newCreatives]
      });
      setUploading(false);
    }, 1500);
  }, [data.creativeFiles, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/svg+xml': ['.svg'],
    },
    maxSize: 500 * 1024, // 500KB
  });

  const handleAddFromLibrary = () => {
    setLibraryOpen(true);
  };

  const handleSelectFromLibrary = (creative: Creative) => {
    setSelectedCreatives(prev => {
      const exists = prev.find(c => c.id === creative.id);
      if (exists) {
        return prev.filter(c => c.id !== creative.id);
      }
      return [...prev, creative];
    });
  };

  const handleAddSelectedCreatives = () => {
    const currentCreatives = data.creativeFiles || [];
    const newCreatives = selectedCreatives.map(c => ({
      ...c,
      weight: Math.floor(100 / (currentCreatives.length + selectedCreatives.length)),
    }));
    
    onChange({ 
      creativeFiles: [...currentCreatives, ...newCreatives]
    });
    setSelectedCreatives([]);
    setLibraryOpen(false);
  };

  const handleRemoveCreative = (id: string) => {
    const currentCreatives = data.creativeFiles || [];
    const updatedCreatives = currentCreatives.filter((c: Creative) => c.id !== id);
    
    // Redistribute weights evenly
    const redistributedCreatives = updatedCreatives.map((c: Creative) => ({
      ...c,
      weight: updatedCreatives.length > 0 ? Math.floor(100 / updatedCreatives.length) : 100,
    }));
    
    onChange({ creativeFiles: redistributedCreatives });
  };

  const handleWeightChange = (id: string, newWeight: number) => {
    const currentCreatives = data.creativeFiles || [];
    const updatedCreatives = currentCreatives.map((c: Creative) => 
      c.id === id ? { ...c, weight: newWeight } : c
    );
    onChange({ creativeFiles: updatedCreatives });
  };

  const validateCreatives = () => {
    const creatives = data.creativeFiles || [];
    const issues = [];

    if (creatives.length === 0) {
      issues.push({ type: 'error', message: 'At least one creative is required' });
    }

    // Check format requirements
    const promoBlocks = creatives.filter((c: Creative) => c.surface === 'promo_block');
    const mapObjects = creatives.filter((c: Creative) => c.surface === 'map_object');

    promoBlocks.forEach((c: Creative) => {
      const ratio = c.dimensions.width / c.dimensions.height;
      if (Math.abs(ratio - 1.91) > 0.1) {
        issues.push({ 
          type: 'warning', 
          message: `${c.name}: Promo block should have 1.91:1 ratio (recommended: 320x168px)` 
        });
      }
    });

    mapObjects.forEach((c: Creative) => {
      const ratio = c.dimensions.width / c.dimensions.height;
      if (Math.abs(ratio - 1) > 0.1) {
        issues.push({ 
          type: 'warning', 
          message: `${c.name}: Map object should be square (1:1 ratio)` 
        });
      }
    });

    // Check file sizes
    creatives.forEach((c: Creative) => {
      if (c.size > 500 * 1024) {
        issues.push({ 
          type: 'warning', 
          message: `${c.name}: File size exceeds 500KB recommendation` 
        });
      }
    });

    // Check weight distribution
    const totalWeight = creatives.reduce((sum: number, c: Creative) => sum + c.weight, 0);
    if (Math.abs(totalWeight - 100) > 5) {
      issues.push({ 
        type: 'warning', 
        message: `Total weight is ${totalWeight}% (should be close to 100%)` 
      });
    }

    return issues;
  };

  const validationIssues = validateCreatives();
  const creatives = data.creativeFiles || [];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
        {t('campaignEditor.creatives.title', 'Campaign Creatives')}
      </Typography>
      <Typography variant="body2" sx={{ color: '#8E8E93', mb: 4 }}>
        Upload new creatives or select from your library. Set weights for A/B testing.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Upload Area */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              Upload New Creatives
            </Typography>
            
            <Paper
              {...getRootProps()}
              sx={{
                p: 4,
                border: '2px dashed #E5E5EA',
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isDragActive ? '#F5F5F7' : 'transparent',
                '&:hover': {
                  borderColor: '#FFDD2D',
                  bgcolor: '#FFFBF0',
                },
              }}
            >
              <input {...getInputProps()} />
              <CloudUpload sx={{ fontSize: 48, color: '#8E8E93', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                {isDragActive ? 'Drop files here' : 'Drag files here or click to select'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#8E8E93', mb: 2 }}>
                {t('campaignEditor.creatives.supportedFormats')}: JPEG, WebP, SVG
              </Typography>
              <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                {t('campaignEditor.creatives.maxFileSize')}: 500 KB • 
                {t('campaignEditor.creatives.promoBlockRatio')}: 1.91:1 • 
                {t('campaignEditor.creatives.mapObjectRatio')}: 1:1
              </Typography>
            </Paper>

            {uploading && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>Uploading...</Typography>
                <LinearProgress />
              </Box>
            )}
          </Box>

          {/* Library Button */}
          <Box sx={{ mb: 4 }}>
            <Button
              onClick={handleAddFromLibrary}
              startIcon={<Add />}
              sx={{
                bgcolor: '#F5F5F7',
                color: '#1C1C1E',
                border: '1px solid #E5E5EA',
                '&:hover': {
                  bgcolor: '#E5E5EA',
                },
              }}
            >
              {t('campaignEditor.creatives.selectFromLibrary')}
            </Button>
          </Box>

          {/* Selected Creatives */}
          {creatives.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Campaign Creatives ({creatives.length})
                </Typography>
                <Button
                  size="small"
                  onClick={() => setEditingWeights(!editingWeights)}
                  sx={{ color: '#8E8E93' }}
                >
                  {editingWeights ? 'Done' : 'Edit Weights'}
                </Button>
              </Box>

              <Grid container spacing={2}>
                {creatives.map((creative: Creative) => (
                  <Grid item xs={12} sm={6} md={4} key={creative.id}>
                    <Card sx={{ position: 'relative', border: '1px solid #E5E5EA' }}>
                      <CardMedia
                        sx={{
                          height: 120,
                          bgcolor: '#F5F5F7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {creative.url ? (
                          <img 
                            src={creative.url} 
                            alt={creative.name}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <ImageIcon sx={{ fontSize: 48, color: '#8E8E93' }} />
                        )}
                      </CardMedia>
                      
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                          {creative.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Chip
                            label={creative.surface === 'promo_block' ? 'Promo' : 'Map'}
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                          <Chip
                            label={creative.format}
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </Box>
                        
                        <Typography variant="caption" sx={{ color: '#8E8E93', display: 'block', mb: 1 }}>
                          {creative.dimensions.width}×{creative.dimensions.height} • {(creative.size / 1024).toFixed(1)}KB
                        </Typography>

                        {editingWeights && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                              Weight: {creative.weight}%
                            </Typography>
                            <Slider
                              value={creative.weight}
                              onChange={(_, value) => handleWeightChange(creative.id, value as number)}
                              min={0}
                              max={100}
                              size="small"
                              sx={{
                                color: '#FFDD2D',
                                '& .MuiSlider-thumb': {
                                  bgcolor: '#FFDD2D',
                                },
                              }}
                            />
                          </Box>
                        )}
                      </CardContent>

                      <IconButton
                        onClick={() => handleRemoveCreative(creative.id)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          '&:hover': {
                            bgcolor: '#FF3B30',
                            color: 'white',
                          },
                        }}
                        size="small"
                      >
                        <Delete sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Validation Issues */}
          {validationIssues.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
                Validation Results
              </Typography>
              {validationIssues.map((issue, index) => (
                <Alert 
                  key={index}
                  severity={issue.type as any}
                  icon={issue.type === 'error' ? <Warning /> : <CheckCircle />}
                  sx={{ mb: 1 }}
                >
                  {issue.message}
                </Alert>
              ))}
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Creative Requirements */}
          <Paper 
            sx={{ 
              p: 3, 
              bgcolor: '#F5F5F7', 
              borderRadius: 2,
              border: '1px solid #E5E5EA',
              mb: 3,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              Format Requirements
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AspectRatio sx={{ fontSize: 16 }} />
                Promo Block
              </Typography>
              <Typography variant="caption" sx={{ color: '#8E8E93', lineHeight: 1.4 }}>
                • Ratio: 1.91:1 (recommended: 320×168px)
                <br />
                • Formats: JPEG, WebP, SVG
                <br />
                • Max size: 500KB
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AspectRatio sx={{ fontSize: 16 }} />
                Map Object
              </Typography>
              <Typography variant="caption" sx={{ color: '#8E8E93', lineHeight: 1.4 }}>
                • Ratio: 1:1 (recommended: 64×64px)
                <br />
                • Formats: SVG preferred, PNG, WebP
                <br />
                • Max size: 500KB
              </Typography>
            </Box>
          </Paper>

          {/* Weight Distribution */}
          {creatives.length > 1 && (
            <Paper 
              sx={{ 
                p: 3, 
                bgcolor: '#E3F2FD', 
                borderRadius: 2,
                border: '1px solid #BBDEFB',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
                A/B Testing Weights
              </Typography>

              {creatives.map((creative: Creative) => (
                <Box key={creative.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {creative.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                      {creative.weight}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={creative.weight}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: '#E5E5EA',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#FFDD2D',
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>
              ))}

              <Typography variant="caption" sx={{ color: '#8E8E93', mt: 1, display: 'block' }}>
                Total: {creatives.reduce((sum: number, c: Creative) => sum + c.weight, 0)}%
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Creative Library Dialog */}
      <Dialog
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Creative Library</Typography>
            <Button
              onClick={handleAddSelectedCreatives}
              disabled={selectedCreatives.length === 0}
              sx={{
                bgcolor: '#FFDD2D',
                color: '#000',
                '&:hover': {
                  bgcolor: '#E6C429',
                },
              }}
            >
              Add Selected ({selectedCreatives.length})
            </Button>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Tabs value={selectedTab} onChange={(_, value) => setSelectedTab(value)} sx={{ mb: 3 }}>
            <Tab label="All Creatives" />
            <Tab label="Promo Blocks" />
            <Tab label="Map Objects" />
          </Tabs>

          <Grid container spacing={2}>
            {mockCreativeLibrary
              .filter(c => 
                selectedTab === 0 || 
                (selectedTab === 1 && c.surface === 'promo_block') ||
                (selectedTab === 2 && c.surface === 'map_object')
              )
              .map((creative) => (
                <Grid item xs={12} sm={6} md={4} key={creative.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedCreatives.find(c => c.id === creative.id) 
                        ? '2px solid #FFDD2D' 
                        : '1px solid #E5E5EA',
                      '&:hover': {
                        boxShadow: 2,
                      },
                    }}
                    onClick={() => handleSelectFromLibrary(creative)}
                  >
                    <CardMedia
                      sx={{
                        height: 100,
                        bgcolor: '#F5F5F7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 32, color: '#8E8E93' }} />
                    </CardMedia>
                    
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                        {creative.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip
                          label={creative.surface === 'promo_block' ? 'Promo' : 'Map'}
                          size="small"
                          sx={{ fontSize: '0.7rem' }}
                        />
                        <Chip
                          label={creative.format}
                          size="small"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Box>
                      
                      <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                        {creative.dimensions.width}×{creative.dimensions.height}
                      </Typography>
                    </CardContent>

                    {selectedCreatives.find(c => c.id === creative.id) && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: '#FFDD2D',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CheckCircle sx={{ fontSize: 16, color: '#000' }} />
                      </Box>
                    )}
                  </Card>
                </Grid>
              ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};