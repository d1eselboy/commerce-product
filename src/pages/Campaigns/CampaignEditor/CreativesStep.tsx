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
  Slider,
} from '@mui/material';
import {
  CloudUpload,
  Add,
  Delete,
  Image as ImageIcon,
  AspectRatio,
  CheckCircle,
  Warning,
  VideoLibrary,
  CropSquare,
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
  surfaces: ('promo_block' | 'map_object')[];
  dimensions: { width: number; height: number };
  size: number;
  weight: number;
  format: 'banner' | 'icon' | 'video';
  fileFormat: string;
  // Promo block specific fields
  title?: string;
  subtitle?: string;
  layoutType?: 'media_left' | 'media_right' | 'media_top';
}

// Mock creative images (base64 encoded placeholders)
const mockImages = {
  vtbBanner: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2OCIgdmlld0JveD0iMCAwIDMyMCAxNjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTY4IiBmaWxsPSIjMDA0QkE4Ii8+Cjx0ZXh0IHg9IjE2MCIgeT0iNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5WVEIgUHJlbWl1bTwvdGV4dD4KPHR5ZWFsbT0iaGF0IHg9IjE2MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CYW5raW5nIENhcmRzPC90ZXh0Pgo8L3N2Zz4K',
  sberBanner: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2OCIgdmlld0JveD0iMCAwIDMyMCAxNjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTY4IiBmaWxsPSIjMjFBMDM4Ii8+Cjx0ZXh0IHg9IjE2MCIgeT0iNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TYmVyYmFuazwvdGV4dD4KPHR5ZWFsbD0iaGF0IHg9IjE2MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BdXRvIENyZWRpdDwvdGV4dD4KPC9zdmc+Cg==',
  tinkoffBanner: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2OCIgdmlld0JveD0iMCAwIDMyMCAxNjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTY4IiBmaWxsPSIjRkZEQjAwIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9ImJsYWNrIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UaW5rb2ZmPC90ZXh0Pgo8dHlwZT0iaGF0IHg9IjE2MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9ImJsYWNrIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CdXNpbmVzcyBBY2NvdW50PC90ZXh0Pgo8L3N2Zz4K',
  megafonIcon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiM4MDA4ODAiLz4KPHR5ZWFsbT0iaGF0IHg9IjMyIiB5PSIzOCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk08L3RleHQ+Cjwvc3ZnPgo=',
  ozonIcon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMwMDVCRkYiLz4KPHR5ZWFsbD0iaGF0IHg9IjMyIiB5PSIzOCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk88L3RleHQ+Cjwvc3ZnPgo=',
  yandexIcon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGRkREMkQiLz48dGV4dCB4PSIzMiIgeT0iMzgiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9ImJsYWNrIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ZPC90ZXh0Pjwvc3ZnPg==',
  videoPlaceholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMDAwIi8+Cjxwb2x5Z29uIHBvaW50cz0iMTMwLDYwIDIwMCwxMDAgMTMwLDE0MCIgZmlsbD0iI0ZGRkYiLz4KPHR5ZWFsbT0iaGF0IHg9IjE2MCIgeT0iMTYwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5WaWRlbyBQbGFjZWhvbGRlcjwvdGV4dD4KPC9zdmc+Cg=='
};

// Mock creative library data
const mockCreativeLibrary: Creative[] = [
  {
    id: '1',
    name: 'VTB Premium Creative',
    url: mockImages.vtbBanner,
    surfaces: ['promo_block', 'map_object'],
    dimensions: { width: 320, height: 168 },
    size: 45600,
    weight: 100,
    format: 'banner',
    fileFormat: 'SVG',
    title: 'VTB Premium Banking',
    subtitle: 'Откройте счёт за 5 минут',
    layoutType: 'media_left',
  },
  {
    id: '2',
    name: 'Sberbank Auto Creative',
    url: mockImages.sberBanner,
    surfaces: ['promo_block'],
    dimensions: { width: 320, height: 168 },
    size: 52300,
    weight: 100,
    format: 'banner',
    fileFormat: 'SVG',
    title: 'Автокредит Сбербанк',
    subtitle: 'От 5.5% годовых',
    layoutType: 'media_top',
  },
  {
    id: '3',
    name: 'Tinkoff Business Creative',
    url: mockImages.tinkoffBanner,
    surfaces: ['promo_block', 'map_object'],
    dimensions: { width: 320, height: 168 },
    size: 48900,
    weight: 100,
    format: 'banner',
    fileFormat: 'SVG',
    title: 'Тинькофф Бизнес',
    subtitle: 'Расчётный счёт бесплатно',
    layoutType: 'media_right',
  },
  {
    id: '4',
    name: 'MegaFon Icon Creative',
    url: mockImages.megafonIcon,
    surfaces: ['map_object'],
    dimensions: { width: 64, height: 64 },
    size: 8900,
    weight: 100,
    format: 'icon',
    fileFormat: 'SVG',
  },
  {
    id: '5',
    name: 'Ozon Icon Creative',
    url: mockImages.ozonIcon,
    surfaces: ['map_object'],
    dimensions: { width: 64, height: 64 },
    size: 7800,
    weight: 100,
    format: 'icon',
    fileFormat: 'SVG',
  },
  {
    id: '6',
    name: 'Yandex Universal Creative',
    url: mockImages.yandexIcon,
    surfaces: ['promo_block', 'map_object'],
    dimensions: { width: 64, height: 64 },
    size: 9200,
    weight: 100,
    format: 'icon',
    fileFormat: 'SVG',
  },
  {
    id: '7',
    name: 'Product Showcase Video',
    url: mockImages.videoPlaceholder,
    surfaces: ['promo_block'],
    dimensions: { width: 320, height: 180 },
    size: 1500000,
    weight: 100,
    format: 'video',
    fileFormat: 'MP4',
  },
];

