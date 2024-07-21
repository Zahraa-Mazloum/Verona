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
  Box,
  Switch
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useNavigate } from 'react-router-dom';
import Loading from '../loading.js';
import loader from '../loading.gif';
import { useTranslation } from 'react-i18next';

const InvContractsTable = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [contract, setContract] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

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

  const safeLowerCase = (str) => (typeof str === 'string' ? str.toLowerCase() : '');

  const filteredContract = contract.filter((Contracts) =>
    safeLowerCase(i18n.language === 'ar' ? Contracts.investorInfo.fullname_ar : Contracts.investorInfo.fullname_en).includes(safeLowerCase(search)) ||
    safeLowerCase(Contracts.currency).includes(safeLowerCase(search)) ||
    safeLowerCase(Contracts.startDate).includes(safeLowerCase(search)) ||
    safeLowerCase(Contracts.endDate).includes(safeLowerCase(search)) ||
    safeLowerCase(Contracts.contractPercentage).includes(safeLowerCase(search)) ||
    safeLowerCase(Contracts.investmentStatus).includes(safeLowerCase(search))
  );

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await api.put(`/contract/updateStatus/${id}`, { investmentStatus: newStatus });
      setContract(contract.map((c) => (c._id === id ? { ...c, investmentStatus: newStatus } : c)));
      toast.success(t('StatusUpdatedSuccessfully'));
    } catch (error) {
      toast.error(t('ErrorUpdatingStatus'));
    }
  };

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
                direction={i18n.language === 'ar' ? 'rtl' : 'ltr'}
              />
            )}
          </div>
        </Paper>
      </Box>
    </Suspense>
  );
};

export default InvContractsTable;
