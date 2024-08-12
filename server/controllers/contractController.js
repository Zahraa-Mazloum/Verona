import asyncHandler from 'express-async-handler';
import Contract from '../models/contractModel.js';
import mailgun from 'mailgun-js';
import AdminNotification from '../models/adminNotificationModel.js';
import Investor from '../models/investorModel.js';
import 'dotenv/config'; 
import { io } from '../index.js';

// Mailgun Configuration
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

// Create Contract
export const createContract = asyncHandler(async (req, res) => {
  const { investorInfo: investorId, amount, currency: currencyId, contractTime, contractTime_ar, startDate } = req.body;

  const contract = new Contract({ investorInfo: investorId, amount, currency: currencyId, contractTime, contractTime_ar, startDate });

  try {
    await contract.save();
    res.status(201).json(contract);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Contracts
export const getContracts = asyncHandler(async (req, res) => {
  const contracts = await Contract.find().populate('investorInfo currency');
  res.status(200).json(contracts);
});

// Get Contract by ID
export const getContractById = asyncHandler(async (req, res) => {
  const contract = await Contract.findById(req.params.id).populate('investorInfo currency');
  if (contract) {
    res.status(200).json(contract);
  } else {
    res.status(404).json({ message: 'Contract not found' });
  }
});

// Update Contract
export const updateContract = asyncHandler(async (req, res) => {
  const { investorInfo, amount, currency, withdraw,contractTime, contractTime_ar, startDate } = req.body;
  const contract = await Contract.findById(req.params.id);

  if (contract) {
    contract.investorInfo = investorInfo || contract.investorInfo;
    contract.amount = amount || contract.amount;
    contract.currency = currency || contract.currency;
    contract.withdraw = withdraw || contract.withdraw;
    contract.contractTime = contractTime || contract.contractTime;
    contract.contractTime_ar = contractTime_ar || contract.contractTime_ar;
    contract.startDate = startDate || contract.startDate;

    const updatedContract = await contract.save();
    res.status(200).json(updatedContract);
  } else {
    res.status(404).json({ message: 'Contract not found' });
  }
});

// Update Investment Status
export const updateInvestmentStatus = asyncHandler(async (req, res) => {
  const { investmentStatus } = req.body;
  const contract = await Contract.findById(req.params.id);

  if (contract) {
    contract.investmentStatus = investmentStatus;

    const updatedContract = await contract.save();
    res.status(200).json(updatedContract);
  } else {
    res.status(404).json({ message: 'Contract not found' });
  }
});

// Fetch contracts by investor ID
export const getInvestorContracts = asyncHandler(async (req, res) => {
  const contracts = await Contract.find({ investorInfo: req.params.id }).populate('currency');
  if (contracts) {
    res.status(200).json(contracts);
  } else {
    res.status(404).json({ message: 'Contracts not found' });
  }
});

// Delete Contract
export const deleteContract = asyncHandler(async (req, res) => {
  const contract = await Contract.findById(req.params.id);
  if (contract) {
    await contract.deleteOne();
    res.status(200).json({ message: 'Contract removed' });
  } else {
    res.status(404).json({ message: 'Contract not found' });
  }
});

// Send Email
const sendEmail = (from, to, subject, html) => {
  const data = {
    from,
    to,
    subject,
    html,
  };

  mg.messages().send(data, (error, body) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', body);
    }
  });
};

// Handle Cashout Request
export const handleCashout = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contract = await Contract.findById(id).populate('investorInfo');

  if (contract) {
    const investorEmail = contract.investorInfo.email;
    const investorName = contract.investorInfo.fullname_en;
    const contractStartDate = new Date(contract.startDate).toLocaleDateString();
    let { accountNumber, bankName, cashoutOption, cashoutAmount } = req.body; 

    // Validate and sanitize cashoutAmount
    if (typeof cashoutAmount === 'string') {
      cashoutAmount = cashoutAmount.trim();
    }
    cashoutAmount = Number(cashoutAmount);
    if (isNaN(cashoutAmount)) {
      return res.status(400).json({ message: 'Invalid cashout amount' });
    }

    const notification = new AdminNotification({
      contract: contract._id,
      type: 'cashout',
      message: `${investorName} requested cashout for contract with date ${contractStartDate}`,
    });
    await notification.save();
    io.emit('newNotification', notification);

    // Send email to admin
    const emailData = {
      from: investorEmail,
      to: ['zahraamazloum2001@gmail.com', 'azizmatta@gmail.com'],
      subject: 'Cashout Request',
      html: `
        <div>
          ${investorName} requested cashout for contract with date ${contractStartDate}.
          <br>
          Cashout Details:
          <br>
          Account Number: ${accountNumber}
          <br>
          Bank Name: ${bankName}
          <br>
          Cashout Option: ${cashoutOption}
          <br>
          Cashout Amount: ${cashoutAmount}
        </div>
      `,
    };

    sendEmail(emailData.from, emailData.to, emailData.subject, emailData.html);

    // Update the withdraw field
    contract.withdraw -= cashoutAmount;
    await contract.save();

    // Update unreadCount state
    const unreadCount = await AdminNotification.countDocuments({ isRead: false });
    res.status(200).json({ message: 'Cashout request sent to admin and investor', unreadCount });
  } else {
    res.status(404).json({ message: 'Contract not found' });
  }
});

// Handle Transfer Request
export const handleTransfer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contract = await Contract.findById(id).populate('investorInfo');

  if (contract) {
    const investorEmail = contract.investorInfo.email;
    const investorName = contract.investorInfo.fullname_en;
    const contractStartDate = new Date(contract.startDate).toLocaleDateString();
    let { cashoutOption, cashoutAmount } = req.body; 

    // Validate and sanitize cashoutAmount
    if (typeof cashoutAmount === 'string') {
      cashoutAmount = cashoutAmount.trim();
    }
    cashoutAmount = Number(cashoutAmount);
    if (isNaN(cashoutAmount)) {
      return res.status(400).json({ message: 'Invalid cashout amount' });
    }

    const notification = new AdminNotification({
      contract: contract._id,
      type: 'transfer',
      message: `${investorName} requested transfer for contract with date ${contractStartDate}`,
    });
    await notification.save();
    io.emit('newNotification', notification);

    // Send email to admin
    const emailData = {
      from: investorEmail,
      to: ['zahraamazloum2001@gmail.com', 'azizmatta@gmail.com'],
      subject: 'Transfer Request',
      html: `
        <div>
          ${investorName} requested transfer for contract with date ${contractStartDate}.
          <br>
          Transfer Details:
          <br>
          Cashout Option: ${cashoutOption}
          <br>
          Cashout Amount: ${cashoutAmount}
        </div>
      `,
    };

    sendEmail(emailData.from, emailData.to, emailData.subject, emailData.html);

    // Update the withdraw field
    contract.withdraw -= cashoutAmount;
    await contract.save();

    // Update unreadCount state
    const unreadCount = await AdminNotification.countDocuments({ isRead: false });
    res.status(200).json({ message: 'Transfer request sent to admin and investor', unreadCount });
  } else {
    res.status(404).json({ message: 'Contract not found' });
  }
});

const contractController = { createContract, getContracts, getContractById, updateContract, updateInvestmentStatus, deleteContract, getInvestorContracts, handleCashout, handleTransfer };

export default contractController;
