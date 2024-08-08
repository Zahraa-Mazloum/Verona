import React, { useState, useEffect, Suspense } from 'react';
import {
  Button,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  Toolbar,
  Typography,
  Box,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../loading.js';
import loader from '../loading.gif';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';
import api from '../../api/axios';
import CashoutPopup from './walletCashoutPopup';

const WalletsTable = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [cashoutOption, setCashoutOption] = useState('payment');
  const [openCashoutPopup, setOpenCashoutPopup] = useState(false);
  const [bankDetails, setBankDetails] = useState({ accountNumber: '', bankName: '', amount: '' });
  const [transferDetails, setTransferDetails] = useState({
    amount: '',
    accountHolderName: '',
    dateOfTransfer: '',
    paymentScreenshot: null,
  });
  const socket = io();
  const navigate = useNavigate();
  const investorId = localStorage.getItem('id');

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
    socket.on('newNotification', () => {
      const audio = new Audio('/notification.mp3');
      audio.play();
    });
  }, [socket]);

  useEffect(() => {
    fetchWallets();
  }, [i18n.language]);

  const handleCashoutClick = (row) => {
    setSelectedRow(row);
    setOpenCashoutPopup(true);
  };
  

  const handlePopupClose = () => {
    setOpenCashoutPopup(false);
    setBankDetails({ accountNumber: '', bankName: '', amount: '' });
    setCashoutOption('payment');
    setSelectedRow(null);
  };

  const handleCashoutSubmit = async (details) => {
    try {
      await api.post(`/wallet/cashout/${id}`, details);
      toast.success(t('CashoutSuccessful'));
      fetchWallets();
      handlePopupClose();
    } catch (error) {
      toast.error(t('ErrorCashout'));
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

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTransferDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.size <= 5 * 1024 * 1024) {
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        setTransferDetails({ ...transferDetails, paymentScreenshot: file });
      } else {
        toast.error(t('photoError'));
        e.target.value = null;
      }
    } else {
      toast.error(t('photoSize'));
      e.target.value = null;
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('amount', transferDetails.amount);
      formData.append('accountHolderName', transferDetails.accountHolderName);
      formData.append('dateOfTransfer', transferDetails.dateOfTransfer);
      formData.append('paymentScreenshot', transferDetails.paymentScreenshot);

      const response = await api.post(`/wallet/bankTransfer/${investorId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        toast.success(t('TransferDetailsSubmitted'));
        fetchWallets();
        handleDialogClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message === "No payment screenshot uploaded") {
        toast.error(t('NoPaymentScreenshotUploaded'));
      } else {
        console.error(error);
        toast.error(t('ErrorSubmittingTransferDetails'));
      }
    }
  };

  const columns = [
    {
      field: 'amount',
      headerName: t('Amount'),
      flex: 1,
    },
    {
      field: 'topup',
      headerName: t('Topup'),
      flex: 1,
      align: i18n.language === 'ar' ? 'right' : 'left',
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="warning"
            onClick={handleMenuClick}
          >
            {t('Topup')}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{ mt: 30, ml: 138 }}
          >
            <MenuItem onClick={handleDialogOpen}>{t('BankTransfer')}</MenuItem>
            <MenuItem disabled>{t('PayByCard')} ({t('ComingSoon')})</MenuItem>
            <MenuItem disabled>{t('PayByCrypto')} ({t('ComingSoon')})</MenuItem>
          </Menu>
        </>
      ),
    },
    {
      field: 'cashout',
      headerName: t('Cashout'),
      flex: 1,
      align: i18n.language === 'ar' ? 'right' : 'left',
      renderCell: (params) => (
        <Button
          onClick={() => handleCashoutClick(params.row)}
          variant="outlined"
          color="warning"
        >
          {t('Cashout')}
        </Button>
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
          <div style={{ width: '100%', height: '430px' }}>
            <StripedDataGrid
              components={{ NoRowsOverlay: Loading }}
              rows={filteredWallets}
              columns={columns}
              pageSize={10}
              getRowId={(row) => row._id}
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
              }
              sx={{
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#f5f5f5',
                },
              }}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
            />
          </div>
        </Paper>

    <CashoutPopup
  open={openCashoutPopup}
  onClose={handlePopupClose}
  onSubmit={handleCashoutSubmit}
  bankDetails={bankDetails}
  setBankDetails={setBankDetails}
  cashoutOption={cashoutOption}
  setCashoutOption={setCashoutOption}
  amount={selectedRow ? selectedRow.amount : ''}
/>

        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>{t('BankTransferDetails')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('EnterTransferDetails')}
            </DialogContentText>
            <form onSubmit={handleFormSubmit} encType="multipart/form-data">
              <TextField
                margin="dense"
                label={t('Amount')}
                name="amount"
                fullWidth
                value={transferDetails.amount}
                onChange={handleInputChange}
                required
              />
              <TextField
                margin="dense"
                label={t('AccountHolderName')}
                name="accountHolderName"
                fullWidth
                value={transferDetails.accountHolderName}
                onChange={handleInputChange}
                required
              />
              <TextField
                margin="dense"
                label={t('DateOfTransfer')}
                name="dateOfTransfer"
                fullWidth
                value={transferDetails.dateOfTransfer}
                onChange={handleInputChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
                type="date"
              />
              <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
                required
              />
              <DialogActions>
                <Button onClick={handleDialogClose} color="primary">
                  {t('Cancel')}
                </Button>
                <Button type="submit" color="primary">
                  {t('Submit')}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </Suspense>
  );
};

export default WalletsTable;
