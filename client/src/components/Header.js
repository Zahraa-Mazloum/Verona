import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Box, Menu, MenuItem, Switch, Typography } from '@mui/material';
import { Notifications, AccountCircle, Language, Translate } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Header = ({ open }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    navigate('/profile');
  };

  const handleLanguageChange = () => {
    setLanguage((prevLang) => (prevLang === 'en' ? 'ar' : 'en'));
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', transition: 'padding-left 0.3s', paddingLeft: open ? '240px' : '60px' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton sx={{ svg: { color: 'rgba(176, 93, 46, .9)' } }}>
          <Notifications />
        </IconButton>
        <IconButton sx={{ svg: { color: 'rgba(176, 93, 46, .9)' } }} onClick={handleMenu}>
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem>
            <Box display="flex" alignItems="center">
              <Typography variant="body1" sx={{ marginRight: 1 }}>
                en
              </Typography>
              <Switch
                checked={language === 'ar'}
                onChange={handleLanguageChange}
                name="languageSwitch"
                color="warning"
                icon={<Language />}
                checkedIcon={<Translate />}
              />
              <Typography variant="body1" sx={{ marginLeft: 1 }}>
                ar
              </Typography>
            </Box>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
