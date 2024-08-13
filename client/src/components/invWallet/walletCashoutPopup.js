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
import { toast } from 'react-toastify';

const CashoutPopup = ({ open, onClose, onSubmit, bankDetails, setBankDetails, cashoutOption, setCashoutOption, amount }) => {
  const { t } = useTranslation();
  const [otherAmount, setOtherAmount] = useState('');

  useEffect(() => {
    if (cashoutOption === 'payment') {
      setBankDetails(prev => ({ ...prev, amount: amount }));
    } else {
      setBankDetails(prev => ({ ...prev, amount: otherAmount }));
    }
  }, [cashoutOption, amount, otherAmount, setBankDetails]);

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
    const cashoutAmount = cashoutOption === 'other' ? otherAmount : amount;

  // Validation checks
  if (cashoutAmount > amount) {
    toast.error(t('AmountExceedsWithdraw'));
    return;
  }

  if (amount - cashoutAmount < 0) {
    toast.error(t('WithdrawalWouldBeNegative'));
    return;
  }

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
              value="amount"
              control={<Radio />}
              label={`${t('Amount')} ${amount}`}
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
