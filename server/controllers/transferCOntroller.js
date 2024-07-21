import asyncHandler from 'express-async-handler';
import Wallet from '../models/walletSchema.js';
import Contract from '../models/contractModel.js';

export const requestCashout = asyncHandler(async (req, res) => {
  const { contractId, amount, bankDetails } = req.body;

  const contract = await Contract.findById(contractId);
  if (!contract) {
    res.status(404).json({ message: 'Contract not found' });
    return;
  }

  if (amount > contract.remainingAmount) {
    res.status(400).json({ message: 'Insufficient funds' });
    return;
  }

  // Send cashout request to admin for approval
  // Implement logic to notify admin

  res.status(200).json({ message: 'Cashout request submitted' });
});

export const transferToWallet = asyncHandler(async (req, res) => {
  const { contractId, amount } = req.body;

  const contract = await Contract.findById(contractId);
  if (!contract) {
    res.status(404).json({ message: 'Contract not found' });
    return;
  }

  if (amount > contract.remainingAmount) {
    res.status(400).json({ message: 'Insufficient funds' });
    return;
  }

  const wallet = await Wallet.findOne({ investorInfo: contract.investorInfo });
  if (!wallet) {
    res.status(404).json({ message: 'Wallet not found' });
    return;
  }

  contract.remainingAmount -= amount;
  wallet.amount += amount;

  await contract.save();
  await wallet.save();

  res.status(200).json({ message: 'Transfer successful' });
});
