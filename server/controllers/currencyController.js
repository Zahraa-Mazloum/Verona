import asyncHandler from 'express-async-handler';
import Currency from '../models/currencyModel.js';

export const createCurrency = asyncHandler(async (req, res) => {
    const { name, symbol, description, name_ar, symbol_ar, description_ar } = req.body;

    const currency = new Currency({ name, symbol, description, name_ar, symbol_ar, description_ar });

    try {
        await currency.save();
        res.status(201).json(currency);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export const getCurrenciesByLanguage = asyncHandler(async (req, res) => {
    const { lang } = req.params;
    let currencies;

    // console.log(`Fetching currencies for language: ${lang}`);

    if (lang === 'en') {
        currencies = await Currency.find({}, 'name symbol symbol_ar description');
    } else if (lang === 'ar') {
        currencies = await Currency.find({}, 'name_ar symbol symbol_ar description_ar');
    } else {
        return res.status(400).json({ message: 'Invalid language parameter' });
    }

    console.log(currencies); 
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
    const { name, symbol, description, name_ar, symbol_ar, description_ar } = req.body;
    const currency = await Currency.findById(req.params.id);

    if (currency) {
        currency.name = name || currency.name;
        currency.symbol = symbol || currency.symbol;
        currency.description = description || currency.description;
        currency.name_ar = name_ar || currency.name_ar;
        currency.symbol_ar = symbol_ar || currency.symbol_ar;
        currency.description_ar = description_ar || currency.description_ar;

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

const currencyController = { createCurrency, getCurrenciesByLanguage, getCurrencyById, updateCurrency, deleteCurrency };

export default currencyController;
