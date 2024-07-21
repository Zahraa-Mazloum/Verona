import React, { useState, useEffect, Suspense } from 'react';
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
  Tooltip,
  Switch
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
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [investmentToDelete, setInvestmentToDelete] = useState(null); 
  const navigate = useNavigate();

  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: 'rgba(255, 242, 215, 0.5)',
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
  }));

  const fetchInvestments = async () => {
    try {
      const { data } = await api.get(`/inv/getInvestments/${i18n.language}`);
      setInvestments(data);
    } catch (error) {
      toast.error(t('ErrorFetchingInvestments'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchInvestments();
  }, [i18n.language]);

  const handleDeleteInvestment = async (id) => {
    try {
      await api.delete(`/inv/deleteInvestment/${id}`);
      setInvestments(investments.filter(c => c._id !== id));
      toast.success(t('InvestmentDeletedSuccessfully'));
    } catch (error) {
      toast.error(t('ErrorDeletingInvestment'));
    }
  };

  const handleOpenConfirmDelete = (event, investment) => {
    setInvestmentToDelete(investment);
  };

  const handleCloseConfirmDelete = () => {
    setInvestmentToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (investmentToDelete) {

      handleDeleteInvestment(investmentToDelete._id);
      handleCloseConfirmDelete();
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };


  const userRole = localStorage.getItem('role');

  const safeLowerCase = (str) => (str ? str.toLowerCase() : '');

  const filteredInvestments = investments.filter(investment =>
    safeLowerCase(i18n.language === 'en' ? investment.titleInv : investment.titleInv_ar).includes(safeLowerCase(search)) ||
    safeLowerCase(i18n.language === 'en' ? investment.amount : investment.amount).includes(safeLowerCase(search)) ||
    safeLowerCase(i18n.language === 'en' ? investment.type.type_en : investment.type.type_ar).includes(safeLowerCase(search)) || 
    safeLowerCase(i18n.language === 'en' ? investment.currency.symbol : investment.currency.symbol).includes(safeLowerCase(search)) ||
    safeLowerCase(i18n.language === 'en' ? investment.investmentStatus : investment.investmentStatus).includes(safeLowerCase(search)) ||

    safeLowerCase(i18n.language === 'en' ? investment.date : investment.date).includes(safeLowerCase(search))
  );

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus; 
      await api.put(`/inv/updateInvStatus/${id}`, { investmentStatus: newStatus });
      setInvestments(investments.map(c => (c._id === id ? { ...c, investmentStatus: newStatus } : c)));
      toast.success(t('StatusUpdatedSuccessfully'));
    } catch (error) {
      toast.error(t('ErrorUpdatingStatus'));
    }
  };

  const columns = [
    {
      field: i18n.language === 'ar' ? 'titleInv_ar' : 'titleInv',
      headerName: t('title'),
      flex: 1,
      align: i18n.language === 'ar' ? 'right' : 'left'
    },
    {
      field: i18n.language === 'ar' ? 'amount' : 'amount',
      headerName: t('amount'),
      flex: 1,
      align: i18n.language === 'ar' ? 'right' : 'left'
    },
    {
      field: 'currency',
      headerName: t('currency'),
      flex: 1,
      renderCell: (params) => (
        <span>
          {i18n.language === 'ar' ? params.row.currency.symbol_ar : params.row.currency.symbol}
        </span>
      ),
      align: i18n.language === 'ar' ? 'right' : 'left'
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
      align: i18n.language === 'ar' ? 'right' : 'left'
    },
    {
      field: 'dateInv',
      headerName: t('dateInv'),
      flex: 1,
      renderCell: (params) => (
        <span>
          {new Date(params.row.dateInv).toLocaleDateString()}
        </span>
      ),

      align: i18n.language === 'ar' ? 'right' : 'left'
    },
    {
      field: i18n.language === 'ar' ? 'description' : 'description',
      headerName: t('description'),
      flex: 1,
      align: i18n.language === 'ar' ? 'right' : 'left'

 
    },
    {
      field: 'investmentStatus',
      headerName: t('investmentStatus'),
      flex: 1,
      renderCell: (params) => (
        <Switch
          checked={params.row.investmentStatus}
          onChange={() => handleToggleStatus(params.row._id, params.row.investmentStatus)}
          color="warning"
          disabled={userRole === 'investor'}
        />
      ),
      align: i18n.language === 'ar' ? 'right' : 'left'
    }
  ];

  if (userRole !== 'investor') {
    columns.push({
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
    });
  }

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
        {userRole === 'investor'? null : (
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
    {t('addInvestment')}
  </Button>
)}
          </Toolbar>
          <div style={{ width: '100%', height: '100%' }}>
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100%"add
              >
                <img src={loader} alt="Loading..." />
              </Box>
            ) : (
              <StripedDataGrid
                rows={filteredInvestments}
                columns={columns}add
                pageSize={10}
                rowsPerPageOptions={[10]}
                autoHeight
                getRowId={(row) => row._id}
                getRowClassName={(params) =>
                  params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
                direction={i18n.language === 'ar' ? 'rtl' : 'ltr'}
              />
            )}
          </div>
        </Paper>
      </Box>
    </Suspense>
  );
};

export default InvestmentTable;
