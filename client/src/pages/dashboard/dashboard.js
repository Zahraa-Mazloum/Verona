import React, { useState, useEffect, Suspense } from 'react';
import api from '../../api/axios';
import { Grid, Paper, Typography, Box, Card, CardContent, Skeleton, Avatar } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, LineController, LineElement, PointElement, Tooltip, Legend, Title, ArcElement } from 'chart.js';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import './dashboard.css';

Chart.register(CategoryScale, LinearScale, BarController, BarElement, LineController, LineElement, PointElement, Tooltip, Legend, Title, ArcElement);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dash/dashboard');
        console.log('API Response:', response.data);  
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching investment stats:', error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (stats) {
      console.log('Stats updated:', stats); 
    }
  }, [stats]);

  const totalInvestedChartData = {
    labels: stats ? stats.totalInvestedPerMonth.map(month => `${month._id.month}/${month._id.year}`) : [],
    datasets: [
      {
        label: t('totalInvested'),
        data: stats ? stats.totalInvestedPerMonth.map(month => month.total) : [],
        borderColor: '#d25716',
        backgroundColor: 'rgba(210, 87, 22, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const investmentTypesChartData = {
    labels: stats ? stats.investmentsPerType.map(type => t(type.title)) : [],
    datasets: [
      {
        data: stats ? stats.investmentsPerType.map(type => type.totalAmount) : [],
        backgroundColor: ['#d25716', '#ed7622', '#f19446', '#fad7ae'],
      },
    ],
  };

  const topInvestors = stats?.topInvestors?.map(investor => ({
    name: investor.name,
    namear: investor.namear,
    amount: investor.totalAmount.toFixed(2),
    profit: investor.profit.toFixed(2),
  })) || [];

  return (
    <Suspense fallback={<Skeleton variant="rectangular" height="100vh" />}>
      <Box sx={{ p: 3 }} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: 3, backgroundColor: '#ffffff', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon sx={{ mr: 1, color: '#d25716' }} />
                  {t('totalInvestors')}
                </Typography>
                {loading ? (
                  <Skeleton variant="text" width={60} />
                ) : (
                  <Typography variant="h4">{stats?.totalInvestors}</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: 3, backgroundColor: '#ffffff', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoneyIcon sx={{ mr: 1, color: '#d25716' }} />
                  {t('totalAmountInvestments')}
                </Typography>
                {loading ? (
                  <Skeleton variant="text" width={80} />
                ) : (
                  <Typography variant="h4">${stats?.totalAmount}</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('topInvestors')}
              </Typography>
              {loading ? (
                [0, 1, 2].map((index) => (
                  <Grid item xs={12} key={index}>
                    <Skeleton variant="rectangular" height={100} />
                  </Grid>
                ))
              ) : (
                topInvestors.length > 0 && (
                  <Grid container spacing={2}>
                    {topInvestors.map((investor, index) => (
                      <Grid item xs={12} key={index}>
                        <Card sx={{ boxShadow: 2, backgroundColor: '#ffffff', borderRadius: 2 }}>
                          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, bgcolor: '#d25716' }}>
                            {i18n.language === 'ar' ? investor.namear.charAt(0) : investor.name.charAt(0)}
                            </Avatar>
                            <Box>
                            <Typography variant="h6">
                              {i18n.language === 'ar' ? investor.namear : investor.name}
                              </Typography>      
                            <Typography variant="body2"> 
                                 <span style={{ fontSize: 12, color: 'gray' }}>{t('TotalAmount')}
                              </span>
                              {investor.amount}</Typography>
                              <Typography variant="body2"> <span style={{ fontSize: 12, color: 'gray' }}>{t('Profit')}
                              </span>{investor.profit}</Typography>                             
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('investmentTotalPerType')}
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={500} />
              ) : (
                <Box sx={{ mt: 2, height: '360px' }}>
                  <Doughnut data={investmentTypesChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Suspense>
  );
};

export default Dashboard;
