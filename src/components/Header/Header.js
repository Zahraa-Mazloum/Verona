import React, { useState, Suspense } from 'react';
import { AppBar, Toolbar, IconButton, Box, Menu, MenuItem } from '@mui/material';
import { Notifications, AccountCircle, Language } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import i18n from 'i18next';
import  './Header.css';
import Loading from '../loading.js';

const Header = ({ open }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';


  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    setAnchorEl(null);
    navigate('/profile');
  };

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    setAnchorEl(null);
  };

  return (
    <Suspense fallback={<Loading />}>
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'transparent',
        boxShadow: 'none',
        transition: 'padding-left 0.3s',
        paddingLeft: open ? '240px' : '60px',
      }}
    >
      <Toolbar anchor={isArabic ? 'right' : 'left'}
      >
        <Box sx={{ flexGrow: 1 }} />
        <IconButton sx={{ svg: { color: 'rgb(243, 166, 74)' } }}>
          <Notifications />
        </IconButton>
        <IconButton sx={{ svg: { color: 'rgb(243, 166, 74)' } }} onClick={handleProfile}>
          <AccountCircle />
        </IconButton>
        <IconButton sx={{ svg: { color: 'rgb(243, 166, 74)' } }} onClick={handleMenu}>
          <Language />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleLanguageChange('en')}>English</MenuItem>
          <MenuItem onClick={() => handleLanguageChange('ar')}>Arabic</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
    </Suspense>
  );
};

export default Header;
