import React, { useEffect } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText,
  IconButton, Divider, useMediaQuery
} from '@mui/material';
import { Home, BarChart, ExitToApp, Person } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import logoImage from '../../images/logo.png';
import expandedLogoImage from '../../images/logoExpand.png';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import Icon from '@mdi/react';
import {
  mdiViewDashboard, mdiFileSign, mdiAccountTie, mdiAccountGroup, mdiCash,
  mdiCurrencyUsd, mdiCashMultiple, mdiBankCircleOutline, mdiCashFast,
  mdiCurrencyBtc, mdiBankOutline, mdiCash100,mdiWalletBifold , mdiCurrencyUsdOff 
} from '@mdi/js';
import './sidebar.css';

const Sidebar = ({ open, setOpen }) => {
  const role = localStorage.getItem('role');
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile, setOpen]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Icon path={mdiViewDashboard} size={1} />, path: '/dashboard' },
    { text: 'Contracts', icon: <Icon path={mdiFileSign} size={1} />, path: '/contract' },
    role === 'admin' && { text: 'Investors', icon: <Icon path={mdiAccountTie} size={1} />, path: '/investor' },
    // { text: 'Employees', icon: <Icon path={mdiAccountGroup} size={1} />, path: '/investment' },
    { text: 'Verona Investments', icon: <Icon path={mdiBankCircleOutline} size={1} />, path: '/investment' },
    { text: 'Investment Types', icon: <Icon path={mdiCashMultiple} size={1} />, path: '/investment' },
    { text: 'Overall Verona Investments', icon: <Icon path={mdiBankOutline} size={1} />, path: '/investment' },
    { text: 'New Investments', icon: <Icon path={mdiCurrencyUsdOff} size={1} />, path: '/investment' },
    { text: 'Currencies', icon: <Icon path={mdiCurrencyBtc} size={1} />, path: '/CurrencyTable' },
    { text: 'Wallets', icon: <Icon path={mdiWalletBifold } size={1} />, path: '/investment' },
  ].filter(Boolean);

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        '& .MuiDrawer-paper': {
          width: open ? 240 : 60,
          transition: 'width 0.3s',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor:'#fdedd7',
          borderColor: '#fef7ee'
        },
      }}
    >
      <IconButton
        sx={{
          position: open ? 'absolute' : 'block',
          right: open ? '20px' : '0',
          top: '30px',
          transform: 'translateY(-50%)',
          padding: 0.2,
          marginTop: open ? '5%' : '',
          marginRight: open ? '-10%' : '0',
          marginBottom: open ? '0' : '7%',
          zIndex: '2',
          '&:hover': {
            color: 'rgba(176, 93, 46, .9)',
          },
        }}
        onClick={handleToggle}
      >
        {open ? <ArrowCircleLeftOutlinedIcon /> : <ArrowCircleRightOutlinedIcon />}
      </IconButton>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 70,
          position: 'relative',
          cursor: 'pointer',
        }}
        onClick={handleToggle}
      >
        <img
          src={open ? logoImage : expandedLogoImage}
          alt="Logo"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            paddingTop: '5%',
            width: open ? '70%' : '40px',
            height: open ? '70%' : '40px',
            paddingLeft: open ? 0 : '10%',
          }}
        />
      </Box>
      <Divider sx={{ mt: 2, backgroundColor: '#d25716' }} />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item, index) => (
          <ListItem
            button
            component={NavLink}
            to={item.path}
            key={index}
            className="navItem"
            activeClassName="active" 
            exact
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={open && item.text} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: 2, backgroundColor: '#d25716' }} />      <ListItem
        button
        onClick={handleLogout}
        sx={{ mt: 'auto' }}
      >
        <ListItemIcon>
          <ExitToApp />
        </ListItemIcon>
        <ListItemText primary={open && 'Logout'} />
      </ListItem>
    </Drawer>
  );
};

export default Sidebar;
