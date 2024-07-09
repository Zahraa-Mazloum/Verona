  import React, { useState } from 'react';
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
  import api from '../../api/axios';

  const AddInvestor = () => {
    const navigate = useNavigate();
    const [investor, setInvestor] = useState({
      fullname_en: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: null,
      password: '',
      role: 'investor',
      status: '',
      passportNumber: '',
      passportExpiryDate: null,
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

    const handleDateChange = (name, date) => {
      setInvestor({ ...investor, [name]: date });
      setInvestor_ar({ ...investor_ar, [name]: date });
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];

      if (file && file.size <= 5 * 1024 * 1024) {
        if (file.type === 'image/jpeg' || file.type === 'image/png') {
          setInvestor({ ...investor, passportPhoto: file });
          setInvestor_ar({ ...investor_ar, passportPhoto: file });
        } else {
          toast.error('Please select a valid image file (JPEG or PNG) smaller than 5 MB.');
          e.target.value = null;
        }
      } else {
        toast.error('Please select a file smaller than 5 MB.');
        e.target.value = null;
      }
    };

    const handleAddInvestor = async (e) => {
      e.preventDefault();
    
      const formData = new FormData();
      Object.keys(investor).forEach(key => {
        formData.append(key, investor[key]);
      });
      Object.keys(investor_ar).forEach(key => {
        formData.append(key, investor_ar[key]);
      });
    
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}, ${pair[1]}`);
      }
    
      try {
        await api.post('/admin/registration', formData,{
          headers: {
            'Content-Type': 'multipart/form-data',
          },      }
        );
        toast.success('Investor added successfully');
        setTimeout(() => {
          navigate('/investor');
        }, 1500);
      } catch (error) {
        if (error.response && error.response.data) {
          const errorResponseData = error.response.data;
          const parser = new DOMParser();
          const doc = parser.parseFromString(errorResponseData, 'text/html');
          const preContent = doc.querySelector('pre').innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
          const errorMessage = preContent.split('\n')[0];
    
          toast.error(errorMessage);
        } else {
          console.error('Error without a response data');
        }
      }
    };  

    return (
        <Box p={3}>
          <ToastContainer />
          <Paper elevation={8} style={{ padding: '15px', marginBottom: '10px', marginLeft: '1%', width: 'calc(100% - 60px)' }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: '1%' }}>
              Add Investor
            </Typography>
            <form onSubmit={handleAddInvestor} style={{ marginTop: '15px' }}>
              <TextField
                fullWidth
                label="Full Name (EN)"
                name="fullname_en"
                value={investor.fullname_en}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ style: { borderRadius: '12px' } }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={investor.email}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ style: { borderRadius: '12px' } }}
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={investor.phoneNumber}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ style: { borderRadius: '12px' } }}
              />  <TextField
                fullWidth
                label="Date of Birth"
                name="phoneNudateOfBirthmber"
                value={investor.dateOfBirth}
                type='date'
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ style: { borderRadius: '12px' } }}
              />
   
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={investor.password}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ style: { borderRadius: '12px' } }}
              />
              <TextField
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
              </TextField>
              <TextField
                fullWidth
                label="Passport Number"
                name="passportNumber"
                value={investor.passportNumber}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ style: { borderRadius: '12px' } }}
              />        <TextField
                fullWidth
                label="Passport Expiry Date"
                name="passportExpiryDate"
                value={investor.passportExpiryDate}
                onChange={handleInputChange}
                margin="normal"
                type='date'
                InputProps={{ style: { borderRadius: '12px' } }}
              />
              <TextField
                fullWidth
                type="file"
                label="Passport Photo"
                name="passportPhoto"
                onChange={handleFileChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                InputProps={{ style: { borderRadius: '12px' } }}
              />
              <TextField
                fullWidth
                label="Full Name (AR)"
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
                  Add Investor
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
                  Cancel
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
    );
  };

  export default AddInvestor;

