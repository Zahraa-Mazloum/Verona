import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Box, Badge, Menu, MenuItem } from '@mui/material';
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
  const [userInteracted, setUserInteracted] = useState(false);
  const navigate = useNavigate();
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
    const socket = io('http://localhost:5001');
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
    if (userInteracted) {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(error => console.error('Audio playback failed:', error));
    } else {
      console.log('User has not interacted with the document yet. Skipping audio playback.');
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

  return (
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
        <IconButton sx={{ svg: { color: 'rgb(243, 166, 74)' } }} onClick={handleMenu}>
          <Badge badgeContent={unreadCount} color="warning">
            <Notifications />
          </Badge>
        </IconButton>
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
  );
};

export default Header;
