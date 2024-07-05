import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, MenuItem } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/axios';

const AddCurrency = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState({ name: '', symbol: '', description: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrency({ ...currency, [name]: value });
  };

  const handleAddCurrency = async (e) => {
    e.preventDefault();
    try {
      await api.post('/currency/createCurrency', currency);
      toast.success('Currency added successfully');
      setTimeout(() => {
        navigate('/currencyTable');
      }, 1500);
    } catch (error) {
      toast.error('Error adding currency');
    }
  };

  return (
    <Box p={3}>
      <ToastContainer />
      <Paper elevation={8} style={{ padding: '15px', marginBottom: '10px', marginLeft: '1%', width: 'calc(100% - 60px)' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: '1%' }}>
          Add Currency
        </Typography>
        <form onSubmit={handleAddCurrency} style={{ marginTop: '15px' }}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={currency.name}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}

          />
          <TextField
            fullWidth
            select
            label="Symbol"
            name="symbol"
            value={currency.symbol}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}

          >
            <MenuItem value="AED">AED</MenuItem>
            <MenuItem value="OMR">OMR</MenuItem>
            <MenuItem value="USD">USD</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={currency.description}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}

          />
         <Box mt={2} display="flex" justifyContent="flex-end">
         <Button
              variant="contained"
              color="warning"
              type="submit"
              sx={{ mr: 2 }}
              InputProps={{ style: { borderRadius: '12px' } }}

            >
              Add Currency
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/currencyTable')}
              sx={{
                mr: 2,
                border: '1px solid #ed6c02', 
                borderRadius: '10px',
                color:'black',
                '&:hover': {
                  borderColor: '#e65100',
                  color:'#e65100'
                }
              }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddCurrency;
