import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  IconButton,
  Alert,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Visibility,
  CheckCircle,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCampaignQuery, useCreateCampaignMutation, useUpdateCampaignMutation } from '@/store/api';
import { BasicStep } from './CampaignEditor/BasicStep';
import { SchedulingStep } from './CampaignEditor/SchedulingStep';
import { AudienceStep } from './CampaignEditor/AudienceStep';
import { WeightsStep } from './CampaignEditor/WeightsStep';
import { CreativesStep } from './CampaignEditor/CreativesStep';
import { ReviewStep } from './CampaignEditor/ReviewStep';
import type { Campaign } from '@/types/campaign';

const steps = [
  'basic',
  'scheduling',
  'audience',
  'weights',
  'creatives',
  'review'
];

interface CampaignFormData extends Partial<Campaign> {
  // Additional form-specific fields
  timeTargeting?: {
    days: number[];
    startHour: number;
    endHour: number;
  };
  audienceTargeting?: {
    type: 'role' | 'file';
    role?: string;
    file?: File;
    fileName?: string;
    fileSize?: number;
    estimatedIds?: number;
  };
  creativeFiles?: File[];
}

export const CampaignEditor: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id && id !== 'new');

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    audienceTargeting: undefined,
    weight: undefined,
    consecutiveCap: 3,
    limitImpressions: undefined,
    creatives: [],
    status: 'draft',
    timeTargeting: {
      days: [1, 2, 3, 4, 5], // Weekdays
      startHour: 9,
      endHour: 21,
    },
    creativeFiles: [],
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isDraft, setIsDraft] = useState(true);

  const { data: existingCampaign, isLoading } = useGetCampaignQuery(id!, { skip: !isEdit });
  const [createCampaign, { isLoading: isCreating }] = useCreateCampaignMutation();
  const [updateCampaign, { isLoading: isUpdating }] = useUpdateCampaignMutation();

  // Load existing campaign data
  useEffect(() => {
    if (existingCampaign) {
      setFormData(prev => ({
        ...prev,
        ...existingCampaign,
        timeTargeting: prev.timeTargeting, // Keep default time targeting
      }));
      setIsDraft(existingCampaign.status === 'draft');
    }
  }, [existingCampaign]);

  const updateFormData = (updates: Partial<CampaignFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear validation errors for updated fields
    const updatedFields = Object.keys(updates);
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => delete newErrors[field]);
      return newErrors;
    });
  };

  const validateStep = (stepIndex: number): boolean => {
    const errors: Record<string, string> = {};

    switch (stepIndex) {
      case 0: // Basic
        if (!formData.name?.trim()) {
          errors.name = t('campaignEditor.validation.nameRequired');
        }
        break;
      case 1: // Scheduling
        if (!formData.startDate || !formData.endDate) {
          errors.dates = t('campaignEditor.validation.datesRequired');
        }
        if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
          errors.dates = 'End date must be after start date';
        }
        if (!formData.limitImpressions || formData.limitImpressions <= 0) {
          errors.limitImpressions = t('campaignEditor.validation.impressionsRequired', 'Impression limit must be greater than 0');
        }
        break;
      case 2: // Audience
        if (!formData.audienceTargeting?.type) {
          errors.audience = t('campaignEditor.validation.audienceRequired');
        } else if (formData.audienceTargeting.type === 'role' && !formData.audienceTargeting.role) {
          errors.audience = 'Необходимо выбрать роль аудитории';
        } else if (formData.audienceTargeting.type === 'file' && !formData.audienceTargeting.file) {
          errors.audience = 'Необходимо загрузить файл с ID аудитории';
        }
        break;
      case 3: // Weights
        if (!formData.weight || formData.weight <= 0) {
          errors.weight = t('campaignEditor.validation.weightRequired', 'Weight must be greater than 0');
        }
        if (!formData.consecutiveCap || formData.consecutiveCap <= 0) {
          errors.consecutiveCap = 'Consecutive cap must be greater than 0';
        }
        break;
      case 4: // Creatives
        if (!formData.creatives?.length && !formData.creativeFiles?.length) {
          errors.creatives = t('campaignEditor.validation.noCreatives');
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSaveDraft = async () => {
    try {
      const campaignData = {
        ...formData,
        status: 'draft' as const,
      };
      delete campaignData.creativeFiles;
      delete campaignData.timeTargeting;

      if (isEdit) {
        await updateCampaign({ id: id!, data: campaignData }).unwrap();
      } else {
        await createCampaign(campaignData).unwrap();
      }
      
      navigate('/campaigns');
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const handlePublish = async () => {
    if (!validateStep(activeStep)) return;

    try {
      const campaignData = {
        ...formData,
        status: 'active' as const,
      };
      delete campaignData.creativeFiles;
      delete campaignData.timeTargeting;

      if (isEdit) {
        await updateCampaign({ id: id!, data: campaignData }).unwrap();
      } else {
        await createCampaign(campaignData).unwrap();
        // TODO: Upload creative files if any
      }
      
      navigate('/campaigns');
    } catch (error) {
      console.error('Failed to publish campaign:', error);
    }
  };

  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <BasicStep
            data={formData}
            onChange={updateFormData}
            errors={validationErrors}
          />
        );
      case 1:
        return (
          <SchedulingStep
            data={formData}
            onChange={updateFormData}
            errors={validationErrors}
          />
        );
      case 2:
        return (
          <AudienceStep
            data={formData}
            onChange={updateFormData}
            errors={validationErrors}
          />
        );
      case 3:
        return (
          <WeightsStep
            data={formData}
            onChange={updateFormData}
            errors={validationErrors}
          />
        );
      case 4:
        return (
          <CreativesStep
            data={formData}
            onChange={updateFormData}
            errors={validationErrors}
          />
        );
      case 5:
        return (
          <ReviewStep
            data={formData}
            onChange={updateFormData}
            errors={validationErrors}
          />
        );
      default:
        return null;
    }
  };

  const isStepComplete = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Basic
        return Boolean(formData.name?.trim());
      case 1: // Scheduling
        return Boolean(formData.startDate && formData.endDate && formData.limitImpressions && formData.limitImpressions > 0);
      case 2: // Audience
        return Boolean(formData.audienceTargeting?.type && (
          (formData.audienceTargeting.type === 'role' && formData.audienceTargeting.role) ||
          (formData.audienceTargeting.type === 'file' && formData.audienceTargeting.file)
        ));
      case 3: // Weights
        return Boolean(formData.weight !== undefined && formData.weight > 0 && formData.consecutiveCap !== undefined);
      case 4: // Creatives
        return Boolean(formData.creatives?.length || formData.creativeFiles?.length);
      default:
        return false;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <LinearProgress sx={{ width: '100%' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/campaigns')} sx={{ color: '#8E8E93' }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 500 }}>
          {isEdit ? t('campaignEditor.editTitle') : t('campaignEditor.createTitle')}
        </Typography>
        {formData.name && (
          <Chip 
            label={formData.name} 
            sx={{ bgcolor: '#F5F5F7', color: '#1C1C1E' }}
          />
        )}
      </Box>

      {/* Auto-save indicator */}
      {isDraft && (
        <Alert 
          severity="info" 
          sx={{ mb: 3, bgcolor: '#E3F2FD', border: '1px solid #BBDEFB' }}
          icon={<Save sx={{ color: '#1976D2' }} />}
        >
          Draft auto-saved • Last saved 2 minutes ago
        </Alert>
      )}

      <Paper sx={{ borderRadius: 2, border: '1px solid #E5E5EA', overflow: 'hidden' }}>
        {/* Step Progress */}
        <Box sx={{ p: 3, bgcolor: '#F5F5F7', borderBottom: '1px solid #E5E5EA' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((stepKey, index) => (
              <Step key={stepKey} completed={isStepComplete(index)}>
                <StepLabel
                  icon={
                    isStepComplete(index) ? (
                      <CheckCircle sx={{ color: '#34C759', fontSize: 20 }} />
                    ) : (
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          bgcolor: activeStep >= index ? '#FFDD2D' : '#E5E5EA',
                          color: activeStep >= index ? '#000' : '#8E8E93',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}
                      >
                        {index + 1}
                      </Box>
                    )
                  }
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: activeStep >= index ? '#1C1C1E' : '#8E8E93',
                    },
                  }}
                >
                  {t(`campaignEditor.steps.${stepKey}`)}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Step Content */}
        <Box sx={{ p: 4, minHeight: 400 }}>
          {getStepContent(activeStep)}
        </Box>

        {/* Actions */}
        <Box 
          sx={{ 
            p: 3, 
            bgcolor: '#F5F5F7', 
            borderTop: '1px solid #E5E5EA',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ color: '#8E8E93' }}
            >
              {t('campaignEditor.buttons.previous')}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={handleSaveDraft}
              disabled={isCreating || isUpdating}
              startIcon={<Save />}
              sx={{
                color: '#1C1C1E',
                bgcolor: '#FFFFFF',
                border: '1px solid #E5E5EA',
                '&:hover': {
                  bgcolor: '#F5F5F7',
                },
              }}
            >
              {t('campaignEditor.buttons.save')}
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                onClick={handlePublish}
                disabled={isCreating || isUpdating || Object.keys(validationErrors).length > 0}
                startIcon={<Visibility />}
                sx={{
                  bgcolor: '#FFDD2D',
                  color: '#000',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: '#E6C429',
                  },
                  '&:disabled': {
                    bgcolor: '#E5E5EA',
                    color: '#8E8E93',
                  },
                }}
              >
                {t('campaignEditor.buttons.publish')}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isStepComplete(activeStep)}
                sx={{
                  bgcolor: '#FFDD2D',
                  color: '#000',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: '#E6C429',
                  },
                  '&:disabled': {
                    bgcolor: '#E5E5EA',
                    color: '#8E8E93',
                  },
                }}
              >
                {t('campaignEditor.buttons.next')}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};