import React, { useState , Suspense} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  MenuItem
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/axios';
import Loading from '../loading.js';
const AddInvestor = () => {
  const navigate = useNavigate();
  const [investor, setInvestor] = useState({
    fullname_en: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    password: '',
    role: 'investor',
    status: '',
    passportNumber: '',
    passportExpiryDate: '',
    passportPhoto: null
  });
  const [investor_ar, setInvestor_ar] = useState({
    fullname_ar: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvestor({ ...investor, [name]: value });
  };

  const handleInputChangeAr = (e) => {
    const { name, value } = e.target;
    setInvestor_ar({ ...investor_ar, [name]: value });
  };
  const { t, i18n } = useTranslation();

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.size <= 5 * 1024 * 1024) {
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        setInvestor({ ...investor, passportPhoto: file });
      } else {
        toast.error(t('photoError'));
        e.target.value = null;
      }
    } else {
      toast.error(t('photoSize'));
      e.target.value = null;
    }
  };

  const handleAddInvestor = async (e) => {
    e.preventDefault();

    const fullInvestor = { ...investor, ...investor_ar };
    const formData = new FormData();
    Object.keys(fullInvestor).forEach((key) => {
      formData.append(key, fullInvestor[key]);
    });

    try {
      await api.post('/admin/registration', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Investor added successfully');
      setTimeout(() => {
        navigate('/investor');
      }, 1500);
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || 'An error occurred';
        toast.error(errorMessage);
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
          {t('AddInvestor')}
        </Typography>
        <form onSubmit={handleAddInvestor} style={{ marginTop: '15px' }}>
          <TextField
            fullWidth
            label={t('FullName')}
            name="fullname_en"
            value={investor.fullname_en}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}
          />
          <TextField
            fullWidth
            label={t('email')}
            name="email"
            value={investor.email}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}
          />
          <TextField
            fullWidth
            label={t('phoneNumber')}
            name="phoneNumber"
            value={investor.phoneNumber}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}
          />
      <TextField
  fullWidth
  label={t('dateOfBirth')}
  name="dateOfBirth"
  value={investor.dateOfBirth}
  type="date"
  onChange={handleInputChange}
  margin="normal"
  InputLabelProps={{ shrink: true }}
  InputProps={{ style: { borderRadius: '12px' } }}
/>
    
          
          <TextField
            fullWidth
            label={t('password')}
            name="password"
            type="password"
            value={investor.password}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}
          />
          {/* <TextField
            fullWidth
            select
            label="Active"
            name="status"
            value={investor.status}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}
          >
            <MenuItem value="active">True</MenuItem>
            <MenuItem value="inactive">False</MenuItem>
          </TextField> */}
          <TextField
            fullWidth
            label={t('passportNumber')}
            name="passportNumber"
            value={investor.passportNumber}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}
          />
          <TextField
            fullWidth
            label={t('passportExpiryDate')}
            name="passportExpiryDate"
            value={investor.passportExpiryDate}
            type="date"
            onChange={handleInputChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            InputProps={{ style: { borderRadius: '12px' } }}
          />
          <TextField
            fullWidth
            type="file"
            name="passportPhoto"
            onChange={handleFileChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            InputProps={{ style: { borderRadius: '12px' } }}
          />
          <TextField
            fullWidth
            label={t('fullNamear')}
            name="fullname_ar"
            value={investor_ar.fullname_ar}
            onChange={(event) => {
              const arabicRegex = /^[\u0600-\u06FF\s]+$/;
              if (!arabicRegex.test(event.target.value)) {
                toast.error("Please enter a valid Arabic name");
              } else {
                handleInputChangeAr(event);
              }
            }}
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
                              {t('AddInvestor')}

        
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/investor')}
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

export default AddInvestor;