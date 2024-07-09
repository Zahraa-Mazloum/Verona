import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/axios';

const EditContract = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState({
    investorInfo: {
      fullname_en: '',
      fullname_ar: ''
    },
    amount: '',
    currency: {
      symbol_en: '',
      symbol_ar: ''
    },
    contractTime: '',
    startDate: '',
    investmentStatus: ''
  });

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const { data } = await api.get(`/contract/investrContract/${id}`);
        const formattedData = {
          ...data,
          startDate: data.startDate ? data.startDate.split('T')[0] : ''
        };
        setContract(formattedData);
      } catch (error) {
        toast.error('Error fetching contract');
      }
    };
    fetchContract();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [mainKey, subKey] = name.split('.');
    if (subKey) {
      setContract(prevState => ({
        ...prevState,
        [mainKey]: {
          ...prevState[mainKey],
          [subKey]: value
        }
      }));
    } else {
      setContract({ ...contract, [name]: value });
    }
  };

  const handleUpdateContract = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/contract/editContract/${id}`, contract);
      toast.success('Contract updated successfully');
      setTimeout(() => {
        navigate('/contract');
      }, 1500);
    } catch (error) {
      toast.error('Error updating contract');
    }
  };

  return (
    <Box p={3}>
      <ToastContainer />
      <Paper elevation={8} style={{ padding: '15px', marginBottom: '10px', marginLeft: '1%', width: 'calc(100% - 60px)' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: '1%' }}>
          Edit Contract
        </Typography>
        <div className='formContainer'>
          <form onSubmit={handleUpdateContract} style={{ marginTop: '15px' }}>
            <TextField
              fullWidth
              label="Name (English)"
              name="investorInfo.fullname_en"
              value={contract.investorInfo.fullname_en}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{ style: { borderRadius: '12px' } }}
              sx={{
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e65100'
                  }
                }
              }}
            />
            <TextField
              fullWidth
              label="Name (Arabic)"
              name="investorInfo.fullname_ar"
              value={contract.investorInfo.fullname_ar}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{ style: { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              value={contract.amount}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{ style: { borderRadius: '12px' } }}
            />
                 <TextField
              fullWidth
              label="Currency"
              name="currency"
              value={contract.currency.symbol}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{ style: { borderRadius: '12px' } }}
            />  
            <TextField
              fullWidth
              label="Contract Time"
              name="contractTime"
              value={contract.contractTime}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{ style: { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              label="Start Date"
              name="startDate"
              type="date"
              value={contract.startDate}
              onChange={handleInputChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{ style: { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              label="Investment Status"
              name="investmentStatus"
              value={contract.investmentStatus}
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
              >
                Update Contract
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/contract')}
                sx={{
                  mr: 2,
                  border: '1px solid #ed6c02',
                  borderRadius: '10px',
                  color: 'black',
                  '&:hover': {
                    borderColor: '#e65100',
                    color: '#e65100'
                  }
                }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </div>
      </Paper>
    </Box>
  );
};

export default EditContract;
