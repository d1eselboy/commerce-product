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
  TextField,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  CloudUpload,
  Add,
  Delete,
  Edit,
  Image as ImageIcon,
  AspectRatio,
  CheckCircle,
  Warning,
  VideoLibrary,
  CropSquare,
  Link,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
// Import VTB images
import vtbBannerImg from '@/images/vtb banner.png';
import vtbLogoImg from '@/images/vtb logo.png';

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
  format: 'static_image' | 'animated_icon';
  fileFormat: string;
  enabled: boolean;
  // Promo block specific fields
  title?: string;
  subtitle?: string;
  layoutType?: 'small_image' | 'fifty_fifty' | 'background_image';
  backgroundColor?: string;
}

// Mock creative images (real VTB images + base64 placeholders)
const mockImages = {
  vtbBanner: vtbBannerImg,
  vtbLogo: vtbLogoImg,
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
    name: 'VTB Premium Banner',
    url: mockImages.vtbBanner,
    surfaces: ['promo_block'],
    dimensions: { width: 320, height: 168 },
    size: 45600,
    weight: 100,
    format: 'static_image',
    fileFormat: 'PNG',
    enabled: true,
    title: 'VTB Premium Banking',
    subtitle: 'Откройте счёт за 5 минут',
    layoutType: 'small_image',
  },
  {
    id: '1b',
    name: 'VTB Logo',
    url: mockImages.vtbLogo,
    surfaces: ['map_object'],
    dimensions: { width: 64, height: 64 },
    size: 15200,
    weight: 100,
    format: 'static_image',
    fileFormat: 'PNG',
    enabled: true,
  },
  {
    id: '2',
    name: 'Sberbank Auto Creative',
    url: mockImages.sberBanner,
    surfaces: ['promo_block'],
    dimensions: { width: 320, height: 168 },
    size: 52300,
    weight: 100,
    format: 'static_image',
    fileFormat: 'SVG',
    enabled: true,
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
    format: 'static_image',
    fileFormat: 'SVG',
    enabled: true,
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
    enabled: true,
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
    enabled: true,
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
    enabled: true,
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
    enabled: true,
  },
];

