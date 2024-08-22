import React, { useEffect, useState, Suspense } from 'react';
import api from '../../api/axios.js';
import { Typography, Container, Box, Paper } from '@mui/material';
import Loading from '../../components/loading.js';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    document.title = "Profile";
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await api.get('/user/me', config);
        setUserData(response.data);
      } catch (err) {
        console.log(error);
        console.error('Profile fetch error:', err.message);
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              My Profile
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            {error ? (
              <Typography variant="body1" color="error" align="center">
                {error}
              </Typography>
            ) : (
              userData && (
                <div>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    <strong>Full Name (English):</strong> {userData.fullname_en}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Full Name (Arabic):</strong> {userData.fullname_ar}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Email:</strong> {userData.email}
                  </Typography>
                </div>
              )
            )}
          </Box>
        </Paper>
      </Container>
    </Suspense>
  );
};

export default Profile;
