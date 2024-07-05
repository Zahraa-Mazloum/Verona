import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Button, Paper, TextField, IconButton, InputAdornment, Toolbar, Typography, Box, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useNavigate } from 'react-router-dom';
import loader from '../loading.gif';

const CurrencyTable = () => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
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
      const { data, count } = await api.get('/currency/getCurrencies');
      setCurrencies(data);
      setRowCount(count);
    } catch (error) {
      toast.error('Error fetching currencies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleDeleteCurrency = async (id) => {
    try {
      await api.delete(`/currency/deleteCurrency/${id}`);
      setCurrencies(currencies.filter(c => c._id !== id));
      toast.success('Currency deleted successfully');
    } catch (error) {
      toast.error('Error deleting currency');
    }
  };

  const handleOpenConfirmDelete = (event, currency) => {
    setAnchorEl(event.currentTarget);
    setCurrencyToDelete(currency);
  };

  const handleCloseConfirmDelete = () => {
    setAnchorEl(null);
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

  const filteredCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(search.toLowerCase()) ||
    currency.symbol.toLowerCase().includes(search.toLowerCase()) ||
    currency.description.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'symbol', headerName: 'Symbol', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    {
      field: 'actions',
      headerName: 'Actions',
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
                <Typography sx={{ textAlign: 'center' }}>Are you sure?</Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleConfirmDelete}
                  size="small"
                >
                  Yes
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCloseConfirmDelete}
                  size="small"
                  style={{ marginLeft: 8 }}
                >
                  No
                </Button>
              </Box>
            }
            open={Boolean(anchorEl && currencyToDelete === params.row)}
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
      <Paper elevation={8} style={{ padding: '15px', marginBottom: '10px', marginLeft: '1%', width: 'calc(100% - 60px)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: '1%' }}>
            Currency Management
          </Typography>
          <TextField
            variant="standard"
            placeholder="Search…"
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
            Add Currency
          </Button>
        </Toolbar>
        <div style={{ width: '100%', marginLeft: '2%', height: '100%' }}>
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
            style={{ width: open ? 'calc(100% - 240px)' : 'calc(100% - 60px)' }}
              rows={filteredCurrencies}
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
    </Box>
  );
};

export default CurrencyTable;
