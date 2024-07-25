import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Grid, Paper, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loader from '../../components/loading.js';
import { useTranslation } from 'react-i18next';

Chart.register(...registerables);

const InvestorDashboard = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState([]);
  const [maturedContracts, setMaturedContracts] = useState([]);
  const [recentContracts, setRecentContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const invId = localStorage.getItem('id')

  const fetchStats = async () => {
    try {
      const { data } = await api.get(`/invDash/contractStats/${invId}`);
      setStats(data);
    } catch (error) {
      toast.error(t('ErrorFetchingStats'));
    }
  };

  const fetchMaturedContracts = async () => {
    try {
      const { data } = await api.get(`/invDash/maturedContracts/${invId}`);
      setMaturedContracts(data);
    } catch (error) {
      toast.error(t('ErrorFetchingMaturedContracts'));
    }
  };

  const fetchRecentContracts = async () => {
    try {
      const { data } = await api.get(`/contract/investorContracts/${invId}?limit=3`);
      setRecentContracts(data);
    } catch (error) {
      toast.error(t('ErrorFetchingRecentContracts'));
    }
  };

  useEffect(() => {
    fetchStats();
    fetchMaturedContracts();
    fetchRecentContracts();
    setLoading(false);
  }, [i18n.language]);

  const data = {
    labels: stats.map(stat => `Month ${stat._id}`),
    datasets: [
      {
        label: t('TotalInvest'),
        data: stats.map(stat => stat.totalAmount),
        fill: false,
        backgroundColor: '#f19446',
        borderColor: '#f19446',
      },
    ],
  };

  return (
    <Suspense fallback={<img src={loader} alt="Loading..." />}>
      <Box p={3}>
        <ToastContainer />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">{t('RecentContracts')}</Typography>
                {recentContracts.slice(0, 3).map(contract => (
                  <Paper key={contract._id} style={{ padding: '10px', marginBottom: '10px' }}>
                    <Typography>{`${t('Amount')}: ${contract.amount}`}</Typography>
                    <Typography>{`${t('Currency')}: ${contract.currency.symbol}`}</Typography>
                    <Typography>{`${t('StartDate')}: ${new Date(contract.startDate).toLocaleDateString()}`}</Typography>
                  </Paper>
                ))}
                <Button variant="contained" color="warning" onClick={() => navigate(`/investorContracts/${invId}`)}>
                  {t('ViewAllContracts')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">{t('MaturedInvestments')}</Typography>
                {maturedContracts.slice(0, 3).map(contract => (
                  <Paper key={contract._id} style={{ padding: '10px', marginBottom: '10px' }}>
                    <Typography>{`${t('Amount')}: ${contract.amount}`}</Typography>
                    <Typography>{`${t('Currency')}: ${contract.currency.symbol}`}</Typography>
                    <Typography>{`${t('EndDate')}: ${new Date(contract.endDate).toLocaleDateString()}`}</Typography>
                  </Paper>
                ))}
                <Button variant="contained" color="warning" onClick={() => navigate(`/myInvestments/${invId}`)}>
                  {t('ViewAllInvestments')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">{t('InvestorStats')}</Typography>
                <Box sx={{ width: '100%', height: '400px' }}>
                  <Line data={data} options={{ maintainAspectRatio: false }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Suspense>
  );
};

export default InvestorDashboard;
