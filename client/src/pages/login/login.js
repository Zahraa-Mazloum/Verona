import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Box, Typography, TextField, InputAdornment, IconButton, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import loginImage from '../../images/login.png';
import logoImage from '../../images/logo.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Login";
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/user/login', formData);
      toast.success("Login successful!");
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      window.location.href = '/dashboard'; 

    } catch (err) {
      console.error('Login error:', err.response.data);
      setError(err.response.data.message);
      toast.error("Email/Password invalid!");

    }
    setLoading(false);
  };

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Card sx={{ display: 'flex', width: '100%', maxWidth: '900px', minHeight: '500px', borderRadius: '16px', boxShadow: '0 4px 8px rgba(241, 108, 29, 0.2), 0 6px 20px rgba(241, 108, 29, 0.19)' }}>
      <Grid container>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image={loginImage}
              alt="Login Image"
              sx={{
                height: '100%',
                objectFit: 'cover',
                animation: 'upDown 3s ease-in-out infinite',
                '@keyframes upDown': {
                  '0%, 100%': {
                    transform: 'translateY(0)',
                  },
                  '50%': {
                    transform: 'translateY(-20px)',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CardContent sx={{ width: '100%', p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <img src={logoImage} alt="Logo" style={{width: '160px',  maxWidth: '500px' }} />
              </Box>
              {error && (
                <Typography variant="body1" color="error" align="center" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
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
                  {loading ? 'Checking...' : 'Login'}
                </Button>
              </form>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default Login;
