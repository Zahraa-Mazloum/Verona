import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, MenuItem } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import Loading from '../loading.js';

const Addtypes = () => {
  const navigate = useNavigate();
  const [types, settypes] = useState({ type_en: '', description_en: '' });
  const [types_ar, settypes_ar] = useState({ type_ar: '', description_ar: '' });
  const { t, i18n } = useTranslation();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    settypes({ ...types, [name]: value });
  };

  const handleInputChangeAr = (e) => {
    const { name, value } = e.target;
    settypes_ar({ ...types_ar, [name]: value });
  };

  const handleAddtypes = async (e) => {
    e.preventDefault();
    const fulltypes = { ...types, ...types_ar };
    try {
      await api.post('/types/addInvestmentType', fulltypes);
      toast.success(t('typeaddedsuccessfully'));
      setTimeout(() => {
        navigate('/types');
      }, 1500);
    } catch (error) {
      toast.error(t('Erroraddingtypes'));
    }
  };

  return (
    <Suspense fallback={<Loading />}>
    <Box p={3}>
      <ToastContainer />
      <Paper elevation={8} style={{ padding: '15px', marginBottom: '10px', marginLeft: '1%', width: 'calc(100% - 60px)' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: '1%' }}>
          {t('Addtype')}
        </Typography>
        <form onSubmit={handleAddtypes} style={{ marginTop: '15px' }}>
          <TextField
            fullWidth
            label={t("title")}
            name="type_en"
            value={types.type_en}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}
          />
          <TextField
            fullWidth
            label={t("desceiption")}
            name="description_en"
            value={types.description_en}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}
          />
          <TextField
            fullWidth
            label={t("titlear")}
            name="type_ar"
            value={types_ar.type_ar}
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
          <TextField
            fullWidth
            label={t("descriptionar")}
            name="description_ar"
            value={types_ar.description_ar}
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
                {t('AddType')}
                </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/types')}
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

export default Addtypes;
