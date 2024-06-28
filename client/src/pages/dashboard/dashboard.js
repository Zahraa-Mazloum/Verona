import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, Skeleton } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, Tooltip } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarController, BarElement, Tooltip);

const Dashboard = () => {
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust delay as needed
    return () => clearTimeout(timer);
  }, []);

  const chartData = {
    labels: ['Technological', 'Industrial', 'Real Estate', 'Zoho', 'Cryptocurrency'],
    datasets: [
      {
        label: 'Investment Types',
        data: [12000, 15000, 8000, 5000, 3000],
        backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { type: 'category' },
      y: { type: 'linear' },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.formattedValue}`;
          },
        },
      },
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, backgroundColor: '#f3f3f3' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon sx={{ mr: 1, color: '#1976d2' }} />
                Total Investors
              </Typography>
              {loading ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="h4">150</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, backgroundColor: '#f3f3f3' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoneyIcon sx={{ mr: 1, color: '#1976d2' }} />
                Total Amount of Investments
              </Typography>
              {loading ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="h4">$500,000</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, backgroundColor: '#f3f3f3' }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1, color: '#1976d2' }} />
                Active Investments
              </Typography>
              {loading ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="h4">120</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, boxShadow: 3, height: 500 }}>
            <Typography variant="h6" gutterBottom>
              Investment Chart
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={400} />
            ) : (
              <Box sx={{ mt: 2, height: '100%' }}>
                <Bar data={chartData} options={chartOptions} />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
