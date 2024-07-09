import React, { useEffect, useState } from "react";
import { CssBaseline, Box } from "@mui/material";
import Sidebar from '../components/sidebar/Sidebar';
import Header from './Header/Header';
import "../App.css";
import { useTranslation } from 'react-i18next';

function Layout({ children }) {
  const [userRole, setUserRole] = useState(null);
  const [open, setOpen] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar open={open} setOpen={setOpen} userRole={userRole} />
      <Box 
        sx={{ 
          flexGrow: 1, 
          transition: 'padding-left 0.3s', 
          paddingLeft: open ? '240px' : '60px',
          width: `calc(100% - ${open ? 240 : 60}px)`,
            direction: i18n.language === 'ar'? 'rtl' : 'ltr'
        }} 
        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      >
        <Header open={open}/>
        <Box sx={{ mt: 8 }} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
