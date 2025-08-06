import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const pathMap: Record<string, string> = {
  '': 'campaigns',
  'campaigns': 'campaigns',
  'surfaces': 'surfaces',
  'live-logs': 'liveLogs',
  'settings': 'settings',
};

export const Breadcrumbs: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <MuiBreadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      <Link
        component={RouterLink}
        to="/"
        color="inherit"
        underline="hover"
      >
        {t('navigation.campaigns')}
      </Link>
      
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const translationKey = pathMap[name] || name;
        
        return isLast ? (
          <Typography key={name} color="text.primary">
            {t(`navigation.${translationKey}`, name)}
          </Typography>
        ) : (
          <Link
            key={name}
            component={RouterLink}
            to={routeTo}
            color="inherit"
            underline="hover"
          >
            {t(`navigation.${translationKey}`, name)}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};