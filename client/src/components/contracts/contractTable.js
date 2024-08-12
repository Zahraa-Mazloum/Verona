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
import loader from '../loading.gif';
import { useTranslation } from 'react-i18next';
import './ContractsTable.css'

const ContractsTable = () => {
  const { t, i18n } = useTranslation();
  const [contract, setContract] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ContractsToDelete, setContractsToDelete] = useState(null);
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
      const { data } = await api.get(`/contract/allContracts/${i18n.language}`);
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

  const handleDeleteContracts = async (id) => {
    try {
      await api.delete(`/contract/deleteContract/${id}`);
      setContract(contract.filter(c => c._id !== id));
      toast.success(t('ContractDeletedSuccessfully'));
    } catch (error) {
      toast.error(t('ErrorDeletingContract'));
    }
  };

  const handleOpenConfirmDelete = (event, Contracts) => {
    setContractsToDelete(Contracts);
  };

  const handleCloseConfirmDelete = () => {
    setContractsToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (ContractsToDelete) {
      handleDeleteContracts(ContractsToDelete._id);
      handleCloseConfirmDelete();
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const safeLowerCase = (str) => (typeof str === 'string' ? str.toLowerCase() : '');

  const filteredContract = contract.filter(Contracts =>
    safeLowerCase(i18n.language === 'ar' ? Contracts.investorInfo.fullname_ar : Contracts.investorInfo.fullname_en).includes(safeLowerCase(search)) ||
    safeLowerCase(Contracts.currency).includes(safeLowerCase(search)) ||
    safeLowerCase(Contracts.contractTime).includes(safeLowerCase(search)) ||
    safeLowerCase(Contracts.startDate).includes(safeLowerCase(search)) ||
    safeLowerCase(Contracts.endDate).includes(safeLowerCase(search)) ||
    safeLowerCase(Contracts.contractPercentage).includes(safeLowerCase(search)) ||
    safeLowerCase(Contracts.investmentStatus).includes(safeLowerCase(search))  );

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus; 
      await api.put(`/contract/updateStatus/${id}`, { investmentStatus: newStatus });
      setContract(contract.map(c => (c._id === id ? { ...c, investmentStatus: newStatus } : c)));
      toast.success(t('StatusUpdatedSuccessfully'));
    } catch (error) {
      toast.error(t('ErrorUpdatingStatus'));
    }
  };

  const columns = [
    {
      field: 'investorInfo',
      headerName: t('Investorname'),
      flex: 1,
      renderCell: (params) => (
        <span>
          {i18n.language === 'ar' ? params.row.investorInfo.fullname_ar : params.row.investorInfo.fullname_en}
        </span>
      ),
      align: i18n.language === 'ar' ? 'right' : 'left'
    },
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
      field: 'contractTime',
      headerName: t('contractTime'),
      flex: 1,
      align: i18n.language === 'ar' ? 'right' : 'left',
      renderCell: (params) => (
        <span>
          {i18n.language === 'ar' ? params.row.contractTime_ar : params.row.contractTime}
        </span>
      ),

    },
    {
      field: 'startDate',
      headerName: t('startDate'),
      flex: 1,
      renderCell: (params) => (
        <span>
          {new Date(params.row.startDate).toLocaleDateString()}
        </span>
      ),
            align: i18n.language === 'ar' ? 'right' : 'left'
    },
    {
      field: 'endDate',
      headerName: t('endDate'),
      flex: 1,
      renderCell: (params) => (
        <span>
          {new Date(params.row.endDate).toLocaleDateString()}
        </span>
      ),
      editable: false,
      readonly: true,
      align: i18n.language === 'ar' ? 'right' : 'left'
    },
    {
      field: 'contractPercentage',
      headerName: t('contractPercentage'),
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
      field: 'withdraw',
      headerName: t('withdraw'),
      flex: 1,
      editable: false,
      readonly: true,
      align: i18n.language === 'ar' ? 'right' : 'left',
      renderCell: (params) => (
        <span>
          {Number(params.value).toFixed(2)}
        </span>
      ),
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
        />
      ),
      align: i18n.language === 'ar' ? 'right' : 'left'
    },
    {
      field: 'actions',
      headerName: t('actions'),
      sortable: false,
      cellClassName: 'right-align-cell',
      flex: 1,
      align: i18n.language === 'ar' ? 'right' : 'left',
      renderCell: (params) => (
        <Box display="flex" justifyContent="left">
          <IconButton
            sx={{ color: '#4CAF50', fontSize: 28 }}
            onClick={() => navigate(`/editContracts/${params.row._id}`)}
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
            open={Boolean(ContractsToDelete === params.row)}
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
              {t('ContractsManagement')}
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
              onClick={() => navigate('/addContracts')}
            >
              {t('addContract')}
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

export default ContractsTable;
