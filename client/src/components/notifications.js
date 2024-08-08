import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import api from '../../api/axios';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/admin/notifications', {
        timeout: 10000, 
      });
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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
    <div>
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

        {/* <Dialog open={!!selectedNotification} onClose={() => setSelectedNotification(null)}>
          <DialogTitle>Notification Details</DialogTitle>
          <DialogContent>
            <p>{selectedNotification?.message}</p>
            <p>{new Date(selectedNotification?.createdAt).toLocaleString()}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleMarkAsRead} color="primary">
              Mark as Read
            </Button>
            <Button onClick={() => setSelectedNotification(null)} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog> */}
    </div>
  );
};

export default Notification;
