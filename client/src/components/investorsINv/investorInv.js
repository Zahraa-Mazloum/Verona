import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {
  Button,
  Paper,
  TextField,
  InputAdornment,
  Toolbar,
  Typography,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Loading from '../loading.js';
import loader from '../loading.gif';
import { useTranslation } from 'react-i18next';
import CashoutPopup from './CashoutPopup';
import io from 'socket.io-client'; // Import socket.io-client

const InvContractsTable = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [contract, setContract] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [bankDetails, setBankDetails] = useState({ accountNumber: '', bankName: '', amount: '' });
  const [cashoutOption, setCashoutOption] = useState('payment');

  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: 'rgba(255, 242, 215, 0.5)',
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
  }));

  const fetchContract = async () => {
    try {
      const { data } = await api.get(`/contract/investorContracts/${id}`);
      setContract(data);
    } catch (error) {
      toast.error(t('ErrorFetchingContracts'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [i18n.language]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleCashoutClick = (row) => {
    setSelectedRow(row);
    setOpenPopup(true);
  };

  const handlePopupClose = () => {
    setOpenPopup(false);
    setBankDetails({ accountNumber: '', bankName: '', amount: '' });
    setCashoutOption('payment');
    setSelectedRow(null); 
  };

  const handlePopupSubmit = async (details) => {
    if (selectedRow) {
      try {
        await api.post(`/contract/cashout/${selectedRow._id}`, details);
        toast.success(t('CashoutRequestSent'));
        
        // Initialize and use Socket.IO here
        const socket = io('http://localhost:5001');
        socket.emit('newNotification', {
          message: `New cashout request for contract ${selectedRow._id}`
        });
        socket.disconnect(); // Close the socket connection
      } catch (error) {
        toast.error(t('ErrorSendingCashoutRequest'));
      } finally {
        handlePopupClose();
      }
    }
  };

  const safeLowerCase = (str) => (typeof str === 'string' ? str.toLowerCase() : '');

  const filteredContract = contract.filter((Contracts) =>
    safeLowerCase(i18n.language === 'ar' ? Contracts.investorInfo.fullname_ar : Contracts.investorInfo.fullname_en).includes(safeLowerCase(search)) ||
    safeLowerCase(Contracts.currency).includes(safeLowerCase(search)) ||
    safeLowerCase(Contracts.startDate).includes(safeLowerCase(search)) ||
    safeLowerCase(Contracts.endDate).includes(safeLowerCase(search)) ||
    safeLowerCase(Contracts.contractPercentage).includes(safeLowerCase(search)) ||
    safeLowerCase(Contracts.investmentStatus).includes(safeLowerCase(search))
  );

  const columns = [
    {
      field: 'amount',
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
      field: 'contractPercentage',
      headerName: t('ROI'),
      flex: 1,
      editable: false,
      readonly: true,
      align: i18n.language === 'ar' ? 'right' : 'left',
      renderCell: (params) => (
        <span>
         {params.value} %
        </span>
      ),
    },
    {
      field: 'profit',
      headerName: t('profit'),
      flex: 1,
      editable: false,
      readonly: true,
      align: i18n.language === 'ar' ? 'right' : 'left',
    },
    {
      field: 'cashout',
      headerName: t('cashout'),
      flex: 1,
      align: i18n.language === 'ar' ? 'right' : 'left',
      renderCell: (params) => (
        <Button
          onClick={() => handleCashoutClick(params.row)}
          variant="outlined"
          color="warning"
          disabled={!params.row.isMatured}
        >
          {t('cashout')}
        </Button>
      ),
    },
    {
      field: 'transfer',
      headerName: t('transfer'),
      flex: 1,
      align: i18n.language === 'ar' ? 'right' : 'left',
      renderCell: (params) => (
        <Button
          onClick={() => handleCashoutClick(params.row)}
          variant="outlined"
          color="warning"
          disabled={!params.row.isMatured}
        >
          {t('transfer')}
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
              {t('MyInv')}
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
                rows={filteredContract}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                autoHeight
                getRowId={(row) => row._id}
                getRowClassName={(params) =>
                  params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
              />
            )}
          </div>
        </Paper>
        {selectedRow && (
        <CashoutPopup
          open={openPopup}
          onClose={handlePopupClose}
          onSubmit={handlePopupSubmit}
          bankDetails={bankDetails}
          setBankDetails={setBankDetails}
          cashoutOption={cashoutOption}
          setCashoutOption={setCashoutOption}
          paymentAmount={selectedRow.payment}
          profitAmount={selectedRow.profit}
        />
      )}
    </Box>
    </Suspense>
  );
};

export default InvContractsTable;
