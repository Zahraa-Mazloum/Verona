import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/axios';
import Loading from '../loading.js';
import { useTranslation } from 'react-i18next';


const Editwallet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const { data } = await api.get(`/wallet/getWallet/${id}`);
        setAmount(data.amount);
      } catch (error) {
        toast.error(t('Errorfetchingwallet'));
      }
    };
    fetchWallet();
  }, [id, t]);

  const handleUpdateWallet = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/wallet/updateWallet/${id}`, { amount });
      toast.success(t('walletupdatedsuccessfully'));
      setTimeout(() => {
        navigate('/wallets');
      }, 1500);
    } catch (error) {
      toast.error(t('Errorupdatingwallet'));
    }
  };

  const handleInputChange = (e) => {
    setAmount(e.target.value);
  };

  return (
    <Suspense fallback={<Loading />}>
      <Box p={3}>
        <ToastContainer />
        <Paper elevation={8} style={{ padding: '15px', marginBottom: '10px', marginLeft: '1%', width: 'calc(100% - 60px)' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: '1%' }}>
            {t('Editwallet')}
          </Typography>
          <div className='formContainer'>
            <form onSubmit={handleUpdateWallet} style={{ marginTop: '15px' }}>
              <TextField
                fullWidth
                label={t('amount')}
                name="amount"
                type="number"
                required
                value={amount}
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

export default Editwallet;
