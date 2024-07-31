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

const TransferPopup = ({ open, onClose, onSubmit, transferOption, setTransferOption, paymentAmount, profitAmount }) => {
  const { t } = useTranslation();
  const [otherAmount, setOtherAmount] = useState('');

  // useEffect(() => {
  //   if (transferOption === 'payment') {
  //     setBankDetails(prev => ({ ...prev, amount: paymentAmount }));
  //   } else if (transferOption === 'profit') {
  //     setBankDetails(prev => ({ ...prev, amount: profitAmount }));
  //   } else {
  //     setBankDetails(prev => ({ ...prev, amount: otherAmount }));
  //   }
  // }, [transferOption, paymentAmount, profitAmount, otherAmount, setBankDetails]);

  const handleChange = (event) => {
    setTransferOption(event.target.value);
    if (event.target.value !== 'other') {
      setOtherAmount('');
    }
  };

  const handleOtherAmountChange = (event) => {
    setOtherAmount(event.target.value);
    // setBankDetails(prev => ({ ...prev, amount: event.target.value }));
  };

  const handleSubmit = () => {
    const cashoutAmount = transferOption === 'other' ? otherAmount : (transferOption === 'payment' ? paymentAmount : profitAmount);
    onSubmit({transferOption, cashoutAmount });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('TransferDetails')}</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">{t('AmountToTransfer')}</FormLabel>
          <RadioGroup value={transferOption} onChange={handleChange}>
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
          {transferOption === 'other' && (
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

export default TransferPopup;
