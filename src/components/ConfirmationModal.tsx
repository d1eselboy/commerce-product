import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Warning,
  Info,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  actionType: 'create' | 'edit' | 'statusChange';
  campaignName?: string;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  actionType,
  campaignName,
  isLoading = false,
}) => {
  const getActionText = () => {
    switch (actionType) {
      case 'create':
        return 'создании кампании';
      case 'edit':
        return 'редактировании кампании';
      case 'statusChange':
        return 'изменении статуса кампании';
      default:
        return 'выполнении операции';
    }
  };

  const getImpactItems = () => {
    const items = [
      'Изменения будут отправлены в tariff editor для согласования',
      'Процесс согласования может занять от 1 до 3 рабочих дней',
      'До получения подтверждения кампания будет в статусе "На согласовании"',
      'Вы получите уведомление о результатах согласования на email',
    ];

    if (actionType === 'statusChange') {
      items.push('Текущие показы кампании будут приостановлены до подтверждения изменений');
    }

    if (actionType === 'edit') {
      items.push('Внесенные изменения будут применены после согласования');
      items.push('Текущие показы кампании продолжатся с прежними параметрами до подтверждения');
    }

    return items;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Warning sx={{ color: '#FF9500', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        <Typography variant="body1" sx={{ mb: 3, color: '#1C1C1E' }}>
          {description}
        </Typography>

        {campaignName && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: '#8E8E93', mb: 1 }}>
              Кампания:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {campaignName}
            </Typography>
          </Box>
        )}

        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3,
            bgcolor: '#FFF3E0',
            border: '1px solid #FFB74D',
            '& .MuiAlert-icon': {
              color: '#F57C00',
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Требуется подтверждение изменений
          </Typography>
          <Typography variant="body2">
            При {getActionText()} вам необходимо будет подтвердить изменения 
            по таблице согласования в конфиге tariff editor / админке драйва.
          </Typography>
        </Alert>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#1C1C1E' }}>
          Что произойдет после подтверждения:
        </Typography>

        <List dense sx={{ pl: 0 }}>
          {getImpactItems().map((item, index) => (
            <ListItem key={index} sx={{ pl: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Info sx={{ fontSize: 16, color: '#007AFF' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ color: '#1C1C1E' }}>
                    {item}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 3, p: 2, bgcolor: '#F0F8FF', borderRadius: '8px', border: '1px solid #BBDEFB' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CheckCircle sx={{ fontSize: 16, color: '#1976D2' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976D2' }}>
              Важная информация
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#1976D2' }}>
            Убедитесь, что все параметры кампании настроены корректно. 
            После отправки на согласование внесение изменений будет ограничено.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          sx={{
            color: '#8E8E93',
            borderRadius: '8px',
            px: 3,
            py: 1,
            '&:hover': {
              bgcolor: '#F2F2F7',
            },
          }}
        >
          Отмена
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          variant="contained"
          sx={{
            bgcolor: '#FF9500',
            color: '#FFFFFF',
            borderRadius: '8px',
            px: 3,
            py: 1,
            fontWeight: 600,
            '&:hover': {
              bgcolor: '#F57C00',
            },
            '&:disabled': {
              bgcolor: '#E5E5EA',
              color: '#8E8E93',
            },
          }}
        >
          {isLoading ? 'Отправка...' : 'Подтвердить и продолжить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};