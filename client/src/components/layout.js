import React, { useState, useEffect, Suspense } from 'react';
import { Box } from "@mui/material";
import Sidebar from '../components/sidebar/Sidebar';
import Header from './Header/Header';
import "../App.css";
import Loading from "./loading";
import { useTranslation } from 'react-i18next';



function Layout({ children }) {
  const [userRole, setUserRole] = useState(null);
  const [open, setOpen] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [conversionRate, setConversionRate] = useState(1);
  const { i18n } = useTranslation();


  const handleCurrencyChange = (currency, rate) => {
    setSelectedCurrency(currency);
    setConversionRate(rate);
  };
  const isRTL = i18n.language === 'ar';

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
            transition: 'padding 0.3s', 
            paddingLeft: isRTL ? '0px' : open ? '240px' : '60px',
            paddingRight: isRTL ? open ? '240px' : '60px' : '0px',
            width: `calc(100% - ${open ? 240 : 60}px)`,
            direction: isRTL ? 'rtl' : 'ltr'
          }} 
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <Header open={open} onCurrencyChange={handleCurrencyChange} />
          <Box sx={{ mt: 8 }}>
{children}
          </Box>
        </Box>
      </Box>
    </Suspense>
  );
}

export default Layout;
