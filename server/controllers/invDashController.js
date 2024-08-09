import asyncHandler from 'express-async-handler';
import Contract from '../models/contractModel.js';
import mongoose from 'mongoose';

// Get all contracts for an investor
export const getInvestorContracts = asyncHandler(async (req, res) => {
  const contracts = await Contract.find({ investorInfo: req.params.investorId }).populate('currency investorInfo');
  res.json(contracts);
});

// Get matured contracts for an investor
export const getMaturedContracts = asyncHandler(async (req, res) => {
  const maturedContracts = await Contract.find({
    investorInfo: req.params.investorId,
    endDate: { $lte: new Date() }
  }).populate('currency investorInfo');
  res.json(maturedContracts);
});

// Get contract statistics for an investor
export const getContractStats = asyncHandler(async (req, res) => {
  const stats = await Contract.aggregate([
    { $match: { investorInfo: new mongoose.Types.ObjectId(req.params.investorId) } },
    {
      $group: {
        _id: { $month: "$startDate" },
        totalAmount: { $sum: "$amount" }
      }
    },
    { $sort: { "_id": 1 } }
  ]);
  res.json(stats);
});

export const totalInvestedPerMonth = asyncHandler(async (req, res) => {
  const stats = await Contract.aggregate([
    { $match: { investorInfo: new mongoose.Types.ObjectId(req.params.investorId) } },
    {
      $group: {
        _id: { $month: "$startDate" },
        totalAmount: { $sum: "$amount" }
      }
    },
    { $sort: { "_id": 1 } }
  ]);
  res.json(stats);
});