export const CreativesStep: React.FC<CreativesStepProps> = ({ data, onChange }) => {
  const { t } = useTranslation();
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCreatives, setSelectedCreatives] = useState<Creative[]>([]);
  const [uploading, setUploading] = useState(false);
  const [editingWeights, setEditingWeights] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'banner' | 'icon' | 'video'>('banner');
  const [selectedSurfaces, setSelectedSurfaces] = useState<('promo_block' | 'map_object')[]>(['promo_block']);

  // Dropzone for file uploads
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (selectedSurfaces.length === 0) {
      alert('Please select at least one surface before uploading.');
      return;
    }
    
    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newCreatives = acceptedFiles.map((file, index) => ({
        id: `upload-${Date.now()}-${index}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        file,
        surfaces: selectedSurfaces,
        dimensions: selectedFormat === 'icon' ? { width: 64, height: 64 } : { width: 320, height: 168 },
        size: file.size,
        weight: 100,
        format: selectedFormat,
        fileFormat: file.type.split('/')[1].toUpperCase(),
        // Add default promo block fields if promo_block surface is selected
        ...(selectedSurfaces.includes('promo_block') && {
          title: file.name.replace(/\.[^/.]+$/, ''),
          subtitle: 'Add subtitle text',
          layoutType: 'media_left' as const,
        }),
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
    accept: selectedFormat === 'video' ? {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
    } : {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/svg+xml': ['.svg'],
    },
    maxSize: selectedFormat === 'video' ? 2 * 1024 * 1024 : 500 * 1024, // 2MB for video, 500KB for images
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
    creatives.forEach((c: Creative) => {
      // Check promo block requirements if creative supports this surface
      if (c.surfaces.includes('promo_block')) {
        const ratio = c.dimensions.width / c.dimensions.height;
        if (Math.abs(ratio - 1.91) > 0.1) {
          issues.push({ 
            type: 'warning', 
            message: `${c.name}: Promo block should have 1.91:1 ratio (recommended: 320x168px)` 
          });
        }
      }
      
      // Check map object requirements if creative supports this surface
      if (c.surfaces.includes('map_object')) {
        const ratio = c.dimensions.width / c.dimensions.height;
        if (Math.abs(ratio - 1) > 0.1) {
          issues.push({ 
            type: 'warning', 
            message: `${c.name}: Map object should be square (1:1 ratio)` 
          });
        }
      }
    });

    // Check file sizes
    creatives.forEach((c: Creative) => {
      const maxSize = c.format === 'video' ? 2 * 1024 * 1024 : 500 * 1024;
      const maxSizeText = c.format === 'video' ? '2MB' : '500KB';
      if (c.size > maxSize) {
        issues.push({ 
          type: 'warning', 
          message: `${c.name}: File size exceeds ${maxSizeText} recommendation` 
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
            
            {/* Format Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 2 }}>
                Choose Format:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={selectedFormat === 'banner' ? 'contained' : 'outlined'}
                  startIcon={<AspectRatio />}
                  onClick={() => setSelectedFormat('banner')}
                  sx={{
                    bgcolor: selectedFormat === 'banner' ? '#FFDD2D' : 'transparent',
                    color: selectedFormat === 'banner' ? '#000' : '#1C1C1E',
                    borderColor: '#E5E5EA',
                    '&:hover': {
                      bgcolor: selectedFormat === 'banner' ? '#E6C429' : '#F5F5F7',
                    },
                  }}
                >
                  Banner
                </Button>
                <Button
                  variant={selectedFormat === 'icon' ? 'contained' : 'outlined'}
                  startIcon={<CropSquare />}
                  onClick={() => setSelectedFormat('icon')}
                  sx={{
                    bgcolor: selectedFormat === 'icon' ? '#FFDD2D' : 'transparent',
                    color: selectedFormat === 'icon' ? '#000' : '#1C1C1E',
                    borderColor: '#E5E5EA',
                    '&:hover': {
                      bgcolor: selectedFormat === 'icon' ? '#E6C429' : '#F5F5F7',
                    },
                  }}
                >
                  Icon
                </Button>
                <Button
                  variant={selectedFormat === 'video' ? 'contained' : 'outlined'}
                  startIcon={<VideoLibrary />}
                  onClick={() => setSelectedFormat('video')}
                  sx={{
                    bgcolor: selectedFormat === 'video' ? '#FFDD2D' : 'transparent',
                    color: selectedFormat === 'video' ? '#000' : '#1C1C1E',
                    borderColor: '#E5E5EA',
                    '&:hover': {
                      bgcolor: selectedFormat === 'video' ? '#E6C429' : '#F5F5F7',
                    },
                  }}
                >
                  Video
                </Button>
              </Box>
            </Box>

            {/* Surface Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 2 }}>
                Select Surfaces:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={selectedSurfaces.includes('promo_block') ? 'contained' : 'outlined'}
                  startIcon={<AspectRatio />}
                  onClick={() => {
                    if (selectedSurfaces.includes('promo_block')) {
                      setSelectedSurfaces(prev => prev.filter(s => s !== 'promo_block'));
                    } else {
                      setSelectedSurfaces(prev => [...prev, 'promo_block']);
                    }
                  }}
                  sx={{
                    bgcolor: selectedSurfaces.includes('promo_block') ? '#FFDD2D' : 'transparent',
                    color: selectedSurfaces.includes('promo_block') ? '#000' : '#1C1C1E',
                    borderColor: '#E5E5EA',
                    '&:hover': {
                      bgcolor: selectedSurfaces.includes('promo_block') ? '#E6C429' : '#F5F5F7',
                    },
                  }}
                >
                  Promo Block
                </Button>
                <Button
                  variant={selectedSurfaces.includes('map_object') ? 'contained' : 'outlined'}
                  startIcon={<CropSquare />}
                  onClick={() => {
                    if (selectedSurfaces.includes('map_object')) {
                      setSelectedSurfaces(prev => prev.filter(s => s !== 'map_object'));
                    } else {
                      setSelectedSurfaces(prev => [...prev, 'map_object']);
                    }
                  }}
                  sx={{
                    bgcolor: selectedSurfaces.includes('map_object') ? '#FFDD2D' : 'transparent',
                    color: selectedSurfaces.includes('map_object') ? '#000' : '#1C1C1E',
                    borderColor: '#E5E5EA',
                    '&:hover': {
                      bgcolor: selectedSurfaces.includes('map_object') ? '#E6C429' : '#F5F5F7',
                    },
                  }}
                >
                  Map Object
                </Button>
              </Box>
            </Box>
            
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
                {selectedFormat === 'video' 
                  ? 'Supported formats: MP4, WebM' 
                  : 'Supported formats: JPEG, WebP, SVG'
                }
              </Typography>
              <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                Max size: {selectedFormat === 'video' ? '2MB' : '500KB'} • 
                {selectedFormat === 'banner' && 'Banner ratio: 1.91:1 • '}
                {selectedFormat === 'icon' && 'Icon ratio: 1:1 • '}
                {selectedFormat === 'video' && 'Video ratio: 16:9 or 1:1 • '}
                {selectedSurfaces.length > 0 
                  ? `Surfaces: ${selectedSurfaces.map(s => s === 'promo_block' ? 'Promo' : 'Map').join(', ')}` 
                  : 'Select at least one surface'
                }
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

          {/* Surface Previews */}
          {creatives.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 3 }}>
                Surface Previews
              </Typography>
              
              {/* Promo Block Previews */}
              {creatives.some((c: Creative) => c.surfaces.includes('promo_block')) && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AspectRatio sx={{ fontSize: 16, color: '#8E8E93' }} />
                    Promo Block Previews
                  </Typography>
                  <Grid container spacing={2}>
                    {creatives
                      .filter((c: Creative) => c.surfaces.includes('promo_block'))
                      .map((creative: Creative) => (
                        <Grid item xs={12} sm={6} key={`promo-${creative.id}`}>
                          <Card sx={{ border: '1px solid #E5E5EA', position: 'relative' }}>
                            {/* Promo Block Layout */}
                            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, minHeight: 100 }}>
                              {creative.layoutType === 'media_left' && (
                                <>
                                  <Box sx={{ flexShrink: 0 }}>
                                    <img 
                                      src={creative.url} 
                                      alt={creative.name}
                                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                                    />
                                  </Box>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                      {creative.title || creative.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                                      {creative.subtitle || 'Subtitle text'}
                                    </Typography>
                                  </Box>
                                </>
                              )}
                              {creative.layoutType === 'media_right' && (
                                <>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                      {creative.title || creative.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                                      {creative.subtitle || 'Subtitle text'}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ flexShrink: 0 }}>
                                    <img 
                                      src={creative.url} 
                                      alt={creative.name}
                                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                                    />
                                  </Box>
                                </>
                              )}
                              {creative.layoutType === 'media_top' && (
                                <Box sx={{ textAlign: 'center', width: '100%' }}>
                                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                                    <img 
                                      src={creative.url} 
                                      alt={creative.name}
                                      style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 4 }}
                                    />
                                  </Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                    {creative.title || creative.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                                    {creative.subtitle || 'Subtitle text'}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                            
                            <Box sx={{ px: 2, pb: 2 }}>
                              <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                                Layout: {creative.layoutType || 'media_left'} • Weight: {creative.weight}%
                              </Typography>
                            </Box>
                            
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
                      ))
                    }
                  </Grid>
                </Box>
              )}
              
              {/* Map Object Previews */}
              {creatives.some((c: Creative) => c.surfaces.includes('map_object')) && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CropSquare sx={{ fontSize: 16, color: '#8E8E93' }} />
                    Map Object Previews
                  </Typography>
                  <Grid container spacing={2}>
                    {creatives
                      .filter((c: Creative) => c.surfaces.includes('map_object'))
                      .map((creative: Creative) => (
                        <Grid item xs={6} sm={4} md={3} key={`map-${creative.id}`}>
                          <Card sx={{ border: '1px solid #E5E5EA', position: 'relative' }}>
                            {/* Map Object Layout - Just the media */}
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                                <img 
                                  src={creative.url} 
                                  alt={creative.name}
                                  style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
                                />
                              </Box>
                              <Typography variant="caption" sx={{ color: '#8E8E93', display: 'block' }}>
                                {creative.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                                Weight: {creative.weight}%
                              </Typography>
                            </Box>
                            
                            <IconButton
                              onClick={() => handleRemoveCreative(creative.id)}
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': {
                                  bgcolor: '#FF3B30',
                                  color: 'white',
                                },
                              }}
                              size="small"
                            >
                              <Delete sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Card>
                        </Grid>
                      ))
                    }
                  </Grid>
                </Box>
              )}
              
              {/* Creative Management */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Manage Creatives ({creatives.length})
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
                  <Grid item xs={12} sm={6} md={4} lg={3} key={creative.id}>
                    <Card sx={{ position: 'relative', border: '1px solid #E5E5EA' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                          {creative.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                          {creative.surfaces.map((surface) => (
                            <Chip
                              key={surface}
                              label={surface === 'promo_block' ? 'Promo' : 'Map'}
                              size="small"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
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
                Banner Format
              </Typography>
              <Typography variant="caption" sx={{ color: '#8E8E93', lineHeight: 1.4 }}>
                • Ratio: 1.91:1 (recommended: 320×168px)
                <br />
                • Formats: JPEG, WebP, SVG
                <br />
                • Max size: 500KB
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CropSquare sx={{ fontSize: 16 }} />
                Icon Format
              </Typography>
              <Typography variant="caption" sx={{ color: '#8E8E93', lineHeight: 1.4 }}>
                • Ratio: 1:1 (recommended: 64×64px)
                <br />
                • Formats: SVG preferred, PNG, WebP
                <br />
                • Max size: 500KB
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <VideoLibrary sx={{ fontSize: 16 }} />
                Video Format
              </Typography>
              <Typography variant="caption" sx={{ color: '#8E8E93', lineHeight: 1.4 }}>
                • Ratio: 16:9 or 1:1 (recommended: 320×180px or 320×320px)
                <br />
                • Formats: MP4, WebM
                <br />
                • Max size: 2MB • Duration: 15s max
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
            <Tab label="Banners" />
            <Tab label="Icons" />
            <Tab label="Videos" />
          </Tabs>

          <Grid container spacing={2}>
            {mockCreativeLibrary
              .filter(c => 
                selectedTab === 0 || 
                (selectedTab === 1 && c.format === 'banner') ||
                (selectedTab === 2 && c.format === 'icon') ||
                (selectedTab === 3 && c.format === 'video')
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
                      {creative.url ? (
                        <img 
                          src={creative.url} 
                          alt={creative.name}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <ImageIcon sx={{ fontSize: 32, color: '#8E8E93' }} />
                      )}
                    </CardMedia>
                    
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                        {creative.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        {creative.surfaces.map((surface) => (
                          <Chip
                            key={surface}
                            label={surface === 'promo_block' ? 'Promo' : 'Map'}
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
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