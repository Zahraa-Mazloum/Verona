import React, { useEffect, useState, Suspense } from "react";
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

  const isRTL = i18n.language === 'ar';

  return (
    <Suspense fallback={<Loading />}>
      <Box sx={{ display: 'flex' }}>
        <Sidebar open={open} setOpen={setOpen} userRole={userRole} dir={isRTL ? 'rtl' : 'ltr'}/>
        <Box 
          sx={{ 
            flexGrow: 1, 
            transition: 'padding 0.3s', 
            paddingLeft: isRTL ? '0px' : open ? '240px' : '60px',
            paddingRight: isRTL ? open ? '240px' : '60px' : '0px',
            width: `calc(100% - ${open ? 240 : 60}px)`,
            direction: isRTL ? 'rtl' : 'ltr'
          }} 
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <Header open={open} />
          <Box sx={{ mt: 8 }} dir={isRTL ? 'rtl' : 'ltr'}>
            {children}
          </Box>
        </Box>
      </Box>
    </Suspense>
  );
}

export default Layout;
