import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, Skeleton, Avatar } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Line, Doughnut, Bar } from 'react-chartjs-2'; // Add Bar to your imports
import { Chart, CategoryScale, LinearScale, BarController, BarElement, LineController, LineElement, PointElement, Tooltip, Legend, Title, ArcElement } from 'chart.js';
import './dashboard.css';

Chart.register(CategoryScale, LinearScale, BarController, BarElement, LineController, LineElement, PointElement, Tooltip, Legend, Title, ArcElement);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const totalInvestedChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Total Invested',
        data: [10000, 20000, 15000, 25000, 22000, 30000, 35000],
        borderColor: '#d25716',
        backgroundColor: 'rgba(210, 87, 22, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const investmentTypesChartData = {
    labels: ['ETFs', 'Stocks', 'Bonds', 'Crypto'],
    datasets: [
      {
        data: [4140.17, 2587.60, 2070.09, 1552.56],
        backgroundColor: ['#d25716', '#ed7622', '#f19446', '#fad7ae'],
      },
    ],
  };

  const totalInvestmentPerMonthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Investment Per Month',
        data: [120, 130, 115, 145, 160, 150],
        backgroundColor: '#ed7622',
      },
    ],
  };

  const topInvestors = [
    { name: 'Investor 1', amount: '$8,700.76', increase: '+9.72%' },
    { name: 'Investor 2', amount: '$4,628.27', increase: '+5.34%' },
    { name: 'Investor 3', amount: '$1,577.22', increase: '+4.23%' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, backgroundColor: '#ffffff', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ mr: 1, color: '#d25716' }} />
                Total Investors
              </Typography>
              {loading ? (
                <Skeleton variant="text" width={60} />
              ) : (
                <Typography variant="h4">150</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, backgroundColor: '#ffffff', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoneyIcon sx={{ mr: 1, color: '#d25716' }} />
                Total Amount of Investments
              </Typography>
              {loading ? (
                <Skeleton variant="text" width={80} />
              ) : (
                <Typography variant="h4">$500,000</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, backgroundColor: '#ffffff', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ mr: 1, color: '#d25716' }} />
                Active Investments
              </Typography>
              {loading ? (
                <Skeleton variant="text" width={60} />
              ) : (
                <Typography variant="h4">120</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Total Invested Per Month
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
              Top Investors
            </Typography>
            <Grid container spacing={2}>
              {loading
                ? [0, 1, 2].map((index) => (
                    <Grid item xs={12} key={index}>
                      <Skeleton variant="rectangular" height={100} />
                    </Grid>
                  ))
                : topInvestors.map((investor, index) => (
                    <Grid item xs={12} key={index}>
                      <Card sx={{ boxShadow: 2, backgroundColor: '#ffffff', borderRadius: 2 }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: '#d25716' }}>{investor.name.charAt(0)}</Avatar>
                          <Box>
                            <Typography variant="h6">{investor.name}</Typography>
                            <Typography variant="body2">{investor.amount}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {investor.increase}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, boxShadow: 3, borderRadius: 2}}>
            <Typography variant="h6" gutterBottom>
              Investment Total Per Type
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
  );
};

export default Dashboard;
