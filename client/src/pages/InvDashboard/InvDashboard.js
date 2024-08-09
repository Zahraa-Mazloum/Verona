import React, { useState, useEffect, Suspense } from 'react';
import api from '../../api/axios';
import { Grid, Paper, Typography, Box, Card, CardContent, Skeleton } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, LineController, LineElement, PointElement, Tooltip, Legend, Title, ArcElement } from 'chart.js';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

Chart.register(CategoryScale, LinearScale, LineController, LineElement, PointElement, Tooltip, Legend, Title, ArcElement);

const InvestorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const { t } = useTranslation();
  const investorId = localStorage.getItem('id');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(`/invdash/investordashboard/${investorId}`);
        console.log('API Response:', response);
        if (!response.data || Object.keys(response.data).length === 0) {
          console.log('No data returned:', response.data);
        } else {
          console.log('Data returned:', response.data); 
          setStats(response.data);
        }
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

  const getInvestmentTypesChartData = () => {
    if (!stats) return { labels: [], datasets: [] };

    return {
      labels: stats.investmentsPerType.map(type => t(type.title)),
      datasets: [
        {
          data: stats.investmentsPerType.map(type => type.totalAmount),
          backgroundColor: ['#d25716', '#ed7622', '#f19446', '#fad7ae', '#76c7c0', '#4caf50', '#ff9800', '#9c27b0'],
          hoverBackgroundColor: ['#c44c13', '#db6720', '#e38541', '#eac39a', '#69b1a9', '#3e8b3d', '#e68900', '#83219f'],
        },
      ],
    };
  };

  const totalInvestedChartData = getTotalInvestedChartData();
  const investmentTypesChartData = getInvestmentTypesChartData();

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
                  <Typography variant="h4">${stats.totalAmount || 0}</Typography>
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
                  <Typography variant="h4">{stats.activeInvestments}</Typography>
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
          <Grid item xs={12} md={612}>
            <Paper sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('VeronainvestmentTotalPerType')}
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={400} />
              ) : (
                <Box sx={{ mt: 2, height: '360px' }}>
                  <Doughnut data={investmentTypesChartData} options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                      },
                      tooltip: {
                        callbacks: {
                          label: function (tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw}`;
                          },
                        },
                      },
                    },
                  }} />
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
