import React, { useState, useEffect,Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, MenuItem } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/axios';
import { BorderColor, Title } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Loading from '../loading.js';


const Edittypes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [types, settypes] = useState({ type_en: '', type_ar: '', description_en: '' , description_ar: '' });
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchtypes = async () => {
      try {
        const { data } = await api.get(`/types/getTypeById/${id}`);
        settypes(data);
      } catch (error) {
        toast.error(t('Errorfetchingtypes'));
      }
    };
    fetchtypes();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    settypes({ ...types, [name]: value });
  };

  const handleUpdatetypes = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/types/updateType/${id}`, types);
      toast.success(t('typeupdatedsuccessfully'));
      setTimeout(() => {
        navigate('/types');
      }, 1500);
    } catch (error) {
      toast.error(t('Errorupdatingtypes'));
    }
  };

  return (
    <Suspense fallback={<Loading />}>
    <Box p={3}>
      <ToastContainer />
      <Paper elevation={8} style={{ padding: '15px', marginBottom: '10px', marginLeft: '1%', width: 'calc(100% - 60px)' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: '1%' }}>
         {t('Edittypes')} 
        </Typography>
        <div className='formContainer'>
        <form onSubmit={handleUpdatetypes} style={{ marginTop: '15px' }}>
        <TextField
  fullWidth
  label="Title"
  name="type_en"
  value={types.type_en}
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
            label={t("description")}
            name="description_en"
            value={types.description_en}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}

          />        <TextField
  fullWidth
  label={t("title")}
  name="type_ar"
  value={types.type_ar}
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
            label={t("descriptionar")}
            name="description_ar"
            value={types.description_ar}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{ style: { borderRadius: '12px' } }}

          />
         <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
              variant="contained"
              color="warning"
              type="submit"
              sx={{ mr: 2}}
              InputProps={{ style: { borderRadius: '12px' } }}


            >
                {t('UpdateType')}
                </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/types')}
              sx={{
                mr: 2,
                border: '1px solid #ed6c02', 
                borderRadius: '10px',
                color:'black',
                '&:hover': {
                  borderColor: '#e65100',
                  color:'#e65100'
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

export default Edittypes;
