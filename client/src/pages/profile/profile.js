import React, { useEffect, useState,Suspense } from 'react';
import api from '../../api/axios';
import { Typography, Container, Box } from '@mui/material';
import Loading from '../../components/loading.js';


const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    document.title = "Profile";
  },[]);
 
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
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          My Profile
        </Typography>
        {error ? (
          <Typography variant="body1" color="error" align="center">
            {error}
          </Typography>
        ) : (
          userData && (
            <div>
              <Typography variant="body1">
                <strong>Full Name (English):</strong> {userData.fullname_en}
              </Typography>
              <Typography variant="body1">
                <strong>Full Name (Arabic):</strong> {userData.fullname_ar}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {userData.email}
              </Typography>
            </div>
          )
        )}
      </Box>
    </Container>
    </Suspense>
  );
};

export default Profile;
