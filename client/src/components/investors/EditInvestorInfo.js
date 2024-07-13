import React, { useState, useEffect,Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/axios';
import Loading from '../loading.js';

const EditInvestor = () => {
  const { id } = useParams();
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
    fullname_ar: '',
    passportPhoto: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchInvestor = async () => {
      try {
        const { data } = await api.get(`/admin/userProfile/${id}`);
        setInvestor({
          ...data,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
          passportExpiryDate: data.passportExpiryDate ? new Date(data.passportExpiryDate).toISOString().split('T')[0] : '',
        });
      } catch (error) {
        toast.error('Error fetching investor');
      }
    };
    fetchInvestor();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvestor({ ...investor, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5 MB');
    } else {
      setSelectedFile(file);
    }
  };
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleUpdateInvestor = async (e) => {
    e.preventDefault();
    try {
      if (selectedFile) {
        const base64File = await convertToBase64(selectedFile);
        investor.passportPhoto = base64File;
      }
      await api.put(`/admin/updateUser/${id}`, investor);
      toast.success('Investor updated successfully');
      setTimeout(() => {
        navigate('/investor');
      }, 1500);
    } catch (error) {
      toast.error('Error updating investor');
    }
  };

  return (
    <Suspense fallback={<Loading />}>
    <Box p={3}>
      <ToastContainer />
      <Paper elevation={8} style={{ padding: '15px', marginBottom: '10px', marginLeft: '1%', width: 'calc(100% - 60px)' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: '1%' }}>
          Edit Investor
        </Typography>
        <div className='formContainer'>
          <form onSubmit={handleUpdateInvestor} style={{ marginTop: '15px' }}>
            <TextField
              fullWidth
              label="Full Name (English)"
              name="fullname_en"
              value={investor.fullname_en}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{ style: { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              label="Full Name (Arabic)"
              name="fullname_ar"
              value={investor.fullname_ar}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{ style: { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={investor.email}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{ style: { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={investor.phoneNumber}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{ style: { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              value={investor.dateOfBirth}
              onChange={handleInputChange}
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
              InputProps={{ style: { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              value={investor.password}
              onChange={handleInputChange}
              margin="normal"
              type="password"
              required
              InputProps={{ style: { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              label="Status"
              name="status"
              value={investor.status}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{ style: { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              label="Passport Number"
              name="passportNumber"
              value={investor.passportNumber}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{ style: { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              label="Passport Expiry Date"
              name="passportExpiryDate"
              value={investor.passportExpiryDate}
              onChange={handleInputChange}
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
              required
              InputProps={{ style: { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              label="Passport Photo"
              name="passportPhoto"
              type="file"
              onChange={handleFileChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              InputProps={{ style: { borderRadius: '12px' } }}
            />
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="warning"
                type="submit"
                sx={{ mr: 2 }}
              >
                Update Investor
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
                    color: '#e65100'
                  }
                }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </div>
      </Paper>
    </Box>
    </Suspense>
  );
};

export default EditInvestor;
