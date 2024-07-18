import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const NewInvestments = () => {
  const { t } = useTranslation();

  console.log('hey');
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Typography variant="h5">{t('comingSoon')}</Typography>
    </Box>
  );
};

export default NewInvestments;