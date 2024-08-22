import React, { useState, useEffect, Suspense } from 'react';
import { AppBar, Toolbar, IconButton, Box, Menu, MenuItem, Badge, Drawer, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Notifications, AccountCircle, Language } from '@mui/icons-material';
import { useNavigate ,useLocation,useParams  } from 'react-router-dom';
import i18n from 'i18next';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';
import  CurrencySwitcher  from './CurrencySwitcher.js';
import ContractsTable from '../contracts/contractTable.js';
import InvestorInv from '../investorsINv/investorInv.js';


const Header = ({ open ,onCurrencyChange  }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';
  const { t } = useTranslation();
  const role = localStorage.getItem('role');
  const investorId = localStorage.getItem('id')
  const [currency, setCurrency] = useState('USD');
  const [conversionRate, setConversionRate] = useState(1);
  const location = useLocation();
  const { id } = useParams();
  const storedId = localStorage.getItem('id');


  const handleCurrencyChange = (selectedCurrency, rate) => {
  console.log("header", selectedCurrency, rate);    setCurrency(selectedCurrency);
    setConversionRate(rate);
  };
  const shouldRenderContractTable = () => {
    const allowedRoutes = ['/contract'];
    return allowedRoutes.includes(location.pathname);
  };

  const shouldRenderInvContractTable = () => {
    const baseRoute = '/myInvestments';
    return location.pathname === `${baseRoute}/${storedId}`;
  };

  useEffect(() => {
    const handleUserInteraction = () => setUserInteracted(true);
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    const socket = io('https://verona-cfiw.onrender.com');

    socket.on('newNotification', (notification) => {
      // Check if the notification is relevant to the current user role
      if ((role === 'admin' && notification.type === 'admin') ||
          (role === 'investor' && notification.type === 'investor')) {
        setNotifications((prevNotifications) => [notification, ...prevNotifications]);
        setUnreadCount((prevCount) => prevCount + 1);
        playNotificationSound();
      }
    });

    fetchNotifications();

    return () => {
      socket.disconnect();
    };
  }, [role]);

  const fetchNotifications = async () => {
    try {
      const endpoint = role === 'admin' ? '/admin/notifications' : `/investors/notifications/${investorId}`;
      const { data } = await api.get(endpoint);
      setNotifications(data);
      const unread = data.filter(notification => !notification.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const playNotificationSound = () => {
    if (role === 'admin') {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(error => console.error('Audio playback failed:', error));
    } else {
      console.log('Notification sound only available for admins');
    }
  };

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

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  const handleMarkAsRead = async () => {
    if (selectedNotification) {
      try {
        await api.put(`/admin/notifications/${selectedNotification._id}`, { isRead: true });
        fetchNotifications();
        setSelectedNotification(null);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const handleInvMarkAsRead = async () => {
    if (selectedNotification) {
      try {
        await api.put(`/investors/readnotifications/${selectedNotification._id}`, { isRead: true });
        fetchNotifications();
 setSelectedNotification(null);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const handleNotificationDeclined = async () => {
    if (selectedNotification) {
      try {
        await api.put(`/admin/notificationsRejected/${selectedNotification._id}`, { isRead: true });
        fetchNotifications();
        setSelectedNotification(null);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  return (
    <Suspense>
      <AppBar
        position="static"
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          transition: 'padding-left 0.3s',
          paddingLeft: open ? '240px' : '60px',
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
            <IconButton sx={{ svg: { color: 'rgb(243, 166, 74)' } }} onClick={toggleDrawer}>
              <Badge badgeContent={unreadCount} color="warning">
                <Notifications />
              </Badge>
            </IconButton>
       
            <CurrencySwitcher onCurrencyChange={handleCurrencyChange} />
            <IconButton sx={{ svg: { color: 'rgb(243, 166, 74)' } }} onClick={handleMenu}>
            <Language />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={() => handleLanguageChange('en')}>English</MenuItem>
            <MenuItem onClick={() => handleLanguageChange('ar')}>Arabic</MenuItem>
          </Menu>
          <IconButton sx={{ svg: { color: 'rgb(243, 166, 74)' } }} onClick={handleProfile}>
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
    <Box sx={{ width: 300, padding: 2 }}>
      <h2>{role === 'admin' ? t('Admin Notifications') : t('Investor Notifications')}</h2>
      <List>
        {notifications.map((notification) => (
          <ListItem button key={notification._id} onClick={() => handleNotificationClick(notification)}>
            <ListItemText
              primary={notification.message}
              secondary={new Date(notification.createdAt).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  </Drawer>
      <Dialog open={!!selectedNotification} onClose={() => setSelectedNotification(null)}>
        <DialogTitle>{t('Notification Details')}</DialogTitle>
        <DialogContent>
          <p>{selectedNotification?.message}</p>
          <p style={{ fontSize: '18px', color: 'gray' }}>
            {new Date(selectedNotification?.createdAt).toLocaleString()}
          </p>
        </DialogContent>
        {role === 'admin' ? (
  <DialogActions>
    <Button onClick={handleMarkAsRead} 
      variant="contained"
      color="warning"
      sx={{ mr: 2 }}
    >
      {t('Accept')}
    </Button>
    <Button onClick={handleNotificationDeclined} 
       sx={{
        mr: 2,
        border: '1px solid #ed6c02',
        borderRadius: '10px',
        color: 'black',
        '&:hover': {
          borderColor: '#e65100',
          color: '#e65100',
        },
      }}>
    {t('Reject')}    
    </Button>
  </DialogActions>
) : (
  <DialogActions>
  <Button onClick={handleInvMarkAsRead} 
    variant="contained"
    color="warning"
    sx={{ mr: 2 }}
  >
    {t('Read')}
  </Button>
  <Button onClick={() => setSelectedNotification(null)} color="secondary"
  sx={{
      mr: 2,
      border: '1px solid #ed6c02',
      borderRadius: '10px',
      color: 'black',
      '&:hover': {
        borderColor: '#e65100',
        color: '#e65100',
      },
    }}>
  {t('Cancel')}    
  </Button>
</DialogActions>
)}
      </Dialog>
      {shouldRenderContractTable() && (
      <ContractsTable selectedCurrency={currency} conversionRate={conversionRate} />
    )}
          {shouldRenderInvContractTable() && (
      <InvestorInv selectedCurrency={currency} conversionRate={conversionRate} />
    )}
    </Suspense>
  );
};

export default Header;