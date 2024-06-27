import asyncHandler from 'express-async-handler';
import Currency from '../models/currencyModel.js';


export const createCurrency = asyncHandler(async (req, res) => {
    const { name, symbol, description } = req.body;

    const currency = new Currency({ name, symbol, description });

    try {
        await currency.save();
        res.status(201).json(currency);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


export const getCurrencies = asyncHandler(async (req, res) => {
    const currencies = await Currency.find();
    res.status(200).json(currencies);
});

export const getCurrencyById = asyncHandler(async (req, res) => {
    const currency = await Currency.findById(req.params.id);

    if (currency) {
        res.status(200).json(currency);
    } else {
        res.status(404).json({ message: 'Currency not found' });
    }
});


export const updateCurrency = asyncHandler(async (req, res) => {
    const { name, symbol, description } = req.body;
    const currency = await Currency.findById(req.params.id);

    if (currency) {
        currency.name = name || currency.name;
        currency.symbol = symbol || currency.symbol;
        currency.description = description || currency.description;

        const updatedCurrency = await currency.save();
        res.status(200).json(updatedCurrency);
    } else {
        res.status(404).json({ message: 'Currency not found' });
    }
});

export const deleteCurrency = asyncHandler(async (req, res) => {
    const currency = await Currency.findById(req.params.id);

    if (currency) {
        await currency.deleteOne();
        res.status(200).json({ message: 'Currency removed' });
    } else {
        res.status(404).json({ message: 'Currency not found' });
    }
});

const currencyController = { createCurrency, getCurrencies, getCurrencyById, updateCurrency, deleteCurrency };

export default currencyController;
