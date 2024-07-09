import React, { useState, useEffect } from 'react';
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
import loader from '../loading.gif';
import { useTranslation } from 'react-i18next';


const CurrencyTable = () => {
  const { t, i18n } = useTranslation();
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currencyToDelete, setCurrencyToDelete] = useState(null); 
  const navigate = useNavigate();

  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: 'rgba(255, 242, 215, 0.5)',
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
  }));

  const fetchCurrencies = async () => {
    try {
      // console.log(`Fetching currencies for language: ${i18n.language}`); 
      const { data } = await api.get(`/currency/getCurrencies/${i18n.language}`);
      // console.log(data);
      setCurrencies(data);
    } catch (error) {
      toast.error('Error fetching currencies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, [i18n.language]);

  const handleDeleteCurrency = async (id) => {
    try {
      await api.delete(`/currency/deleteCurrency/${id}`);
      setCurrencies(currencies.filter(c => c._id !== id));
      toast.success(t('currencyDeletedSuccessfully'));
    } catch (error) {
      toast.error('Error deleting currency');
    }
  };

  const handleOpenConfirmDelete = (event, currency) => {
    setCurrencyToDelete(currency);
  };

  const handleCloseConfirmDelete = () => {
    setCurrencyToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (currencyToDelete) {
      handleDeleteCurrency(currencyToDelete._id);
      handleCloseConfirmDelete();
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const safeLowerCase = (str) => (str ? str.toLowerCase() : '');

  const filteredCurrencies = currencies.filter(currency =>
    safeLowerCase(i18n.language === 'en' ? currency.name : currency.name_ar).includes(safeLowerCase(search)) ||
    safeLowerCase(i18n.language === 'en' ? currency.symbol : currency.symbol_ar).includes(safeLowerCase(search)) ||
    safeLowerCase(i18n.language === 'en' ? currency.description : currency.description_ar).includes(safeLowerCase(search))
  );

  const columns = [
    {
      field: i18n.language === 'ar' ? 'name_ar' : 'name',
      headerName: t('name'),
      flex: 1
    },
    {
      field: i18n.language === 'ar' ? 'symbol_ar' : 'symbol',
      headerName: t('symbol'),
      flex: 1
    },
    {
      field: i18n.language === 'ar' ? 'description_ar' : 'description',
      headerName: t('description'),
      flex: 2
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
            onClick={() => navigate(`/editCurrency/${params.row._id}`)}
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
            open={Boolean(currencyToDelete === params.row)}
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
    <Box p={3}>
      <ToastContainer />
      <Paper elevation={8} style={{ padding: '15px', marginBottom: '10px' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('currencyManagement')}
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
            onClick={() => navigate('/addCurrency')}
          >
            {t('addCurrency')}
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
              rows={filteredCurrencies}
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
  );
};

export default CurrencyTable;
