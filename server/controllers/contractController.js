import asyncHandler from 'express-async-handler';
import Contract from '../models/contractModel.js';

// Create Contract
export const createContract = asyncHandler(async (req, res) => {
  const {investorInfo: investorId, amount, currency: currencyId, contractTime,contractTime_ar, startDate } = req.body;
  
  const contract = new Contract({investorInfo: investorId,amount, currency: currencyId, contractTime, contractTime_ar,startDate });

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
  const { investorInfo,amount, currency, contractTime,contractTime_ar, startDate } = req.body;
  const contract = await Contract.findById(req.params.id);

  if (contract) {
    contract.investorInfo = investorInfo || contract.investorInfo;
    contract.amount = amount || contract.amount;
    contract.currency = currency || contract.currency;
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

const contractController = { createContract, getContracts, getContractById, updateContract, updateInvestmentStatus, deleteContract ,getInvestorContracts };

export default contractController;
