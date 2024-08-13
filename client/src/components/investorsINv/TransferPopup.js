import React, { useState } from 'react';
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
  FormLabel,
  InputAdornment,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const TransferPopup = ({ open, onClose, onSubmit, transferOption, setTransferOption, paymentAmount, profitAmount, withdraw }) => {
  const { t } = useTranslation();
  const [otherAmount, setOtherAmount] = useState('');

  const handleChange = (event) => {
    setTransferOption(event.target.value);
    if (event.target.value !== 'other') {
      setOtherAmount('');
    }
  };

  const handleOtherAmountChange = (event) => {
    setOtherAmount(event.target.value);
  };

  const handleSubmit = () => {
    const cashoutAmount = transferOption === 'other' ? Number(otherAmount) : (transferOption === 'payment' ? paymentAmount : profitAmount);

    // Validation checks
    if (cashoutAmount > withdraw) {
      toast.error(t('AmountExceedsWithdraw'));
      return;
    }

    if (withdraw - cashoutAmount < 0) {
      toast.error(t('WithdrawalWouldBeNegative'));
      return;
    }

    onSubmit({ transferOption, cashoutAmount });
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
              label={`${t('Profit')}: ${profitAmount}`}
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
