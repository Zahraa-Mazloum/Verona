import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import Loading from '../loading.js';

const EditWallet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState({ investorInfo: { fullname_en: '', fullname_ar: '' }, amount: '' });
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const { data } = await api.get(`/wallet/getWallet/${id}`);
        setWallet(data);
      } catch (error) {
        toast.error(t('ErrorFetchingWallet'));
      }
    };

    fetchWallet();
  }, [id, i18n.language]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [mainKey, subKey] = name.split('.');
    if (subKey) {
      setWallet(prevState => ({
        ...prevState,
        [mainKey]: {
          ...prevState[mainKey],
          [subKey]: value
        }
      }));
    } else {
      setWallet({ ...wallet, [name]: value });
    }
  };

  const handleUpdateWallet = async (e) => {
    e.preventDefault();
    try {
      // Validate the payload size before sending it
      const payloadSize = new Blob([JSON.stringify(wallet)]).size;
      if (payloadSize > 5000000) { // Example size limit of 5MB
        toast.error(t('PayloadTooLarge'));
        return;
      }

      await api.put(`/wallet/updateWallet/${id}`, wallet);
      toast.success(t('WalletUpdatedSuccessfully'));
      setTimeout(() => {
        navigate('/wallets');
      }, 1500);
    } catch (error) {
      toast.error(t('ErrorUpdatingWallet'));
    }
  };

  const isRTL = i18n.language === 'ar';

  return (
    <Suspense fallback={<Loading />}>
      <Box p={3} style={{ direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}>
        <ToastContainer />
        <Paper elevation={8} style={{ padding: '15px', marginBottom: '10px', marginLeft: '1%', width: 'calc(100% - 60px)' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: '1%' }}>
            {t('EditWallet')}
          </Typography>
          <div className='formContainer'>
            <form onSubmit={handleUpdateWallet} style={{ marginTop: '15px' }}>
              <TextField
                fullWidth
                label={t('InvestorFullNameEN')}
                name="investorInfo.fullname_en"
                value={wallet.investorInfo.fullname_en}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ style: { borderRadius: '12px' } }}
                disabled={true}
              />
              <TextField
                fullWidth
                label={t('InvestorFullNameAR')}
                name="investorInfo.fullname_ar"
                value={wallet.investorInfo.fullname_ar}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ style: { borderRadius: '12px' } }}
                disabled={true}
              />
              <TextField
                fullWidth
                label={t('amount')}
                name="amount"
                type="number"
                required
                value={wallet.amount}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ style: { borderRadius: '12px' } }}
                sx={{
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e65100'
                    }
                  }
                }}
              />
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="warning"
                  type="submit"
                  sx={{ mr: 2 }}
                >
                  {t('UpdateWallet')}
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
                      color: '#e65100'
                    }
                  }}
                >
                  {t('cancel')}
                </Button>
              </Box>
            </form>
          </div>
        </Paper>
      </Box>
    </Suspense>
  );
};

export default EditWallet;
