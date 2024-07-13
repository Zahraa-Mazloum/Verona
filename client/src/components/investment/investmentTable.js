import React, { useState, useEffect,Suspense } from 'react';
import api from '../../api/axios';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {
  Button,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  Toolbar,
  Typography,
  Box,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useNavigate } from 'react-router-dom'; 
import Loading from '../loading.js';
import loader from '../loading.gif'
import { useTranslation } from 'react-i18next';


const InvestmentTable = () => {
  const { t, i18n } = useTranslation();
  const [investments, setinvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [investmentToDelete, setinvestmentToDelete] = useState(null); 
  const navigate = useNavigate();

  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: 'rgba(255, 242, 215, 0.5)',
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
  }));

  const fetchinvestments = async () => {
    try {
      const { data } = await api.get(`/inv/getInvestments/${i18n.language}`);
      console.log(data)
      console.log(data.s)
      setinvestments(data);
    } catch (error) {
      toast.error('Error fetching investments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchinvestments();
  }, [i18n.language]);

  const handleDeleteinvestment = async (id) => {
    try {
      await api.delete(`/inv/deleteInvestment/${id}`);
      setinvestments(investments.filter(c => c._id !== id));
      toast.success(t('investmentDeletedSuccessfully'));
    } catch (error) {
      toast.error('Error deleting investment');
    }
  };

  const handleOpenConfirmDelete = (event, investment) => {
    setinvestmentToDelete(investment);
  };

  const handleCloseConfirmDelete = () => {
    setinvestmentToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (investmentToDelete) {
      handleDeleteinvestment(investmentToDelete._id);
      handleCloseConfirmDelete();
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const safeLowerCase = (str) => (str ? str.toLowerCase() : '');

  const filteredinvestments = investments.filter(investment =>
    safeLowerCase(i18n.language === 'en' ? investment.titleInv : investment.titleInv_ar).includes(safeLowerCase(search)) ||
    safeLowerCase(i18n.language === 'en' ? investment.amount : investment.amount).includes(safeLowerCase(search)) ||
    safeLowerCase(i18n.language === 'en' ? investment.type.type_en : investment.type.type_ar).includes(safeLowerCase(search)) || 
    safeLowerCase(i18n.language === 'en' ? investment.profit : investment.profit).includes(safeLowerCase(search)) ||
    safeLowerCase(i18n.language === 'en' ? investment.contract.title : investment.contract.title_ar).includes(safeLowerCase(search)) ||
    safeLowerCase(i18n.language === 'en' ? investment.contract.investorInfo.fullname_en : investment.contract.investorInfo.fullname_ar).includes(safeLowerCase(search)) ||
    safeLowerCase(i18n.language === 'en' ? investment.contract.currency.symbol : investment.contract.currency.symbol).includes(safeLowerCase(search)) ||
    safeLowerCase(i18n.language === 'en' ? investment.investmentStatus : investment.investmentStatus).includes(safeLowerCase(search)) ||
    safeLowerCase(i18n.language === 'en' ? investment.payment : investment.payment).includes(safeLowerCase(search)) 
  );

  const columns = [
    {
      field: i18n.language === 'ar' ? 'contract.investorInfo' : 'contract.investorInfo',
      headerName: t('InvestorName'),
      flex: 1,
      renderCell: (params) => (
        <span>
          {i18n.language === 'ar' ? params.row.contract.investorInfo.fullname_ar : params.row.contract.investorInfo.fullname_en}
        </span>
      ),
    },  
    {
      field: i18n.language === 'ar' ? 'titleInv_ar' : 'titleInv',
      headerName: t('title'),
      flex: 1
    },
    {
      field: i18n.language === 'ar' ? 'amount' : 'amount',
      headerName: t('amount'),
      flex: 1
    },
    {
      field: i18n.language === 'ar' ? 'type' : 'type',
      headerName: t('type'),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.row.type ? (i18n.language === 'ar' ? params.row.type.type_ar : params.row.type.type_en) : ''}
        </span> 
),
    },    {
      field: i18n.language === 'ar' ? 'profit' : 'profit',
      headerName: t('profit'),
      flex: 1
    },
  {
      field: i18n.language === 'ar' ? 'contract' : 'contract',
      headerName: t('contract'),
      flex: 1,
      renderCell: (params) => (
        <span>
          {i18n.language === 'ar' ? params.row.contract.title_ar : params.row.contract.title}
        </span>
      ),
    },    {
      field: i18n.language === 'ar' ? 'currency.symbol_ar' : 'currency.symbol',
      headerName: t('currency'),
      flex: 1,
      renderCell: (params) => (
        <span>
          {i18n.language === 'ar' ? params.row.contract.currency.symbol_ar : params.row.contract.currency.symbol}
        </span>
      ),
    },  
    
    
    {
      field: i18n.language === 'ar' ? 'investmentStatus' : 'investmentStatus',
      headerName: t('investmentStatus'),
      flex: 1
    },  {
      field: i18n.language === 'ar' ? 'payment' : 'payment',
      headerName: t('payment'),
      flex: 1
    },
    {
      field: 'actions',
      headerName: t('actions'),
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" justifyContent="left">
          <IconButton
            sx={{ color: '#4CAF50', fontSize: 28 }}
            onClick={() => navigate(`/editinvestment/${params.row._id}`)}
          >
            <EditNoteIcon />
          </IconButton>
          <Tooltip
            title={
              <Box>
                <Typography sx={{ textAlign: 'center' }}>{t('areYouSure')}</Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleConfirmDelete}
                  size="small"
                >
                  {t('yes')}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCloseConfirmDelete}
                  size="small"
                  style={{ marginLeft: 8 }}
                >
                  {t('no')}
                </Button>
              </Box>
            }
            open={Boolean(investmentToDelete === params.row)}
            onClose={handleCloseConfirmDelete}
            placement="right"
            arrow
          >
            <IconButton
              sx={{ color: '#FF5722', fontSize: 28 }}
              onClick={(event) => handleOpenConfirmDelete(event, params.row)}
            >
              <DeleteSweepIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
    <Box p={3}>
      <ToastContainer />
      <Paper elevation={8} style={{ padding: '15px', marginBottom: '10px' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('investmentManagement')}
          </Typography>
          <TextField
            variant="standard"
            placeholder={t('search')}
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            sx={{
              ml: 2,
              bgcolor: 'darkorange',
              '&:hover': {
                bgcolor: 'orange',
              },
            }}
            startIcon={<AddIcon />}
            onClick={() => navigate('/addinvestment')}
          >
            {t('addinvestment')}
          </Button>
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
              rows={filteredinvestments}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              autoHeight
              getRowId={(row) => row._id}
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
              }
              direction={i18n.language === 'ar'? 'rtl' : 'ltr'} 
                          />
          )}
        </div>
      </Paper>
    </Box>
    </Suspense>
  );
};

export default InvestmentTable;
