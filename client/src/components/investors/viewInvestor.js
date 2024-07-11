import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Buffer } from 'buffer';


const InvestorDetails = () => {
  const { id } = useParams();
  const [investor, setInvestor] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchInvestor = async () => {
      try {
        const { data } = await api.get(`/admin/userProfile/${id}`);
        console.log(data);
        setInvestor(data);
      } catch (error) {
        console.error('Error fetching investor details', error);
      }
    };

    fetchInvestor();
  }, [id]);

  if (!investor) {
    return <div>Loading...</div>;
  }
  const passportPhotoSrc = `data:${investor.passportPhoto.contentType};base64,${Buffer.from(investor.passportPhoto.data).toString('base64')}`;

  return (
    <Box p={3}>
      <Paper elevation={8} style={{ padding: '15px' }}>
        <Typography variant="h6" gutterBottom>
          {t('investorDetails')}
        </Typography>
        <Avatar 
          alt={investor.fullname}
          src={passportPhotoSrc}
          sx={{ width: 100, height: 100, marginBottom: 2 }}
        />
        <Typography variant="body1">
          {t('fullname')}: {investor.fullname_en}
        </Typography>
        <Typography variant="body1">
          {t('email')}: {investor.email}
        </Typography>
        <Typography variant="body1">
          {t('phoneNumber')}: {investor.phoneNumber}
        </Typography>
        <Typography variant="body1">
          {t('dateOfBirth')}: {new Date(investor.dateOfBirth).toLocaleDateString()}
        </Typography>
        <Typography variant="body1">
          {t('passportNumber')}: {investor.passportNumber}
        </Typography>
        <Typography variant="body1">
          {t('passportExpiryDate')}: {new Date(investor.passportExpiryDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body1">
          {t('status')}: {investor.status}
        </Typography>
     
   
      </Paper>
    </Box>
  );
};

export default InvestorDetails;