export const CreativesStep: React.FC<CreativesStepProps> = ({ data, onChange }) => {
  const { t } = useTranslation();
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCreatives, setSelectedCreatives] = useState<Creative[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showMdsInput, setShowMdsInput] = useState(false);
  const [mdsUrl, setMdsUrl] = useState('');
  const [editingCreative, setEditingCreative] = useState<string | null>(null);
  const [showCreativeForm, setShowCreativeForm] = useState(false);
  const [selectedSurface, setSelectedSurface] = useState<'promo_block' | 'map_object'>('promo_block');
  const [creativeCounters, setCreativeCounters] = useState({ promo_block: 1, map_object: 1 });
  const [promoBlockData, setPromoBlockData] = useState({
    id: '',
    enabled: true,
    title: '',
    subtitle: '',
    layoutType: 'small_image' as 'small_image' | 'fifty_fifty' | 'background_image',
    backgroundColor: '#FFFFFF'
  });
  const [mapObjectData, setMapObjectData] = useState({
    id: '',
    enabled: true
  });

  // Generate unique ID for new creative
  const generateUniqueId = (baseName: string, surfaceType: 'promo_block' | 'map_object') => {
    const counter = creativeCounters[surfaceType];
    const newId = `${baseName}_${surfaceType}_${counter}`;
    setCreativeCounters(prev => ({
      ...prev,
      [surfaceType]: prev[surfaceType] + 1
    }));
    return newId;
  };

  // Dropzone for file uploads
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const surfaceData = selectedSurface === 'promo_block' ? promoBlockData : mapObjectData;
    
    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newCreatives = acceptedFiles.map((file, index) => {
        const baseName = surfaceData.id.trim() || file.name.replace(/\.[^/.]+$/, '');
        const uniqueId = generateUniqueId(baseName, selectedSurface);
        
        return {
          id: uniqueId,
          name: file.name.replace(/\.[^/.]+$/, ''),
          file,
          surfaces: [selectedSurface],
          dimensions: selectedSurface === 'map_object' ? { width: 64, height: 64 } : { width: 320, height: 168 },
          size: file.size,
          weight: 100,
          format: selectedSurface === 'map_object' ? 'animated_icon' as const : 'static_image' as const,
          fileFormat: file.type.split('/')[1].toUpperCase(),
          enabled: surfaceData.enabled,
          // Add promo block specific fields
          ...(selectedSurface === 'promo_block' && {
            title: promoBlockData.title || file.name.replace(/\.[^/.]+$/, ''),
            subtitle: promoBlockData.subtitle || 'Add subtitle text',
            layoutType: promoBlockData.layoutType,
            backgroundColor: promoBlockData.backgroundColor,
          }),
        };
      });
      
      const currentCreatives = data.creativeFiles || [];
      const redistributedCreatives = [...currentCreatives, ...newCreatives].map((creative, index, array) => ({
        ...creative,
        weight: Math.floor(100 / array.length),
      }));
      
      onChange({ 
        creativeFiles: redistributedCreatives
      });
      setUploading(false);
      
      // Clear form after successful upload
      if (selectedSurface === 'promo_block') {
        setPromoBlockData({ id: '', enabled: true, title: '', subtitle: '', layoutType: 'small_image', backgroundColor: '#FFFFFF' });
      } else {
        setMapObjectData({ id: '', enabled: true });
      }
    }, 1500);
  }, [data.creativeFiles, onChange, selectedSurface, promoBlockData, mapObjectData, creativeCounters]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: selectedSurface === 'map_object' ? {
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
    } : {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: selectedSurface === 'map_object' ? 1 * 1024 * 1024 : 500 * 1024, // 1MB for animated icons, 500KB for static images
  });

  const handleAddFromLibrary = () => {
    setLibraryOpen(true);
  };

  const handleAddFromMds = () => {
    const surfaceData = selectedSurface === 'promo_block' ? promoBlockData : mapObjectData;
    
    if (!mdsUrl.trim()) return;
    
    setUploading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const filename = mdsUrl.split('/').pop()?.split('.')[0] || 'mds_creative';
      const baseName = surfaceData.id.trim() || filename;
      const uniqueId = generateUniqueId(baseName, selectedSurface);
      
      const newCreative: Creative = {
        id: uniqueId,
        name: filename,
        url: mdsUrl,
        surfaces: [selectedSurface],
        dimensions: selectedSurface === 'map_object' ? { width: 64, height: 64 } : { width: 320, height: 168 },
        size: 0, // Unknown size for MDS links
        weight: 100,
        format: selectedSurface === 'map_object' ? 'animated_icon' : 'static_image',
        fileFormat: mdsUrl.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        enabled: surfaceData.enabled,
        // Add promo block specific fields
        ...(selectedSurface === 'promo_block' && {
          title: promoBlockData.title || filename,
          subtitle: promoBlockData.subtitle || 'MDS Creative',
          layoutType: promoBlockData.layoutType,
          backgroundColor: promoBlockData.backgroundColor,
        }),
      };
      
      const currentCreatives = data.creativeFiles || [];
      const redistributedCreatives = [...currentCreatives, newCreative].map((creative, index, array) => ({
        ...creative,
        weight: Math.floor(100 / array.length),
      }));
      
      onChange({ 
        creativeFiles: redistributedCreatives
      });
      
      setUploading(false);
      setMdsUrl('');
      setShowMdsInput(false);
      
      // Clear form after successful upload
      if (selectedSurface === 'promo_block') {
        setPromoBlockData({ id: '', enabled: true, title: '', subtitle: '', layoutType: 'small_image', backgroundColor: '#FFFFFF' });
      } else {
        setMapObjectData({ id: '', enabled: true });
      }
    }, 1000);
  };
  
  const handleChooseFromLibrary = (creative: Creative) => {
    const surfaceData = selectedSurface === 'promo_block' ? promoBlockData : mapObjectData;
    
    const baseName = surfaceData.id.trim() || creative.name;
    const uniqueId = generateUniqueId(baseName, selectedSurface);
    
    const updatedCreative = {
      ...creative,
      id: uniqueId,
      enabled: surfaceData.enabled,
      surfaces: [selectedSurface],
      ...(selectedSurface === 'promo_block' && {
        title: promoBlockData.title || creative.title,
        subtitle: promoBlockData.subtitle || creative.subtitle,
        layoutType: promoBlockData.layoutType,
        backgroundColor: promoBlockData.backgroundColor,
      }),
    };
    
    const currentCreatives = data.creativeFiles || [];
    const redistributedCreatives = [...currentCreatives, updatedCreative].map((creative, index, array) => ({
      ...creative,
      weight: Math.floor(100 / array.length),
    }));
    
    onChange({ 
      creativeFiles: redistributedCreatives
    });
    setLibraryOpen(false);
    
    // Clear form after successful selection
    if (selectedSurface === 'promo_block') {
      setPromoBlockData({ id: '', enabled: true, title: '', subtitle: '', layoutType: 'small_image', backgroundColor: '#FFFFFF' });
    } else {
      setMapObjectData({ id: '', enabled: true });
    }
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

  const updateCreativesLayoutType = (newLayoutType: 'small_image' | 'fifty_fifty' | 'background_image') => {
    const currentCreatives = data.creativeFiles || [];
    const updatedCreatives = currentCreatives.map((creative: Creative) => {
      if (creative.surfaces.includes('promo_block')) {
        return { ...creative, layoutType: newLayoutType };
      }
      return creative;
    });
    
    onChange({ creativeFiles: updatedCreatives });
  };

  const handleWeightChange = (id: string, newWeight: number) => {
    const currentCreatives = data.creativeFiles || [];
    const updatedCreatives = currentCreatives.map((c: Creative) => 
      c.id === id ? { ...c, weight: newWeight } : c
    );
    onChange({ creativeFiles: updatedCreatives });
  };

  const handleSaveCreative = (creativeData: any) => {
    const currentCreatives = data.creativeFiles || [];
    let updatedCreatives;
    
    if (editingCreative) {
      // Редактирование существующего креатива
      updatedCreatives = currentCreatives.map((c: Creative) => 
        c.id === editingCreative ? { ...c, ...creativeData } : c
      );
    } else {
      // Добавление нового креатива
      const newCreative = {
        ...creativeData,
        weight: Math.floor(100 / (currentCreatives.length + 1)),
      };
      
      updatedCreatives = [...currentCreatives, newCreative].map((creative, index, array) => ({
        ...creative,
        weight: Math.floor(100 / array.length),
      }));
    }
    
    onChange({ creativeFiles: updatedCreatives });
    setEditingCreative(null);
    setShowCreativeForm(false);
    
    // Очистить форму
    if (selectedSurface === 'promo_block') {
      setPromoBlockData({ id: '', enabled: true, title: '', subtitle: '', layoutType: 'small_image', backgroundColor: '#FFFFFF' });
    } else {
      setMapObjectData({ id: '', enabled: true });
    }
  };

  const handleEditCreative = (creativeId: string) => {
    const creative = (data.creativeFiles || []).find((c: Creative) => c.id === creativeId);
    if (creative) {
      setEditingCreative(creativeId);
      setSelectedSurface(creative.surfaces[0] as 'promo_block' | 'map_object');
      
      if (creative.surfaces.includes('promo_block')) {
        setPromoBlockData({
          id: creative.name,
          enabled: creative.enabled,
          title: creative.title || '',
          subtitle: creative.subtitle || '',
          layoutType: creative.layoutType || 'small_image',
          backgroundColor: creative.backgroundColor || '#FFFFFF'
        });
      } else {
        setMapObjectData({
          id: creative.name,
          enabled: creative.enabled
        });
      }
      
      setShowCreativeForm(true);
    }
  };

  const handleCancelEdit = () => {
    setEditingCreative(null);
    setShowCreativeForm(false);
    
    // Очистить форму
    if (selectedSurface === 'promo_block') {
      setPromoBlockData({ id: '', enabled: true, title: '', subtitle: '', layoutType: 'small_image', backgroundColor: '#FFFFFF' });
    } else {
      setMapObjectData({ id: '', enabled: true });
    }
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

    return issues;
  };

  const validationIssues = validateCreatives();
  const creatives = data.creativeFiles || [];

  return (
    <Box>
      <Typography variant="h2" sx={{ mb: 1 }}>
        {t('campaignEditor.title', 'Campaign Creatives')}
      </Typography>
      <Typography variant="body1" sx={{ color: '#8E8E93', mb: 4 }}>
        Upload new creatives or select from your library
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>

          {/* Добавленные креативы */}
          {creatives.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 500 }}>
                  Добавленные креативы ({creatives.length})
                </Typography>
                <Button
                  onClick={() => setShowCreativeForm(true)}
                  startIcon={<Add />}
                  sx={{
                    bgcolor: '#007AFF',
                    color: '#FFFFFF',
                    borderRadius: '12px',
                    px: '16px',
                    py: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: '#0056CC',
                    },
                  }}
                >
                  Добавить креатив
                </Button>
              </Box>

              <Grid container spacing={3}>
                {creatives.map((creative: Creative) => (
                  <Grid item xs={12} sm={6} md={4} key={creative.id}>
                    <Card sx={{ 
                      border: editingCreative === creative.id ? '2px solid #007AFF' : '1px solid #E5E5EA', 
                      borderRadius: '16px',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      }
                    }}>
                      <Box sx={{ position: 'relative' }}>
                        {/* Creative Preview */}
                        <Box sx={{ height: 140, position: 'relative', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
                          {creative.surfaces.includes('promo_block') ? (
                            // Promo Block Preview
                            creative.layoutType === 'small_image' ? (
                              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
                                <Box sx={{ flexShrink: 0 }}>
                                  <img 
                                    src={creative.url || (creative.file ? URL.createObjectURL(creative.file) : '')} 
                                    alt={creative.name}
                                    style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }}
                                  />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="subtitle2" sx={{ mb: 0.5, color: '#1C1C1E' }}>
                                    {creative.title || creative.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                                    {creative.subtitle || 'Subtitle text'}
                                  </Typography>
                                </Box>
                              </Box>
                            ) : creative.layoutType === 'fifty_fifty' ? (
                              <Box sx={{ display: 'flex', height: '140px' }}>
                                <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                  <Typography variant="subtitle2" sx={{ mb: 0.5, color: '#1C1C1E' }}>
                                    {creative.title || creative.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                                    {creative.subtitle || 'Subtitle text'}
                                  </Typography>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <img 
                                    src={creative.url || (creative.file ? URL.createObjectURL(creative.file) : '')} 
                                    alt={creative.name}
                                    style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                                  />
                                </Box>
                              </Box>
                            ) : (
                              <Box sx={{ 
                                height: '140px',
                                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${creative.url || (creative.file ? URL.createObjectURL(creative.file) : '')})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                              }}>
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                  <Typography variant="subtitle2" sx={{ mb: 0.5, color: 'white', fontWeight: 600 }}>
                                    {creative.title || creative.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                    {creative.subtitle || 'Subtitle text'}
                                  </Typography>
                                </Box>
                              </Box>
                            )
                          ) : (
                            // Map Object Preview
                            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', bgcolor: '#F9F9F9' }}>
                              <img 
                                src={creative.url || (creative.file ? URL.createObjectURL(creative.file) : '')} 
                                alt={creative.name}
                                style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
                              />
                            </Box>
                          )}
                          
                          {/* Action Buttons */}
                          <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                            <IconButton
                              onClick={() => handleEditCreative(creative.id)}
                              sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(4px)',
                                '&:hover': {
                                  bgcolor: '#007AFF',
                                  color: 'white',
                                },
                              }}
                              size="small"
                            >
                              <Edit sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton
                              onClick={() => handleRemoveCreative(creative.id)}
                              sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(4px)',
                                '&:hover': {
                                  bgcolor: '#FF3B30',
                                  color: 'white',
                                },
                              }}
                              size="small"
                            >
                              <Delete sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </Box>
                        
                        {/* Creative Info */}
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1C1C1E' }}>
                            {creative.name}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                            <Chip
                              label={creative.surfaces[0] === 'promo_block' ? 'Промоблок' : 'Объект на карте'}
                              size="small"
                              sx={{ 
                                fontSize: '0.7rem',
                                bgcolor: creative.surfaces[0] === 'promo_block' ? '#E3F2FD' : '#FFF3E0',
                                color: creative.surfaces[0] === 'promo_block' ? '#1976D2' : '#F57C00'
                              }}
                            />
                            <Chip
                              label={`${creative.weight}%`}
                              size="small"
                              sx={{ fontSize: '0.7rem', bgcolor: '#F0F8FF', color: '#007AFF' }}
                            />
                            <Chip
                              label={creative.enabled ? 'Активен' : 'Отключен'}
                              size="small"
                              sx={{ 
                                fontSize: '0.7rem', 
                                bgcolor: creative.enabled ? '#E8F5E8' : '#FFEBEE',
                                color: creative.enabled ? '#34C759' : '#FF3B30'
                              }}
                            />
                          </Box>
                          
                          <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                            {creative.dimensions.width}×{creative.dimensions.height} • {(creative.size / 1024).toFixed(1)}KB
                          </Typography>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Форма добавления нового креатива или список пуст */}
          {(showCreativeForm || creatives.length === 0) && (
            <Box sx={{ mb: 4 }}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: '16px', 
                border: '2px dashed #007AFF',
                bgcolor: '#F0F8FF'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ color: '#007AFF', fontWeight: 600 }}>
                    {editingCreative ? 'Редактирование креатива' : (creatives.length === 0 ? 'Добавьте первый креатив' : 'Добавить новый креатив')}
                  </Typography>
                  {(showCreativeForm && creatives.length > 0) && (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {editingCreative && (
                        <Button
                          onClick={() => {
                            // Собираем данные из формы для сохранения
                            const creativeData = {
                              name: selectedSurface === 'promo_block' ? promoBlockData.id || 'Creative' : mapObjectData.id || 'Creative',
                              enabled: selectedSurface === 'promo_block' ? promoBlockData.enabled : mapObjectData.enabled,
                              ...(selectedSurface === 'promo_block' && {
                                title: promoBlockData.title,
                                subtitle: promoBlockData.subtitle,
                                layoutType: promoBlockData.layoutType,
                                backgroundColor: promoBlockData.backgroundColor,
                              }),
                            };
                            handleSaveCreative(creativeData);
                          }}
                          variant="contained"
                          sx={{
                            bgcolor: '#007AFF',
                            color: '#FFFFFF',
                            borderRadius: '8px',
                            px: '16px',
                            py: '8px',
                            fontWeight: 500,
                            textTransform: 'none',
                            '&:hover': {
                              bgcolor: '#0056CC',
                            },
                          }}
                        >
                          Сохранить
                        </Button>
                      )}
                      <Button
                        onClick={handleCancelEdit}
                        sx={{ color: '#8E8E93' }}
                      >
                        Отмена
                      </Button>
                    </Box>
                  )}
                </Box>
                
                <Typography variant="body2" sx={{ color: '#1976D2', mb: 4 }}>
                  Выберите тип поверхности и загрузите креатив или выберите из библиотеки
                </Typography>
                
                {/* Surface Selection */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, color: '#1C1C1E', fontWeight: 500 }}>
                    Тип поверхности:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant={selectedSurface === 'promo_block' ? 'contained' : 'outlined'}
                      startIcon={<AspectRatio />}
                      onClick={() => setSelectedSurface('promo_block')}
                      sx={{
                        bgcolor: selectedSurface === 'promo_block' ? '#007AFF' : '#FFFFFF',
                        color: selectedSurface === 'promo_block' ? '#FFFFFF' : '#1C1C1E',
                        borderColor: '#007AFF',
                        borderRadius: '12px',
                        px: '20px',
                        py: '12px',
                        fontWeight: 500,
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: selectedSurface === 'promo_block' ? '#0056CC' : '#F0F8FF',
                        },
                      }}
                    >
                      Промоблок
                    </Button>
                    <Button
                      variant={selectedSurface === 'map_object' ? 'contained' : 'outlined'}
                      startIcon={<CropSquare />}
                      onClick={() => setSelectedSurface('map_object')}
                      sx={{
                        bgcolor: selectedSurface === 'map_object' ? '#007AFF' : '#FFFFFF',
                        color: selectedSurface === 'map_object' ? '#FFFFFF' : '#1C1C1E',
                        borderColor: '#007AFF',
                        borderRadius: '12px',
                        px: '20px',
                        py: '12px',
                        fontWeight: 500,
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: selectedSurface === 'map_object' ? '#0056CC' : '#F0F8FF',
                        },
                      }}
                    >
                      Объект на карте
                    </Button>
                  </Box>
                </Box>

                {/* Configuration Form */}
                <Paper sx={{ p: 3, mb: 4, borderRadius: '12px', bgcolor: '#FAFAFA' }}>
                  {selectedSurface === 'promo_block' ? (
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1C1C1E' }}>
                        Настройка промоблока
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Основное имя (опционально)"
                            placeholder="Основное имя для креативов"
                            value={promoBlockData.id}
                            onChange={(e) => setPromoBlockData(prev => ({ ...prev, id: e.target.value }))}
                            helperText="Оставьте пустым для автоматической генерации ID"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                bgcolor: '#FFFFFF',
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={promoBlockData.enabled}
                                onChange={(e) => setPromoBlockData(prev => ({ ...prev, enabled: e.target.checked }))}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#34C759',
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#34C759',
                                  },
                                }}
                              />
                            }
                            label={<Typography sx={{ fontWeight: 500 }}>Включить креатив</Typography>}
                            sx={{ mt: 2 }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Заголовок"
                            placeholder="Введите заголовок промоблока"
                            value={promoBlockData.title}
                            onChange={(e) => setPromoBlockData(prev => ({ ...prev, title: e.target.value }))}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                bgcolor: '#FFFFFF',
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Подзаголовок"
                            placeholder="Введите подзаголовок промоблока"
                            value={promoBlockData.subtitle}
                            onChange={(e) => setPromoBlockData(prev => ({ ...prev, subtitle: e.target.value }))}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                bgcolor: '#FFFFFF',
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                      
                      {/* Layout Type */}
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                          Тип раскладки:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Button
                            variant={promoBlockData.layoutType === 'small_image' ? 'contained' : 'outlined'}
                            onClick={() => setPromoBlockData(prev => ({ ...prev, layoutType: 'small_image' }))}
                            sx={{
                              bgcolor: promoBlockData.layoutType === 'small_image' ? '#007AFF' : '#FFFFFF',
                              color: promoBlockData.layoutType === 'small_image' ? '#FFFFFF' : '#1C1C1E',
                              borderColor: '#007AFF',
                              borderRadius: '8px',
                              px: '12px',
                              py: '6px',
                              textTransform: 'none',
                            }}
                          >
                            Маленькое изображение
                          </Button>
                          <Button
                            variant={promoBlockData.layoutType === 'fifty_fifty' ? 'contained' : 'outlined'}
                            onClick={() => setPromoBlockData(prev => ({ ...prev, layoutType: 'fifty_fifty' }))}
                            sx={{
                              bgcolor: promoBlockData.layoutType === 'fifty_fifty' ? '#007AFF' : '#FFFFFF',
                              color: promoBlockData.layoutType === 'fifty_fifty' ? '#FFFFFF' : '#1C1C1E',
                              borderColor: '#007AFF',
                              borderRadius: '8px',
                              px: '12px',
                              py: '6px',
                              textTransform: 'none',
                            }}
                          >
                            50/50 разделение
                          </Button>
                          <Button
                            variant={promoBlockData.layoutType === 'background_image' ? 'contained' : 'outlined'}
                            onClick={() => setPromoBlockData(prev => ({ ...prev, layoutType: 'background_image' }))}
                            sx={{
                              bgcolor: promoBlockData.layoutType === 'background_image' ? '#007AFF' : '#FFFFFF',
                              color: promoBlockData.layoutType === 'background_image' ? '#FFFFFF' : '#1C1C1E',
                              borderColor: '#007AFF',
                              borderRadius: '8px',
                              px: '12px',
                              py: '6px',
                              textTransform: 'none',
                            }}
                          >
                            Фоновое изображение
                          </Button>
                        </Box>
                      </Box>

                      {/* Background Color */}
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                          Цвет фона:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: promoBlockData.backgroundColor,
                              border: '2px solid #E5E5EA',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              position: 'relative',
                              '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              },
                              transition: 'all 0.2s ease',
                            }}
                            onClick={() => {
                              // Создаем невидимый input для выбора цвета
                              const colorInput = document.createElement('input');
                              colorInput.type = 'color';
                              colorInput.value = promoBlockData.backgroundColor;
                              colorInput.onchange = (e) => {
                                const target = e.target as HTMLInputElement;
                                setPromoBlockData(prev => ({ ...prev, backgroundColor: target.value }));
                              };
                              colorInput.click();
                            }}
                          />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#1C1C1E' }}>
                              {promoBlockData.backgroundColor.toUpperCase()}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                              Нажмите на квадрат для выбора цвета
                            </Typography>
                          </Box>
                        </Box>
                        
                        {/* Предустановленные цвета */}
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" sx={{ color: '#8E8E93', mb: 1, display: 'block' }}>
                            Популярные цвета:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {['#FFFFFF', '#000000', '#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#FFDD2D'].map((color) => (
                              <Box
                                key={color}
                                sx={{
                                  width: 24,
                                  height: 24,
                                  bgcolor: color,
                                  border: promoBlockData.backgroundColor === color ? '2px solid #007AFF' : '1px solid #E5E5EA',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                  },
                                  transition: 'all 0.2s ease',
                                }}
                                onClick={() => setPromoBlockData(prev => ({ ...prev, backgroundColor: color }))}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1C1C1E' }}>
                        Настройка объекта на карте
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Основное имя (опционально)"
                            placeholder="Основное имя для креативов"
                            value={mapObjectData.id}
                            onChange={(e) => setMapObjectData(prev => ({ ...prev, id: e.target.value }))}
                            helperText="Оставьте пустым для автоматической генерации ID"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                bgcolor: '#FFFFFF',
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={mapObjectData.enabled}
                                onChange={(e) => setMapObjectData(prev => ({ ...prev, enabled: e.target.checked }))}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#34C759',
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#34C759',
                                  },
                                }}
                              />
                            }
                            label={<Typography sx={{ fontWeight: 500 }}>Включить креатив</Typography>}
                            sx={{ mt: 2 }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Paper>

                {/* Upload, Library and MDS Options */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                  <Paper
                    {...getRootProps()}
                    sx={{
                      flex: 1,
                      minWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.33% - 8px)' },
                      p: 3,
                      border: '2px dashed #007AFF',
                      borderRadius: '12px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      bgcolor: isDragActive ? '#F0F8FF' : '#FFFFFF',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        bgcolor: '#F0F8FF',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    <input {...getInputProps()} />
                    <CloudUpload sx={{ fontSize: 32, color: '#007AFF', mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#007AFF' }}>
                      {isDragActive ? 'Отпустите файлы здесь' : 'Загрузить файл'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#1976D2' }}>
                      {selectedSurface === 'map_object' 
                        ? 'GIF, WebP (анимированные)' 
                        : 'JPEG, PNG'
                      }
                    </Typography>
                  </Paper>
                  
                  <Paper
                    sx={{
                      flex: 1,
                      minWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.33% - 8px)' },
                      p: 3,
                      border: '1px solid #007AFF',
                      borderRadius: '12px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      bgcolor: '#FFFFFF',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        bgcolor: '#F0F8FF',
                        transform: 'translateY(-1px)',
                      },
                    }}
                    onClick={handleAddFromLibrary}
                  >
                    <VideoLibrary sx={{ fontSize: 32, color: '#007AFF', mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#007AFF' }}>
                      Из библиотеки
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#1976D2' }}>
                      Выбрать готовые креативы
                    </Typography>
                  </Paper>

                  <Paper
                    sx={{
                      flex: 1,
                      minWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.33% - 8px)' },
                      p: 3,
                      border: '1px solid #34C759',
                      borderRadius: '12px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      bgcolor: '#FFFFFF',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        bgcolor: '#F0FFF4',
                        transform: 'translateY(-1px)',
                      },
                    }}
                    onClick={() => setShowMdsInput(true)}
                  >
                    <Link sx={{ fontSize: 32, color: '#34C759', mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#34C759' }}>
                      Ссылка из MDS
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#22A54A' }}>
                      Указать URL медиа
                    </Typography>
                  </Paper>
                </Box>

                {/* MDS URL Input */}
                {showMdsInput && (
                  <Paper sx={{ p: 3, mb: 4, border: '1px solid #34C759', borderRadius: '12px', bgcolor: '#F0FFF4' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Link sx={{ fontSize: 20, color: '#34C759' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#34C759' }}>
                        Добавить медиа из MDS
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                      <TextField
                        fullWidth
                        label="URL медиа из MDS"
                        placeholder="https://avatars.mds.yandex.net/get-..."
                        value={mdsUrl}
                        onChange={(e) => setMdsUrl(e.target.value)}
                        helperText="Вставьте прямую ссылку на изображение или медиа из MDS"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            bgcolor: '#FFFFFF',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#34C759',
                          },
                          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#34C759',
                          },
                        }}
                      />
                      <Button
                        onClick={handleAddFromMds}
                        disabled={!mdsUrl.trim() || uploading}
                        variant="contained"
                        sx={{
                          bgcolor: '#34C759',
                          color: '#FFFFFF',
                          minWidth: 100,
                          height: 56,
                          '&:hover': {
                            bgcolor: '#22A54A',
                          },
                          '&:disabled': {
                            bgcolor: '#E5E5EA',
                            color: '#8E8E93',
                          },
                        }}
                      >
                        Добавить
                      </Button>
                      <Button
                        onClick={() => {
                          setShowMdsInput(false);
                          setMdsUrl('');
                        }}
                        sx={{ 
                          color: '#8E8E93',
                          height: 56,
                          minWidth: 80,
                        }}
                      >
                        Отмена
                      </Button>
                    </Box>
                  </Paper>
                )}
                
                {uploading && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: '#007AFF' }}>Загрузка...</Typography>
                    <LinearProgress sx={{ '& .MuiLinearProgress-bar': { bgcolor: '#007AFF' } }} />
                  </Box>
                )}
              </Paper>
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
            elevation={1}
            sx={{ 
              p: 3, 
              bgcolor: '#F5F5F7', 
              borderRadius: '16px',
              border: '1px solid #E5E5EA',
              mb: 3,
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              {t('campaignEditor.creatives.formatRequirements')}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AspectRatio sx={{ fontSize: 16 }} />
                {t('campaignEditor.creatives.bannerFormat')}
              </Typography>
              <Typography variant="body2" sx={{ color: '#8E8E93', lineHeight: 1.4 }}>
                • Соотношение: 1.91:1 (рекомендуется: 320×168px)
                <br />
                • Форматы: JPEG, WebP, SVG
                <br />
                • Максимальный размер: 500KB
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CropSquare sx={{ fontSize: 16 }} />
                {t('campaignEditor.creatives.iconFormat')}
              </Typography>
              <Typography variant="body2" sx={{ color: '#8E8E93', lineHeight: 1.4 }}>
                • Соотношение: 1:1 (рекомендуется: 64×64px)
                <br />
                • Форматы: SVG предпочтительно, PNG, WebP
                <br />
                • Максимальный размер: 500KB
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <VideoLibrary sx={{ fontSize: 16 }} />
                {t('campaignEditor.creatives.videoFormat')}
              </Typography>
              <Typography variant="body2" sx={{ color: '#8E8E93', lineHeight: 1.4 }}>
                • Соотношение: 16:9 или 1:1 (рекомендуется: 320×180px или 320×320px)
                <br />
                • Форматы: MP4, WebM
                <br />
                • Максимальный размер: 2MB • Длительность: макс. 15с
              </Typography>
            </Box>
          </Paper>

          
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
                    onClick={() => handleChooseFromLibrary(creative)}
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