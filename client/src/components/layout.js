import React, { useEffect, useState } from "react";
import { CssBaseline, Box, Typography } from "@mui/material";
import Sidebar from '../components/sidebar/Sidebar';
import Header from './Header/Header';
import "../App.css";
import { useTranslation } from 'react-i18next';

function Layout({ children }) {
  const [userRole, setUserRole] = useState(null);
  const [open, setOpen] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    const role = localStorage.  getItem("userRole");
    setUserRole(role);
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar open={open} setOpen={setOpen} userRole={userRole} />
      <Box sx={{ flexGrow: 2, paddingLeft: open ? '240px' : '40px', transition: 'padding-left 0.9 s' }} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <Header open={open}/>
        <Box sx={{ mt: 8 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
export default Layout;