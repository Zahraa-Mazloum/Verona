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
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import loader from '../loading.gif';
import { useTranslation } from 'react-i18next';

const InvestorsTable = () => {
  const { t, i18n } = useTranslation();
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [InvestorsToDelete, setInvestorsToDelete] = useState(null); 
  const navigate = useNavigate(); 

  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: 'rgba(255, 242, 215, 0.5)',
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
  }));

  const fetchInvestors = async () => {
    try {
      const { data } = await api.get(`/admin/allInvestors/${i18n.language}`);
      setInvestors(data);
    } catch (error) {
      toast.error('Error fetching Investors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestors();
  }, [i18n.language]);

  const handleDeleteInvestor = async (id) => {
    try {
      await api.delete(`/admin/deleteUser/${id}`);
      setInvestors(investors.filter(c => c._id !== id));
      toast.success(t('Investor Deleted Successfully'));
    } catch (error) {
      toast.error('Error deleting Investor');
    }
  };

  const handleOpenConfirmDelete = (event, investor) => {
    setInvestorsToDelete(investor);
  };

  const handleCloseConfirmDelete = () => {
    setInvestorsToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (InvestorsToDelete) {
      handleDeleteInvestor(InvestorsToDelete._id);
      handleCloseConfirmDelete();
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const safeLowerCase = (str) => (str ? str.toLowerCase() : '');

  const filteredInvestors = investors.filter(investor =>
    safeLowerCase(i18n.language === 'en' ? investor.fullname_en : investor.fullname_ar).includes(safeLowerCase(search)) ||
    safeLowerCase(i18n.language === 'en' ? investor.email : investor.email).includes(safeLowerCase(search)) ||
    safeLowerCase(i18n.language === 'en' ? investor.phoneNumber : investor.phoneNumber).includes(safeLowerCase(search)) ||
    safeLowerCase(i18n.language === 'en' ? investor.dateOfBirth : investor.dateOfBirth).includes(safeLowerCase(search)) ||
    safeLowerCase(i18n.language === 'en' ? investor.status : investor.status).includes(safeLowerCase(search)) ||
    safeLowerCase(i18n.language === 'en' ? investor.passportExpiryDate : investor.passportExpiryDate).includes(safeLowerCase(search)) 
  );

  const columns = [
    {
      field: i18n.language === 'ar' ? 'fullname_ar' : 'fullname_en',
      headerName: t('fullname'),
      flex: 1,
    },
    {
      field: i18n.language === 'ar' ? 'email' : 'email',
      headerName: t('email'),
      flex: 1,
    },
    {
      field: i18n.language === 'ar' ? 'phoneNumber' : 'phoneNumber',
      headerName: t('phoneNumber'),
      flex: 1,
    },
    {
      field: i18n.language === 'ar' ? 'dateOfBirth' : 'dateOfBirth',
      headerName: t('dateOfBirth'),
      flex: 1,
      renderCell: (params) => (
        <span>
          {new Date(params.row.dateOfBirth).toLocaleDateString()}
        </span>
      ),
    },
    {
      field: i18n.language === 'ar' ? 'passportNumber' : 'passportNumber',
      headerName: t('passportNumber'),
      flex: 1,
    },
    {
      field: i18n.language === 'ar' ? 'passportExpiryDate' : 'passportExpiryDate',
      headerName: t('passportExpiryDate'),
      flex: 1,
      renderCell: (params) => (
        <span>
          {new Date(params.row.passportExpiryDate).toLocaleDateString()}
        </span>
      ),    },
    {
      field: 'status',
      headerName: t('status'),
      flex: 1,
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
            onClick={() => navigate(`/updateUser/${params.row._id}`)}
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
            open={Boolean(InvestorsToDelete === params.row)}
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
          <IconButton
            sx={{ color: '#2196F3', fontSize: 28 }}
            onClick={() => navigate(`/viewInvestor/${params.row._id}`)}
          >
            <VisibilityIcon />
          </IconButton>
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
            {t('investorManagement')}
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
            onClick={() => navigate('/addinvestor')}
          >
            {t('addinvestor')}
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
              rows={filteredInvestors}
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

export default InvestorsTable;
