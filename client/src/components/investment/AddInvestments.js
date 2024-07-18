import React, { useState, useEffect,Suspense } from 'react';
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
import api from '../../api/axios.js';
import { useTranslation } from 'react-i18next';
import Loading from '../loading.js';


const Addinvestment = () => {
  const navigate = useNavigate();
  const [investment, setinvestment] = useState({
    titleInv: '',
    amount: '',
    currency: '',
    type: '',
    dateInv: '',
    description: '',
    investmentStatus: '',
  });
  const [investment_ar, setinvestment_ar] = useState({
    titleInv_ar: '',
  });
  const { t, i18n } = useTranslation();
  const [currencies, setCurrencies] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() =>{

    const fetchCurrencies = async () => {
      try {
        const response = await api.get(`/currency/getCurrencies/${i18n.language}`);
        setCurrencies(response.data);
      } catch (error) {
        console.error({ message: t('Errorfetchingcurrencies:'), error });
      }
    };

    const fetchTypes = async () => {
      try {
        const response = await api.get(`/types/getTypesByLanguage/${i18n.language}`);
        setTypes(response.data);
      } catch (error) {
        console.error('Error fetching types:', error);
      }
    };

    fetchCurrencies();
    fetchTypes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setinvestment({ ...investment, [name]: value });
  };

  const handleInputChangeAr = (e) => {
    const { name, value } = e.target;
    setinvestment_ar({ ...investment_ar, [name]: value });
  };


  const handleAddinvestment = async (e) => {
    e.preventDefault();
    const fullinvestment = { ...investment, ...investment_ar };
    try {
      await api.post('/inv/createInvestment', fullinvestment);
      toast.success('Investment added successfully');
      setTimeout(() => {
        navigate('/investment');
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
          toast.error('An error occurred');
        }
      } else {
        console.error('Error without a response data');
      }
    }
  };
  const isRTL = i18n.language === 'ar';


  return (
    <Suspense fallback={<Loading />}>
      <Box p={3} style={{ direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}>
      <ToastContainer />
        <Paper elevation={8} style={{ padding: '15px', marginBottom: '10px', marginLeft: '1%', width: 'calc(100% - 60px)' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: '1%' }}>
             {t('AddInvestment')}
          </Typography>
          <form onSubmit={handleAddinvestment} style={{ marginTop: '15px' }}>
          <TextField
            fullWidth
            label="title"
            name="titleInv"
            value={investment.titleInv}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}
          />     
            <TextField
            fullWidth
            label="titleInv_ar"
            name="titleInv_ar"
            value={investment.titleInv_ar}
            onChange={handleInputChangeAr}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}
          />  <TextField
            fullWidth
            label="amount"
            name="amount"
            value={investment.amount}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}
          />
            <TextField
              fullWidth
              select
              label="type"
              name="type"
              value={investment.type}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{ style: { borderRadius: '12px' } }}
            >
              {types.map((type) => (
                <MenuItem key={type._id} value={type._id}>
                  {type.type_en}
                </MenuItem>
              ))}
            </TextField>     
            <TextField
              fullWidth
              select
              required
              label={t("currency")}
              name="currency"
              value={investment.currency}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{ style: { borderRadius: '12px' } }}
            >
              {currencies.map((currency) => (
                <MenuItem key={currency._id} value={currency._id}>
                  {`${currency.symbol} (${currency.symbol_ar})`}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label={t("dateInv")}
              name="dateInv"
              type="date"
              required
              value={investment.dateInv}
              onChange={handleInputChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{ style: { borderRadius: '12px' } }}
            />
             <TextField
            fullWidth
            label="description"
            name="description"
            value={investment.description}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}
          />
            <TextField
              fullWidth
              select
              label="Investment Status"
              name="investmentStatus"
              value={investment.investmentStatus}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{ style: { borderRadius: '12px' } }}
            >
              <MenuItem value="true">true</MenuItem>
              <MenuItem value="false">false</MenuItem>
            </TextField>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="warning"
                type="submit"
                sx={{ mr: 2 }}
              >
                Add investment
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/investment')}
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
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
      </Suspense>
   );
};

export default Addinvestment;
