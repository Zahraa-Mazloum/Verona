import React, { useState, useEffect } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import axios from 'axios';

const CurrencySwitcher = ({ onCurrencyChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const availableCurrencies = ['USD', 'AED', 'OMR'];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleCurrencyChange = async (currency) => {
  //   handleClose();
  //   try {
  //     const response = await axios.get(`https://v6.exchangerate-api.com/v6/84dc53caeebc39b9059b0b2b/latest/USD`);
  //     const conversionRate = response.data.rates[currency];
  //     onCurrencyChange(currency, conversionRate);
  //   } catch (error) {
  //     console.error('Failed to fetch currency rate', error);
  //   }
  // };
  const handleCurrencyChange = async (currency) => {
    handleClose();
    try {
      const response = await axios.get('https://v6.exchangerate-api.com/v6/84dc53caeebc39b9059b0b2b/latest/USD');
      const conversionRate = response.data.conversion_rates[currency];
      onCurrencyChange(currency, conversionRate);
    } catch (error) {
      console.error('Failed to fetch currency rate', error);
    }
  };
  

  return (
    <>
      <IconButton onClick={handleClick} sx={{ svg: { color: 'rgb(243, 166, 74)' } }}>
        <CurrencyExchangeIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {availableCurrencies.map((currency) => (
          <MenuItem key={currency} onClick={() => handleCurrencyChange(currency)}>
            {currency}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default CurrencySwitcher;
