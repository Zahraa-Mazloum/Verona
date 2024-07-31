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
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../loading.js';
import loader from '../loading.gif';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';

const WalletsTable = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
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
      const audio = new Audio('/notificatio.mp3');
      audio.play();
    });
  }, [socket]);

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

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
    setAnchorEl(null);
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
          'Content-Type': 'multipart/form-data'
        }
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
      field: 'actions',
      headerName: t('Actions'),
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
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

        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>{t('BankTransfer')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('BankTransferInstructions')}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="amount"
              label={t('Amount')}
              type="number"
              fullWidth
              variant="outlined"
              value={transferDetails.amount}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="accountHolderName"
              label={t('AccountHolderName')}
              type="text"
              fullWidth
              variant="outlined"
              value={transferDetails.accountHolderName}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="dateOfTransfer"
              label={t('DateOfTransfer')}
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={transferDetails.dateOfTransfer}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              type="file"
              name="paymentScreenshot"
              onChange={handleFileChange}
              margin="normal"
              inputProps={{ accept: "image/jpeg, image/png" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>{t('Cancel')}</Button>
            <Button onClick={handleFormSubmit}>{t('Submit')}</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Suspense>
  );
};

export default WalletsTable;
