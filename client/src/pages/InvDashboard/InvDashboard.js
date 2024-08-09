// components/InvestorDashboard.js
import React, { useState, useEffect, Suspense } from 'react';
import api from '../../api/axios';
import { Grid, Paper, Typography, Box, Card, CardContent, Skeleton } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, LineController, LineElement, PointElement, Tooltip, Legend, Title } from 'chart.js';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

Chart.register(CategoryScale, LinearScale, LineController, LineElement, PointElement, Tooltip, Legend, Title);

const InvestorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const { t } = useTranslation();
  const investorId = localStorage.getItem('id');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(`/invdash/investordashboard/${investorId}`);
                console.log('API Response:', response.data);  
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching investment stats:', error);
      }
    };

    fetchStats();
  }, []);
  const getTotalInvestedChartData = () => {
    if (!stats) return { labels: [], datasets: [] };

    const months = stats.totalInvestedPerMonth.map(data => `${data._id.month}/${data._id.year}`);
    const amounts = stats.totalInvestedPerMonth.map(data => data.total);

    return {
      labels: months,
      datasets: [
        {
          label: t('totalInvestedPerMonth'),
          data: amounts,
          borderColor: '#d25716',
          backgroundColor: '#d2571633',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const totalInvestedChartData = getTotalInvestedChartData();

  return (
    <Suspense fallback={<Skeleton variant="rectangular" height="100vh" />}>
      <Box sx={{ p: 3 }} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3, backgroundColor: '#ffffff', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoneyIcon sx={{ mr: 1, color: '#d25716' }} />
                  {t('totalAmountInvested')}
                </Typography>
                {loading ? (
                  <Skeleton variant="text" width={80} />
                ) : (
                  <Typography variant="h4">${stats?.totalAmount}</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3, backgroundColor: '#ffffff', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ mr: 1, color: '#d25716' }} />
                  {t('activeInvestments')}
                </Typography>
                {loading ? (
                  <Skeleton variant="text" width={60} />
                ) : (
                  <Typography variant="h4">{stats?.activeInvestments}</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('totalInvestedPerMonth')}
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={400} />
              ) : (
                <Box sx={{ mt: 2, height: '100%' }}>
                  <Line data={totalInvestedChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Suspense>
  );
};

export default InvestorDashboard;
