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
  Tooltip,
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
import loader from '../loading.gif';
import { useTranslation } from 'react-i18next';

const WalletsTable = () => {
  const { t, i18n } = useTranslation();
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [walletToDelete, setWalletToDelete] = useState(null);
  const navigate = useNavigate();

  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: 'rgba(255, 242, 215, 0.5)',
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
  }));

  const fetchWallets = async () => {
    try {
      const { data } = await api.get(`/wallet/getWallets/${i18n.language}`);
      setWallets(data);
    } catch (error) {
      toast.error(t('ErrorFetchingWallets'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, [i18n.language]);

  const handleDeleteWallet = async (id) => {
    try {
      await api.delete(`/wallet/deleteWallet/${id}`);
      setWallets(wallets.filter((w) => w._id !== id));
      toast.success(t('WalletDeletedSuccessfully'));
    } catch (error) {
      toast.error(t('ErrorDeletingWallet'));
    }
  };

  const handleOpenConfirmDelete = (event, wallet) => {
    setWalletToDelete(wallet);
  };

  const handleCloseConfirmDelete = () => {
    setWalletToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (walletToDelete) {
      handleDeleteWallet(walletToDelete._id);
      handleCloseConfirmDelete();
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const safeLowerCase = (str) => (typeof str === 'string' ? str.toLowerCase() : '');

  const filteredWallets = wallets.filter((wallet) => {
    const investorInfo = wallet.investorInfo || {};
    return (
      safeLowerCase(investorInfo.fullname_en).includes(safeLowerCase(search)) ||
      safeLowerCase(wallet.currency).includes(safeLowerCase(search)) ||
      safeLowerCase(wallet.amount.toString()).includes(safeLowerCase(search))
    );
  });

  const columns = [
    {
      field: 'investorInfo',
      headerName: t('InvestorName'),
      flex: 1,
      renderCell: (params) => (
        <span>
          {i18n.language === 'ar' ? params.row.investorInfo?.fullname_ar : params.row.investorInfo?.fullname_en}
        </span>
      ),
    },

    {
      field: 'amount',
      headerName: t('Amount'),
      flex: 1,
    },
    {
      field: 'actions',
      headerName: t('Actions'),
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" justifyContent="left">
          <IconButton
            sx={{ color: '#4CAF50', fontSize: 28 }}
            onClick={() => navigate(`/editWallet/${params.row._id}`)}
          >
            <EditNoteIcon />
          </IconButton>
          <Tooltip
            title={
              <Box>
                <Typography sx={{ textAlign: 'center' }}>{t('AreYouSure')}</Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleConfirmDelete}
                  size="small"
                >
                  {t('Yes')}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCloseConfirmDelete}
                  size="small"
                  style={{ marginLeft: 8 }}
                >
                  {t('No')}
                </Button>
              </Box>
            }
            open={Boolean(walletToDelete === params.row)}
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
            {t('WalletsManagement')}
          </Typography>
          <TextField
            variant="standard"
            placeholder={t('Search')}
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
            onClick={() => navigate('/AddWallet')}
          >
            {t('AddWallet')}
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
              rows={filteredWallets}
              columns={columns}
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

export default WalletsTable;
