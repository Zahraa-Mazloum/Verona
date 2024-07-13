import React, { useState, useEffect,Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import Loading from '../loading.js';

const EditInvestment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [Investment, setInvestment] = useState({
    title: {
      title: '',
      title_ar: ''
    },
    type: {
      type_en: '',
      type_ar: ''
    },   
    contract: {
      title: '',
      title_ar: ''
    },
    amount: '',
    investmentStatus: '',
  });
const[t]=useTranslation()
  useEffect(() => {
    const fetchInvestment = async () => {
      try {
        const { data } = await api.get(`/inv/getInvestmentById/${id}`);
        const formattedData = {
          ...data,
        };
        setInvestment(formattedData);
      } catch (error) {
        toast.error('Error fetching Investment');
      }
    };
    fetchInvestment();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [mainKey, subKey] = name.split('.');
    if (subKey) {
      setInvestment(prevState => ({
        ...prevState,
        [mainKey]: {
          ...prevState[mainKey],
          [subKey]: value
        }
      }));
    } else {
      setInvestment({ ...Investment, [name]: value });
    }
  };

  const handleUpdateInvestment = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/inv/updateInvestment/${id}`, Investment);
      toast.success('Investment updated successfully');
      setTimeout(() => {
        navigate('/Investment');
      }, 1500);
    } catch (error) {
      toast.error('Error updating Investment');
    }
  };

  return (
    <Suspense fallback={<Loading />}>
    <Box p={3}>
      <ToastContainer />
      <Paper elevation={8} style={{ padding: '15px', marginBottom: '10px', marginLeft: '1%', width: 'calc(100% - 60px)' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: '1%' }}>
          {t('EditInvestment')}
        </Typography>
        <div className='formContainer'>
          <form onSubmit={handleUpdateInvestment} style={{ marginTop: '15px' }}>
           
            <TextField
              fullWidth
              label="Title (EN)"
              name="title"
              value={Investment.titleInv}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{ style: { borderRadius: '12px' } }}
            />          <TextField
              fullWidth
              label="Title (Ar)"
              name="title_ar"
              value={Investment.titleInv_ar}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{ style: { borderRadius: '12px' } }}
            />  
            <TextField
              fullWidth
              label="Type (En)"
              name="type.type_en"
              value={Investment.type.type_en}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{ style: { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              label="Type (Ar)"
              name="type.type_ar"
              value={Investment.type.type_ar}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{ style: { borderRadius: '12px' } }}
            />    <TextField
              fullWidth
              label="Contract (EN)"
              name="contract.title"
              value={Investment.contract.title}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{ style: { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              label="Contract (AR)"
              name="contract.title_ar"
              value={Investment.contract.title_ar}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{ style: { borderRadius: '12px' } }}
            />

                 <TextField
              fullWidth
              label="Amount"
              name="amount"
              value={Investment.amount}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{ style: { borderRadius: '12px' } }}
            />  
            <TextField
              fullWidth
              label="Investment Status"
              name="investmentStatus"
              value={Investment.investmentStatus}
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
                Update Investment
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/Investment')}
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
    </Suspense>
  );
};

export default EditInvestment;
