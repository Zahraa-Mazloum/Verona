import asyncHandler from 'express-async-handler';
import Investment from '../models/investmentsModel.js';

// Create a new Investment
export const createInvestment = asyncHandler(async (req, res) => {
    const { titleInv, titleInv_ar, amount, type:typeId, profit, contract:contractId, investmentStatus } = req.body;

    const investment = new Investment({
        titleInv,
        titleInv_ar,
        amount,
        type:typeId,
        contract:contractId,
        investmentStatus
    });

    try {
        await investment.save();
        res.status(201).json(investment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all Investments by language
export const getInvestmentsByLanguage = asyncHandler(async (req, res) => {
    const { lang } = req.params;
    let investments;

    if (lang === 'en') {
        investments = await Investment.find({}, 'titleInv amount type profit contract investmentStatus payment')
            .populate('type')
            .populate({
                path: 'contract',
                populate: {
                    path: 'currency investorInfo'
                }
            });
    } else if (lang === 'ar') {
        investments = await Investment.find({}, 'titleInv_ar amount type profit contract investmentStatus payment')
            .populate('type')
            .populate({
                path: 'contract',
                populate: {
                    path: 'currency investorInfo'
                }
            });
    } else {
        return res.status(400).json({ message: 'Invalid language parameter' });
    }

    res.status(200).json(investments);
});

// Get Investment by ID
export const getInvestmentById = asyncHandler(async (req, res) => {
    const investment = await Investment.findById(req.params.id).populate('type').populate('contract');

    if (investment) {
        res.status(200).json(investment);
    } else {
        res.status(404).json({ message: 'Investment not found' });
    }
});

// Update an Investment
export const updateInvestment = asyncHandler(async (req, res) => {
    const { titleInv, titleInv_ar, amount, type, profit, contract, investmentStatus } = req.body;
    const investment = await Investment.findById(req.params.id);

    if (investment) {
        investment.titleInv = titleInv || investment.titleInv;
        investment.titleInv_ar = titleInv_ar || investment.titleInv_ar;
        investment.amount = amount || investment.amount;
        investment.type = type || investment.type;
        investment.profit = profit || investment.profit;
        investment.contract = contract || investment.contract;
        investment.investmentStatus = investmentStatus !== undefined ? investmentStatus : investment.investmentStatus;

        const updatedInvestment = await investment.save();
        res.status(200).json(updatedInvestment);
    } else {
        res.status(404).json({ message: 'Investment not found' });
    }
});

// Delete an Investment
export const deleteInvestment = asyncHandler(async (req, res) => {
    const investment = await Investment.findById(req.params.id);

    if (investment) {
        await investment.deleteOne();
        res.status(200).json({ message: 'Investment removed' });
    } else {
        res.status(404).json({ message: 'Investment not found' });
    }
});
// Get overall Investments per Type

export const getInvestmentsPerType = asyncHandler(async (req, res) => {
    try {
        const investmentsPerType = await Investment.aggregateInvestmentsPerType();
        res.status(200).json(investmentsPerType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
;


const investmentController = {
    createInvestment,
    getInvestmentsByLanguage,
    getInvestmentById,
    updateInvestment,
    deleteInvestment,
    getInvestmentsPerType
};

export default investmentController;
