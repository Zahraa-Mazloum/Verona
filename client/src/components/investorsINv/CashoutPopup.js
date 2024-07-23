import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Box,
  FormLabel,
  InputAdornment,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const CashoutPopup = ({ open, onClose, onSubmit, bankDetails, setBankDetails, cashoutOption, setCashoutOption, paymentAmount, profitAmount }) => {
  const { t } = useTranslation();
  const [otherAmount, setOtherAmount] = useState('');

  useEffect(() => {
    if (cashoutOption === 'payment') {
      setBankDetails(prev => ({ ...prev, amount: paymentAmount }));
    } else if (cashoutOption === 'profit') {
      setBankDetails(prev => ({ ...prev, amount: profitAmount }));
    } else {
      setBankDetails(prev => ({ ...prev, amount: otherAmount }));
    }
  }, [cashoutOption, paymentAmount, profitAmount, otherAmount, setBankDetails]);

  const handleChange = (event) => {
    setCashoutOption(event.target.value);
    if (event.target.value !== 'other') {
      setOtherAmount('');
    }
  };

  const handleOtherAmountChange = (event) => {
    setOtherAmount(event.target.value);
    setBankDetails(prev => ({ ...prev, amount: event.target.value }));
  };

  const handleSubmit = () => {
    const cashoutAmount = cashoutOption === 'other' ? otherAmount : (cashoutOption === 'payment' ? paymentAmount : profitAmount);
    onSubmit({ ...bankDetails, cashoutOption, cashoutAmount });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('CashoutDetails')}</DialogTitle>
      <DialogContent>
        <TextField
          label={t('AccountNumber')}
          fullWidth
          required
          margin="dense"
          value={bankDetails.accountNumber}
          onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
        />
        <TextField
          label={t('BankName')}
          fullWidth
          required
          margin="dense"
          value={bankDetails.bankName}
          onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
        />
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">{t('AmountToCashout')}</FormLabel>
          <RadioGroup value={cashoutOption} onChange={handleChange}>
            <FormControlLabel
              value="payment"
              control={<Radio />}
              label={`${t('Payment')}: ${paymentAmount}`}
            />
            <FormControlLabel
              value="profit"
              control={<Radio />}
              label={`${t('Profit')} ${profitAmount}`}
            />
            <FormControlLabel
              value="other"
              control={<Radio />}
              label={t('Other')}
            />
          </RadioGroup>
          {cashoutOption === 'other' && (
            <TextField
              label={t('SpecifyAmount')}
              fullWidth
              margin="dense"
              value={otherAmount}
              onChange={handleOtherAmountChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('Cancel')}
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {t('Submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CashoutPopup;
