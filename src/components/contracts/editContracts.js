import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import Loading from '../loading.js';

const EditContract = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState({
    investorInfo: {
      fullname_en: '',
      fullname_ar: ''
    },
    currency: {
      symbol_en: '',
      symbol_ar: ''
    },
    amount: '',
    contractTime: '',
    startDate: '',
    investmentStatus: '',
  });

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const { data } = await api.get(`/contract/investrContract/${id}`);
        const formattedData = {
          ...data,
          startDate: data.startDate ? data.startDate.split('T')[0] : ''
        };
        setContract(formattedData);
      } catch (error) {
        toast.error(t('Errorfetchingcontract'));
      }
    };
    fetchContract();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [mainKey, subKey] = name.split('.');
    if (subKey) {
      setContract(prevState => ({
        ...prevState,
        [mainKey]: {
          ...prevState[mainKey],
          [subKey]: value
        }
      }));
    } else {
      setContract({ ...contract, [name]: value });
    }
  };

  const handleUpdateContract = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/contract/editContract/${id}`, contract);
      toast.success(t('Contractupdatedsuccessfully'));
      setTimeout(() => {
        navigate('/contract');
      }, 1500);
    } catch (error) {
      toast.error(t('Errorupdatingcontract'));
    }
  };
  const isRTL = i18n.language === 'ar';

  return (
    <Suspense fallback={<Loading />}>
      <Box p={3} style={{ direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}>
      <ToastContainer />
        <Paper elevation={8} style={{ padding: '15px', marginBottom: '10px', marginLeft: '1%', width: 'calc(100% - 60px)' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: '1%' }}>
            {t('EditContract')}
          </Typography>
          <div className='formContainer'>
            <form onSubmit={handleUpdateContract} style={{ marginTop: '15px' }}>
              <TextField
                fullWidth
                label={t('fullName')}
                name="investorInfo.fullname_en"
                value={contract.investorInfo.fullname_en}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ style: { borderRadius: '12px' } }}
                disabled={true} 
              />
              <TextField
                fullWidth
                label={t('fullNamear')}
                name="investorInfo.fullname_ar"
                value={contract.investorInfo.fullname_ar}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ style: { borderRadius: '12px' } }}
                disabled={true} 
              />
              <TextField
                fullWidth
                label={t("amount")}
                name="amount"
                type="number"
                required
                value={contract.amount}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ style: { borderRadius: '12px' } }}
              />
              <TextField
                fullWidth
                label={t('currency')}
                name="currency.symbol"
                value={contract.currency.symbol}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ style: { borderRadius: '12px' } }}
                disabled={true} 
              />
              <TextField
                fullWidth
                label={t("contractTime")}
                name="contractTime"
                value={contract.contractTime}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ style: { borderRadius: '12px' } }}
                required
              />
              <TextField
                fullWidth
                label={("StartDate")}
                name="startDate"
                type="date"
                value={contract.startDate}
                onChange={handleInputChange}
                margin="normal"
                required
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{ style: { borderRadius: '12px' } }}
              />
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="warning"
                  type="submit"
                  sx={{ mr: 2 }}
                >
                {t('UpdateContract')}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/contract')}
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

export default EditContract;
