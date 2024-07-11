import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  MenuItem
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';

const AddWallet = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [wallet, setWallet] = useState({
    investorInfo: '',
    amount: '',
  });

  const [wallet_ar, setWallet_ar] = useState({
    fullname_ar: '',
  });


  const [investors, setInvestors] = useState([]);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await api.get(`/admin/allInvestors/${i18n.language}`);
        setInvestors(response.data);
      } catch (error) {
        console.error('Error fetching investors:', error);
      }
    };

    fetchInvestors();
  }, [i18n.language]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWallet({ ...wallet, [name]: value });
  };

  const handleInputChangeAr = (e) => {
    const { name, value } = e.target;
    setWallet_ar({ ...wallet_ar, [name]: value });
  };

  const handleAddWallet = async (e) => {
    e.preventDefault();
    const fullWallet = { ...wallet, ...wallet_ar };
    try {
      await api.post('/wallet/createWallet', fullWallet);
      toast.success(t('WalletAddedSuccessfully'));
      setTimeout(() => {
        navigate('/wallets');
      }, 1500);
    } catch (error) {
      if (error.response && error.response.data) {
        const errorResponseData = error.response.data;
        const parser = new DOMParser();
        const doc = parser.parseFromString(errorResponseData, 'text/html');
        const preElement = doc.querySelector('pre');
        if (preElement) {
          const preContent = preElement.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
          const errorMessage = preContent.split('\n')[0];
          toast.error(errorMessage);
        } else {
          toast.error(t('AnErrorOccurred'));
        }
      } else {
        console.error(t('ErrorWithoutResponseData'));
      }
    }
  };

  return (
    <Box p={3}>
      <ToastContainer />
      <Paper elevation={8} style={{ padding: '15px', marginBottom: '10px', marginLeft: '1%', width: 'calc(100% - 60px)' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: '1%' }}>
          {t('AddWallet')}
        </Typography>
        <form onSubmit={handleAddWallet} style={{ marginTop: '15px' }}>
          <TextField
            fullWidth
            select
            label={t('Investor')}
            name="investorInfo"
            value={wallet.investorInfo}
            onChange={handleInputChange} 
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}
          >
            {investors.map((investor) => (
              <MenuItem key={investor._id} value={investor._id}>
                  {investor.fullname_en}
                </MenuItem>
            ))}
          </TextField>
      
          <TextField
            fullWidth
            label={t('Amount')}
            name="amount"
            value={wallet.amount}
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
              {t('AddWallet')}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/wallets')}
              sx={{
                mr: 2,
                border: '1px solid #ed6c02',
                borderRadius: '10px',
                color: 'black',
                '&:hover': {
                  borderColor: '#e65100',
                  color: '#e65100',
                },
              }}
            >
              {t('Cancel')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddWallet;
