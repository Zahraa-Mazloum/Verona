import React, { useState, useEffect,Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Box, Typography, Paper, Avatar, Grid, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import { Buffer } from 'buffer';
import Loading from '../loading.js'; 
import loader from '../loading.gif';

const InvestorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [investor, setInvestor] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [loadingInvestor, setLoadingInvestor] = useState(true);
  const [loadingContracts, setLoadingContracts] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchInvestor = async () => {
      try {
        const { data } = await api.get(`/admin/userProfile/${id}`);
        setInvestor(data);
      } catch (error) {
        console.error('Error fetching investor details', error);
      } finally {
        setLoadingInvestor(false);
      }
    };

    const fetchContracts = async () => {
      try {
        const { data } = await api.get(`/contract/investorContracts/${id}`);
        setContracts(data);
      } catch (error) {
        console.error('Error fetching contracts', error);
      } finally {
        setLoadingContracts(false);
      }
    };

    fetchInvestor();
    fetchContracts();
  }, [id]);


  if (loadingInvestor || loadingContracts) {
    return <img src={loader} alt="Loading..." style={{ display: 'block', margin: 'auto' }} />;
  }

  if (!investor) {
    return <div>{t('noInvestorDetails')}</div>;
  }

  const passportPhotoSrc = `data:${investor.passportPhoto.contentType};base64,${Buffer.from(investor.passportPhoto.data).toString('base64')}`;

  return (
    <Suspense fallback={<Loading />}>
    <Box p={3}>
      <Paper elevation={8} style={{ padding: '15px' }}>
        <IconButton   onClick={() => navigate('/investor')} style={{ marginBottom: '10px' }}>
          <ArrowBackIcon /> 
        </IconButton>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              {t('investorDetails')}
            </Typography>
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
            </Typography>          </Grid>
          <Grid item xs={12} md={4} container justifyContent="center" alignItems="center">
            <Avatar
              alt={investor.fullname}
              src={passportPhotoSrc}
              sx={{ width: 300, height: 100, aspectRatio: '1/1', marginBottom: 2 }}
            />
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            {t('contractDetails')}
          </Typography>
          {contracts.length > 0 ? (
            contracts.map(contract => (
              <Paper key={contract._id} elevation={2} style={{ padding: '10px', marginBottom: '10px' }}>
           <Typography variant="body1">
                  {t('title')}: {contract.title}
                </Typography>
                <Typography variant="body1">
                  {t('currency')}: {contract.currency.name}
                </Typography>
                <Typography variant="body1">
                  {t('contractTime')}: {contract.contractTime}
                </Typography>
                <Typography variant="body1">
                  {t('startDate')}: {new Date(contract.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">
                  {t('investmentStatus')}: {contract.investmentStatus}
                </Typography>              </Paper>
            ))
          ) : (
            <Typography variant="body1">{t('noContractsYet')}</Typography>
          )}
        </Box>
      </Paper>
    </Box>
    </Suspense>
  );
};

export default InvestorDetails;
