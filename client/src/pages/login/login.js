import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Container, Box, Typography, TextField, InputAdornment, IconButton, Button, Grid, Card, CardContent } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import logoImage from '../../images/logo.png';
import backgroundImage from '../../images/login.png';

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
  const role = localStorage.getItem('role')
  const investorId = localStorage.getItem('id')

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
      const role = response.data.role;
      const investorId = response.data._id;
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', role);
      localStorage.setItem('id', investorId);
      if (role === "admin") {
        window.location.href = '/dashboard';
      } else if (role === "investor") {
        window.location.href = `/invdashboard/${investorId}`;
      }

    } catch (err) {
      console.error('Login error:', err.response.data);
      setError(err.response.data.message);
      toast.error("Email/Password invalid!");

    }
    setLoading(false);
  };

  return (
    <Container 
    maxWidth="100vw" 
    maxHeight="100vh" 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >
      <Card 
        sx={{ 
          display: 'flex', 
          width: '100%', 
          maxWidth: '500px', 
          borderRadius: '16px', 
          background: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(10px)', 
          border: '1px solid rgba(255, 255, 255, 0.2)', 
          boxShadow: 'none',
        }}
      >
        <Grid container>
          <Grid item xs={12} md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CardContent sx={{ width: '100%', p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <img src={logoImage} alt="Logo" style={{ width: '160px', maxWidth: '500px' }} />
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
                  sx={{
                    mb: 2,
                    '& label': { color: '#e8fdfe' }, 
                    "& .MuiOutlinedInput-root": {
                      color: "#e8fdfe",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e8fdfe",
                        borderWidth: "2px",
                      },
                      "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#e8fdfe",
                          borderWidth: "3px",
                        },
                      },
                      "& .MuiInputLabel-outlined": {
                        color: "#e8fdfe",
                      
                        "&.Mui-focused": {
                          color: "#e8fdfe",
                        },
                      },
                    },
                  }}
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
                  sx={{ mb: 2 ,
                    '& label': { color: '#e8fdfe' }, 
                    "& .MuiOutlinedInput-root": {
                    color: "#e8fdfe",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e8fdfe",
                      borderWidth: "2px",
                    },
                    "&.Mui-focused": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e8fdfe",
                        borderWidth: "3px",
                      },
                    },
                    "& .MuiInputLabel-outlined": {
                      color: "#e8fdfe",
                      "&.Mui-focused": {
                        color: "#e8fdfe",
                      },
                    },
                  },
                }}
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
              <Typography variant="body2" align="center" sx={{ mt: 1 , color:"#e8fdfe" }}>
  Don't have an account? <Link to="/register" style={{ color: '#e8fdfe' }}>Register as Investor</Link>
</Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default Login;
