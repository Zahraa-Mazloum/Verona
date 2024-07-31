import asyncHandler from "express-async-handler";
import Wallet from '../models/walletSchema.js';
import Investor from '../models/investorModel.js';
import AdminNotification from '../models/adminNotificationModel.js';
import upload from "../config/multer.js";
import { io } from '../index.js';
import 'dotenv/config'; 
import mailgun from 'mailgun-js';



const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

export const createWallet = asyncHandler(async (req, res) => {
    const { investorInfo: investorId, amount } = req.body;

    try {
        const investor = await Investor.findById(investorId);
        if (!investor) {
            res.status(404).json({ message: "Investor not found." });
            return;
        }

        const existingWallet = await Wallet.findOne({ investorInfo: investorId });
        if (existingWallet) {
            res.status(400).json({ message: "Wallet already exists for this investor." });
            return;
        }

        const wallet = new Wallet({ investorInfo: investorId, amount });
        await wallet.save();
        res.status(201).json({ message: "Wallet created successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export const getWallets = asyncHandler(async (req, res) => {
    try {
      const wallets = await Wallet.find().populate('investorInfo');
      res.status(200).json(wallets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  export const getWalletById = asyncHandler(async (req, res) => {
    try {
      const wallet = await Wallet.findById(req.params.id).populate('investorInfo');
      if (wallet) {
        res.status(200).json(wallet);
      } else {
        res.status(404).json({ message: 'Wallet not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

export const updateWallet = asyncHandler(async (req, res) => {
    const { investorInfo, amount } = req.body;

    const wallet = await Wallet.findById(req.params.id);

    if (wallet) {
        wallet.investorInfo = investorInfo || wallet.investorInfo;
        wallet.amount = amount || wallet.amount;

        const updatedWallet = await wallet.save();
        res.status(200).json(updatedWallet);
    } else {
        res.status(404).json({ message: 'Wallet not found' });
    }
});

export const deleteWallet = asyncHandler(async (req, res) => {
    const wallet = await Wallet.findById(req.params.id);

    if (wallet) {
        await wallet.deleteOne();
        res.status(200).json({ message: 'Wallet removed' });
    } else {
        res.status(404).json({ message: 'Wallet not found' });
    }
});

export const getInvestorWallet = asyncHandler(async (req, res) => {
  const wallets = await Wallet.find({ investorInfo: req.params.id });
  if (wallets) {
    res.status(200).json(wallets);
  } else {
    res.status(404).json({ message: 'Wallet not found' });
  }
});


export const handleBankTransfer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const investor = await Investor.findById(id);
  const { amount, accountHolderName, dateOfTransfer } = req.body;
  let paymentScreenshot = null;
  const investorEmail = investor.email;

  if (req.files && req.files.paymentScreenshot && req.files.paymentScreenshot[0]) {
    paymentScreenshot = req.files.paymentScreenshot[0];
  }

  if (!paymentScreenshot) {
    return res.status(400).json({ message: 'No payment screenshot uploaded' });
  }

  try {
    const notification = new AdminNotification({
      contract: null,
      type: 'transfer',
      message: `New bank transfer request from ${accountHolderName} for ${amount}.`,
      paymentScreenshot: {
        data: paymentScreenshot.buffer,
        contentType: paymentScreenshot.mimetype,
      },
    });

    await notification.save();
    io.emit('newNotification', notification);

    const emailData = {
      from: investorEmail,
      to: 'zahraamazloum2001@gmail.com',
      subject: 'Transfer Request',
      html: `
        <div>
          <p>${accountHolderName} requested a transfer for ${amount}.</p>
          <p>Transfer Details:</p>
          <ul>
            <li>Amount: ${amount}</li>
            <li>Date of Transfer: ${dateOfTransfer}</li>
          </ul>
          <p>Payment Screenshot:</p>
          <img src="${paymentScreenshot.buffer.toString('base64')}" alt="Payment Screenshot" />
        </div>
      `,
    };
    mg.messages().send(emailData, (error, body) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: error.message });
      }

      console.log('Email sent successfully!');
      res.status(201).json({ message: 'Transfer details submitted successfully', notification });
    });
  } catch (error) {
    console.error('Error handling bank transfer:', error);
    res.status(500).json({ message: error.message });
  }
});
