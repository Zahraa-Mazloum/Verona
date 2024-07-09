import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Avatar, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import loader from '../loading.gif';

const ViewInvestor = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestor = async () => {
      try {
        const { data } = await api.get(`/admin/userProfile/${id}`);
        setInvestor(data);
      } catch (error) {
        console.error('Error fetching investor details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestor();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <img src={loader} alt="Loading..." />
      </Box>
    );
  }

  if (!investor) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h5">{t('Investor not found')}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3} bgcolor="#f7f7f7">
      <Paper elevation={8} style={{ padding: '20px', backgroundColor: '#ffffff' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              alt={investor.fullname_en}
              src={investor.passportPhoto}
              sx={{ width: 100, height: 100 }}
            />
          </Grid>
          <Grid item>
            <Typography variant="h4" gutterBottom style={{ color: '#d25716' }}>
              {investor.fullname_en}
            </Typography>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="body1"><strong>{t('email')}:</strong> {investor.email}</Typography>
          <Typography variant="body1"><strong>{t('phoneNumber')}:</strong> {investor.phoneNumber}</Typography>
          <Typography variant="body1"><strong>{t('dateOfBirth')}:</strong> {new Date(investor.dateOfBirth).toLocaleDateString()}</Typography>
          <Typography variant="body1"><strong>{t('passportNumber')}:</strong> {investor.passportNumber}</Typography>
          <Typography variant="body1"><strong>{t('passportExpiryDate')}:</strong> {new Date(investor.passportExpiryDate).toLocaleDateString()}</Typography>
          <Typography variant="body1"><strong>{t('status')}:</strong> {investor.status}</Typography>
          <Typography variant="imag"><strong>{t('passport')}:</strong> {investor.passportPhoto}</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewInvestor;
