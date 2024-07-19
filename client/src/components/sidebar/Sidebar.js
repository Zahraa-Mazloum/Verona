import React, { useEffect, Suspense } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText,
  IconButton, Divider, useMediaQuery
} from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { NavLink, useNavigate } from 'react-router-dom';
import logoImage from '../../images/logo.png';
import expandedLogoImage from '../../images/logoExpand.png';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import Icon from '@mdi/react';
import { useTranslation } from 'react-i18next';
import {
  mdiViewDashboard, mdiFileSign, mdiAccountTie, mdiBankCircleOutline,
  mdiCashMultiple, mdiBankOutline, mdiCurrencyUsdOff, mdiCurrencyBtc,
  mdiWalletBifold
} from '@mdi/js';
import './sidebar.css';
import Loading from '../loading.js';

const Sidebar = ({ open, setOpen }) => {
  const role = localStorage.getItem('role');
  const investorId = localStorage.getItem('id');
  const isMobile = useMediaQuery('(max-width:600px)');
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const navigate = useNavigate();

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

  const handleNavigation = (path) => {
    if (path === '/InvContract' && investorId) {
      navigate(`/investorContracts/${investorId}`);
    } else {
      navigate(path);
    }
  };

  const menuItems = [
    { text: t('DashBoard'), icon: <Icon path={mdiViewDashboard} size={1} />, path: '/dashboard' },
    { text: t('Contracts'), icon: <Icon path={mdiFileSign} size={1} />, path: role === 'admin' ? '/contract' : '/InvContract' },
    role === 'admin' && { text: t('Investors'), icon: <Icon path={mdiAccountTie} size={1} />, path: '/investor' },
    { text: t('VeronaInvestments'), icon: <Icon path={mdiBankCircleOutline} size={1} />, path: '/investment' },
    { text: t('InvestmentTypes'), icon: <Icon path={mdiCashMultiple} size={1} />, path: '/types' },
    { text: t('OverallVeronaInvestments'), icon: <Icon path={mdiBankOutline} size={1} />, path: '/overallInv' },
    { text: t('NewInvestments'), icon: <Icon path={mdiCurrencyUsdOff} size={1} />, path: '/NewInvestments' },
    { text: t('Currencies'), icon: <Icon path={mdiCurrencyBtc} size={1} />, path: '/CurrencyTable' },
    { text: t('Wallets'), icon: <Icon path={mdiWalletBifold} size={1} />, path: '/wallets' },
  ].filter(Boolean);

  return (
    <Suspense fallback={<Loading />}>
      <Drawer
        anchor={isArabic ? 'right' : 'left'}
        variant="permanent"
        open={open}
        sx={{
          '& .MuiDrawer-paper': {
            width: open ? 240 : 60,
            transition: 'width 0.3s',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fdedd7',
            borderColor: '#fef7ee',
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
              onClick={() => handleNavigation(item.path)}
              key={index}
              className={`navItem ${isArabic ? 'rtl' : ''}`}
            >
              {isArabic && <ListItemText primary={open && item.text} />}
              <ListItemIcon>{item.icon}</ListItemIcon>
              {!isArabic && <ListItemText primary={open && item.text} />}
            </ListItem>
          ))}
        </List>
        <Divider sx={{ mt: 2, backgroundColor: '#d25716' }} />
        <ListItem
          button
          onClick={handleLogout}
          sx={{ mt: 'auto' }}
          className={isArabic ? 'rtl' : ''}
        >
          {isArabic && <ListItemText primary={open && t('Logout')} />}
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          {!isArabic && <ListItemText primary={open && t('Logout')} />}
        </ListItem>
      </Drawer>
    </Suspense>
  );
};

export default Sidebar;
