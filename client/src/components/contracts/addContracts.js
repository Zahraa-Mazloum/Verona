import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, MenuItem } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/axios';
import Loading from '../loading.js';

const Addcontract = () => {
  const navigate = useNavigate();
  const [contract, setContract] = useState({
    investorInfo: '',
    amount: '',
    contractTime: '',
    startDate: '',
    investmentStatus: ''
  });
  const [contract_ar, setContractAr] = useState({
    fullname_ar: '',
    contractTime_ar: '',
  });
  const { t, i18n } = useTranslation();
  const [investors, setInvestors] = useState([]);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await api.get(`/admin/allInvestors/${i18n.language}`);
        setInvestors(response.data);
      } catch (error) {
        console.error({ message: t('Errorfetchinginvestors:'), error });
      }
    };

    fetchInvestors();
  }, [i18n.language]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContract({ ...contract, [name]: value });

    if (name === 'contractTime') {
      const contractTime_ar = value === 'year' ? 'سنة' : value === 'month' ? 'شهر' : 'يوم';
      setContractAr({ ...contract_ar, contractTime_ar });
    }
  };

  const handleInputChangeAr = (e) => {
    const { name, value } = e.target;
    setContractAr({ ...contract_ar, [name]: value });
  };

  const handleAddContract = async (e) => {
    e.preventDefault();
    const fullContract = { ...contract, ...contract_ar };
    try {
      await api.post('/contract/newContract', fullContract);
      toast.success(t('Contractaddedsuccessfully'));
      setTimeout(() => {
        navigate('/contract');
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
          toast.error(t('Anerroroccurred'));
        }
      } else {
        console.error({ message: t('Errorwithoutaresponsedata'), error });
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
            {t('AddContract')}
          </Typography>
          <form onSubmit={handleAddContract} style={{ marginTop: '15px' }} >
            <TextField
              fullWidth
              select
              required
              label={t('FullName')}
              name="investorInfo"
              value={contract.investorInfo}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{ style: { borderRadius: '12px' } }}
            >
              {investors.map((investor) => (
                <MenuItem key={investor._id} value={investor._id}>
                  {`${investor.fullname_en} (${investor.fullname_ar})`}
                </MenuItem> 
              ))}
            </TextField>

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
              label={t("StartDate")}
              name="startDate"
              type="date"
              required
              value={contract.startDate}
              onChange={handleInputChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{ style: { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              select
              required
              label={t("ContractTime")}
              name="contractTime"
              value={contract.contractTime}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{ style: { borderRadius: '12px' } }}
            >
              <MenuItem value="year">Year</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="day">day</MenuItem>

            </TextField>
            <TextField
              fullWidth
              select
              required
              label={t("InvestmentStatus")}
              name="investmentStatus"
              value={contract.investmentStatus}
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
                {t('AddContract')}
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

export default Addcontract;
