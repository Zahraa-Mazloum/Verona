import React, { useState, useEffect,Suspense } from 'react';
import api from '../api/axios';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {
  Paper,
  Toolbar,
  Typography,
  Box,
  TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import loader from '../components/loading.gif';
import { useTranslation } from 'react-i18next';

const OverallInvestmentTable = () => {
  const { t, i18n } = useTranslation();
  const [investmentsPerType, setInvestmentsPerType] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: 'rgba(255, 242, 215, 0.5)',
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
  }));

  useEffect(() => {
    fetchInvestmentsPerType();
  }, [i18n.language]);

  const fetchInvestmentsPerType = async () => {
    try {
      const { data } = await api.get(`/inv/investmentsPerType/${i18n.language}`);
      setInvestmentsPerType(data); 
    } catch (error) {
      console.error('Error fetching investments per type', error);
    } finally {
      setLoading(false);
    }
  };

  const safeLowerCase = (str) => (str ? str.toLowerCase() : '');

  const filteredInvestmentsPerType = investmentsPerType.filter(investment =>
    safeLowerCase(i18n.language === 'en' ? investment.title : investment.title_ar).includes(safeLowerCase(search))
  );

  const columns = [
    {
      field: i18n.language === 'ar' ? 'title_ar' : 'title',
      headerName: t('type'),
      flex: 1,
    },
    {
      field: 'totalAmount',
      headerName: t('totalAmount'),
      flex: 1,
    },
  ];

  return (
    <Box p={3}>
      <Paper elevation={8} style={{ padding: '15px', marginBottom: '10px' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('investmentsPerType')}
          </Typography>
          <TextField
            label={t('search')}
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginLeft: 'auto' }}
          />
        </Toolbar>
        <div style={{ width: '100%', height: '100%' }}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="100%"
            >
              <img src={loader} alt="Loading..." />
            </Box>
          ) : (
            <StripedDataGrid
              rows={filteredInvestmentsPerType}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              autoHeight
              getRowId={(row) => row._id}
              getRowClassName={(params) =>
                params.index % 2 === 0 ? 'even' : 'odd'
              }
            />
          )}
        </div>
      </Paper>
    </Box>
  );
};

export default OverallInvestmentTable;
