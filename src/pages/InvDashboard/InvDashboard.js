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

  const getTotalInvestedChartData = () => {
    if (!stats) return { labels: [], datasets: [] };

    const months = Array.from(new Set(stats.totalInvestedPerMonth.map(data => `${data._id.month}/${data._id.year}`)));
    const currencyMap = {};

    const colors = [
      '#d25716', '#ed7622', '#f19446', '#fad7ae', 
      '#76c7c0', '#4caf50', '#ff9800', '#9c27b0',
    ]; // Add more colors if needed

    stats.totalInvestedPerMonth.forEach(data => {
      if (!currencyMap[data._id.currency]) {
        currencyMap[data._id.currency] = new Array(months.length).fill(0);
      }
      const index = months.indexOf(`${data._id.month}/${data._id.year}`);
      currencyMap[data._id.currency][index] = data.total;
    });

    return {
      labels: months,
      datasets: Object.keys(currencyMap).map((currency, index) => ({
        label: `${t('totalInvested')} (${currency})`,
        data: currencyMap[currency],
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '33',
        fill: true,
        tension: 0.4,
      }))
    };
  };

  const investmentTypesChartData = {
    labels: stats ? stats.investmentsPerType.map(type => t(type.title)) : [],
    datasets: [
      {
        data: stats ? stats.investmentsPerType.map(type => type.totalAmount) : [],
        backgroundColor: ['#d25716', '#ed7622', '#f19446', '#fad7ae', '#76c7c0', '#4caf50', '#ff9800', '#9c27b0'],
        hoverBackgroundColor: ['#c44c13', '#db6720', '#e38541', '#eac39a', '#69b1a9', '#3e8b3d', '#e68900', '#83219f'],
      },
    ],
  };

  const topInvestors = stats?.topInvestors?.map(investor => ({
    name: investor.name,
    namear: investor.namear,
    currency: investor.currency,
    amount: investor.totalAmount.toFixed(2),
    profit: investor.profit.toFixed(2),
  })) || [];
  console.log(topInvestors);

  const totalInvestedChartData = getTotalInvestedChartData();

  return (
    <Suspense fallback={<Skeleton variant="rectangular" height="100vh" />}>
      <Box sx={{ p: 3 }} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <Grid container spacing={3}>
        
         <Typography>Inv DashBoard</Typography>
       
        </Grid>
      </Box>
    </Suspense>
  );
};

export default Dashboard;
