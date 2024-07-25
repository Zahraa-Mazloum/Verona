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
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../loading.js';
import loader from '../loading.gif';
import { useTranslation } from 'react-i18next';

const WalletsTable = () => {
  const {id} =useParams()
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
      const { data } = await api.get(`/wallet/getInvWallet/${id}`);
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
      field: 'amount',
      headerName: t('Amount'),
      flex: 1,
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
    <Box p={3}>
      <ToastContainer />
      <Paper elevation={8} style={{ padding: '15px', marginBottom: '10px' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('MyWallet')}
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
