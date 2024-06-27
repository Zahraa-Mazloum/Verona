import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { DataGrid , gridClasses } from '@mui/x-data-grid';
import {Button, Paper, TextField, IconButton,InputAdornment, Toolbar, Typography, Box, DialogContentText} from '@mui/material';
import {  styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CurrencyFormDialog from './CurrencyFormDialog';
import loader from '../loading.gif';
import Swal from 'sweetalert2';

const CurrencyTable = () => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState(null);
  const [search, setSearch] = useState('');


  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: 'rgba(255, 242, 215, 0.5)',
      '&:hover': {
        backgroundColor: theme.palette.grey[200],

      }
    }})
  );  
  const fetchCurrencies = async () => {
    try {
      const { data } = await api.get('/currency/getCurrencies');
      setCurrencies(data);
    } catch (error) {
      toast.error('Error fetching currencies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleAddCurrency = async (currency) => {
    try {
      const { data } = await api.post('/currency/createCurrency', currency);
      setCurrencies([...currencies, data]);
      toast.success('Currency added successfully');
    } catch (error) {
      toast.error('Error adding currency');
    }
  };

  const handleEditCurrency = async (currency) => {
    try {
      const { data } = await api.put(`/currency/updateCurrency/${currency._id}`, currency);
      setCurrencies(currencies.map(c => (c._id === currency._id ? data : c)));
      toast.success('Currency updated successfully');
    } catch (error) {
      toast.error('Error updating currency');
    }
  };

  const handleDeleteCurrency = async (id) => {
    try {
      await api.delete(`/currency/deleteCurrency/${id}`);
      setCurrencies(currencies.filter(c => c._id !== id));
      toast.success('Currency deleted successfully');
    } catch (error) {
      toast.error('Error deleting currency');
    }
  };

  const handleOpenEdit = (currency) => {
    setEditingCurrency(currency);
    setOpen(true);
  };

  const handleConfirmDelete = (currency) => {
    Swal.fire({
      title: 'Confirm Delete',
      text: 'Are you sure you want to delete this currency?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteCurrency(currency._id);
      }
    });
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
            sx={{
                color: '#4CAF50',
                fontSize: 28,
            }}
            onClick={() => handleOpenEdit(params.row)}
          >
            <EditNoteIcon />
          </IconButton>
          <IconButton
            sx={{
                color: '#FF5722', fontSize: 28,
            }}
            onClick={() => handleConfirmDelete(params.row)}
          >
            <DeleteSweepIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box p={3}>
      <ToastContainer />
      <Paper elevation={5} style={{ padding: '10px', marginBottom: '10px', width: open ? 'calc(100% - 240px)' : 'calc(100% - 60px)' }}>

        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 , marginLeft: '1%'}}>
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
  onClick={() => setOpen(true)}
>
  Add Currency
</Button>
        </Toolbar>
        <div style={{ width: '100%', overflowX: 'hidden',overflowY: 'hidden' , marginLeft:'2%' }}>
        <StripedDataGrid
  style={{ width: open ? 'calc(100% - 240px)' : 'calc(100% - 60px)'}}
  rows={filteredCurrencies}
  columns={columns}
  pageSize={5}
  rowsPerPageOptions={[5, 10, 25]}
  pagination={true}
  getRowId={(row) => row._id}
  getRowClassName={(params) =>
    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
  }
/>


</div>
      </Paper>
      <CurrencyFormDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingCurrency(null);
        }}
        onAddCurrency={handleAddCurrency}
        onEditCurrency={handleEditCurrency}
        editingCurrency={editingCurrency}
      />

    </Box>
  );
};

export default CurrencyTable;
