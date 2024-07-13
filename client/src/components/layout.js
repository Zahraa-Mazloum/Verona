import React, { useEffect, useState,Suspense } from "react";
import { useTranslation } from 'react-i18next';
import { Box } from "@mui/material";
import Sidebar from '../components/sidebar/Sidebar';
import Header from './Header/Header';
import "../App.css";
import Loading from "./loading.js";

function Layout({ children }) {
  const { i18n } = useTranslation();
  const [userRole, setUserRole] = useState(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  return (
    <Suspense fallback={<Loading />}>
    <Box sx={{ display: 'flex' }}>
      <Sidebar open={open} setOpen={setOpen} userRole={userRole} />
      <Box 
        sx={{ 
          flexGrow: 1, 
          transition: 'padding-left 0.3s', 
          paddingLeft: open ? '240px' : '60px',
          width: `calc(100% - ${open ? 240 : 60}px)`,
          direction: i18n.language === 'ar' ? 'rtl' : 'ltr'
        }} 
        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      >
        <Header open={open} />
        <Box sx={{ mt: 8 }} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
          {children}
        </Box>
      </Box>
    </Box>
    </Suspense>
  );
}

export default Layout;
