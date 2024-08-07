import React, { useState, useEffect, Suspense } from 'react';
import { AppBar, Toolbar, IconButton, Box, Menu, MenuItem, Badge, Drawer, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Notifications, AccountCircle, Language } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import i18n from 'i18next';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';

const Header = ({ open }) => {
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
    // const socket = io('http://localhost:5001');
    const socket = io('https://verona-cfiw.onrender.com');

    socket.on('newNotification', (notification) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
      setUnreadCount((prevCount) => prevCount + 1);
      playNotificationSound();
    });

    fetchNotifications();

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/admin/notifications');
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
          {role === 'admin' && (

          <IconButton sx={{ svg: { color: 'rgb(243, 166, 74)' } }} onClick={toggleDrawer}>
            <Badge badgeContent={unreadCount} color="warning">
              <Notifications />
            </Badge>
          </IconButton>
          )}
          <IconButton sx={{ svg: { color: 'rgb(243, 166, 74)' } }} onClick={handleProfile}>
            <AccountCircle />
          </IconButton>
          <IconButton sx={{ svg: { color: 'rgb(243, 166, 74)' } }} onClick={handleMenu}>
            <Language />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={() => handleLanguageChange('en')}>English</MenuItem>
            <MenuItem onClick={() => handleLanguageChange('ar')}>Arabic</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 300, padding: 2 }}>
          <h2>Admin Notifications</h2>
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
        <DialogTitle>Notification Details</DialogTitle>
        <DialogContent>
          <p>{selectedNotification?.message}</p>
          <p style={{ fontSize: '18px', color: 'gray' }}>
            {new Date(selectedNotification?.createdAt).toLocaleString()}
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMarkAsRead} 
            variant="contained"
            color="warning"
            sx={{ mr: 2 }}
          >
            {t('MarkasRead')}
          </Button>
          <Button onClick={() => setSelectedNotification(null)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Suspense>
  );
};

export default Header;