import asyncHandler from "express-async-handler";
import Wallet from '../models/walletSchema.js';
import Investor from "../models/investorModel.js";

export const createWallet = asyncHandler(async (req, res) => {
    const { investorInfo: investorId,currency: currencyId, amount } = req.body;

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