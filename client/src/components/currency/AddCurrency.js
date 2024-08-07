import React, { useState , Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, MenuItem } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/axios';
import Loading from '../loading.js';
import { useTranslation } from 'react-i18next';


const AddCurrency = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState({ name: '', symbol: '', description: '' });
  const [currency_ar, setCurrency_ar] = useState({ name_ar: '', symbol_ar: '', description_ar: '' });
  const { t, i18n } = useTranslation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrency({ ...currency, [name]: value });
  };

  const handleInputChangeAr = (e) => {
    const { name, value } = e.target;
    setCurrency_ar({ ...currency_ar, [name]: value });
  };

  const handleAddCurrency = async (e) => {
    e.preventDefault();
    const fullCurrency = { ...currency, ...currency_ar };
    try {
      await api.post('/currency/createCurrency', fullCurrency);
      toast.success(t('Currencyaddedsuccessfully'));
      setTimeout(() => {
        navigate('/currencyTable');
      }, 1500);
    } catch (error) {
      toast.error(t('Erroraddingcurrency'));
    }
  };
  const isRTL = i18n.language === 'ar';

  return (
    <Suspense fallback={<Loading />}>

<Box p={3} style={{ direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}>
<ToastContainer />
      <Paper elevation={8} style={{ padding: '15px', marginBottom: '10px', marginLeft: '1%', width: 'calc(100% - 60px)' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: '1%' }}>
          {t('addCurrency')}
        </Typography>
        <form onSubmit={handleAddCurrency} style={{ marginTop: '15px' }}>
          <TextField
            fullWidth
            label={t('name')}
            name="name"
            value={currency.name}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}
          />
          <TextField
            fullWidth
            select
            label={t('symbol')}
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
            label={t('description')}
            name="description"
            value={currency.description}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}
          />
          <TextField
            fullWidth
            label="الاسم"
            name="name_ar"
            value={currency_ar.name_ar}
            onChange={(event) => {
              const arabicRegex = /^[\u0600-\u06FF\s]+$/;
              if (!arabicRegex.test(event.target.value)) {
                toast.error(t("PleaseenteravalidArabicname"));
              } else {
                handleInputChangeAr(event);
              }
            }}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}
          />
          <TextField
            fullWidth
            select
            label="الرمز"
            name="symbol_ar"
            value={currency_ar.symbol_ar}
            onChange={handleInputChangeAr}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}
          >
            <MenuItem value="د.إ">د.إ</MenuItem>
            <MenuItem value="ريال عماني">ريال عماني</MenuItem>
            <MenuItem value="$">$</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="الوصف"
            name="description_ar"
            value={currency_ar.description_ar}
            onChange={handleInputChangeAr}
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
          {t('addCurrency')}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/currencyTable')}
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
                {t('cancel')}
                </Button>
          </Box>
        </form>
      </Paper>
    </Box>
    </Suspense>

  );
};

export default AddCurrency;
