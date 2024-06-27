import React, { useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider, useMediaQuery } from '@mui/material';
import { Home, BarChart, ExitToApp, Person } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import logoImage from '../../images/logo.png';
import expandedLogoImage from '../../images/logoExpand.png';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import Icon from '@mdi/react';
import { mdiViewDashboard , mdiFileSign , mdiAccountTie ,mdiAccountGroup, mdiCash, mdiCurrencyUsd, mdiCashMultiple, mdiBankCircleOutline, mdiCashFast, mdiCurrencyBtc , mdiBankOutline , mdiCash100   } from '@mdi/js';
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

  const menuItems = [
    { text: 'Dashboard', icon: <Icon path={mdiViewDashboard} size={1}/>, path: '/dashboard' },   
    { text: 'Contracts', icon: <Icon path={mdiFileSign} size={1}/>, path: '/contract' },
    role === 'admin' && { text: 'Investors', icon: <Icon path={mdiAccountTie } size={1} />, path: '/investor' },
    { text: 'Employees', icon: <Icon path={mdiAccountGroup } size={1} />, path: '/investment' },
    { text: 'Company Expenses', icon: <Icon path={mdiCash } size={1} />, path: '/investment' },
    { text: 'Costs Types', icon: <Icon path={mdiCurrencyUsd } size={1} />, path: '/investment' },
    { text: 'Invesment', icon: <Icon path={mdiBankCircleOutline  } size={1} />, path: '/investment' },
    { text: 'Invesment type', icon: <Icon path={mdiCashMultiple  } size={1} />, path: '/investment' },
    { text: 'Profit Loss',icon: <Icon path={mdiCashFast } size={1} /> , path: '/investment' },
    { text: 'Currencies',icon: <Icon path={mdiCurrencyBtc } size={1} /> , path: '/CurrencyTable' },
    { text: 'Overall Invesments',icon: <Icon path={mdiBankOutline  } size={1} /> , path: '/investment' },
    { text: 'Overall Profit',icon: <Icon path={mdiCash100  } size={1} /> , path: '/investment' },



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
          marginTop: open ? '5%' : '-2%',
          marginRight: open ? '-10%' : '0',
          marginBottom: open ? '0' : '5%',
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
            width: open ? '60%' : '40px',
            height: open ? '60%' : '40px',
            paddingLeft: open ? 0 : '10%',
          }}
        />
      </Box>
      <Divider sx={{ mt: 2 }} />
      <List>
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
        <Divider sx={{ mt: 2 , marginTop: '90%'}} />
        <ListItem
          button
          component={NavLink}
          to="/logout"
          className="navItem"
          activeClassName="active"
          exact
        >
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary={open && 'Logout'} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
