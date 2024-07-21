import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api/axios.js';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RegisterInvestor = () => {
  const [formData, setFormData] = useState({
    fullname_en: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    password: '',
    passportNumber: '',
    passportExpiryDate: '',
    passportPhoto: null,
    fullname_ar: '',
    role: 'investor',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [t, i18next] = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, passportPhoto: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    for (let key in formData) {
      form.append(key, formData[key]);
    }

    try {
      await api.post('/admin/registration', form);
      toast.success(t('Registrationsuccessful'));
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      console.error('Registration error:', err.response.data);
      toast.error(t('Registrationfailed'));
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {t('RegisterasInvestor')}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={t('FullName')}
            name="fullname_en"
            value={formData.fullname_en}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('email')}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('phoneNumber')}
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('dateOfBirth')}
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('password')}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('passportNumber')}
            name="passportNumber"
            value={formData.passportNumber}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('passportExpiryDate')}
            name="passportExpiryDate"
            type="date"
            value={formData.passportExpiryDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('fullNamear')}
            name="fullname_ar"
            value={formData.fullname_ar}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <span>Passport Photo </span>
          <input
            accept="image/*"
            id="passportPhoto"
            type="file"
            onChange={handleFileChange}
            required
            style={{ marginBottom: '16px' }}
          />
          {/* <label htmlFor="passportPhoto">
            <Button variant="contained" component="span">
            {t('UploadPassportPhoto')}
            </Button>
          </label> */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: '#f16c1d',
              '&:hover': {
                backgroundColor: '#d45b1a',
              },
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <ToastContainer />
      </Box>
    </Container>
  );
};

export default RegisterInvestor;
