import express from 'express';
import {createCurrency , getCurrencyById , updateCurrency ,deleteCurrency,getCurrenciesByLanguage} from '../controllers/currencyController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/createCurrency', createCurrency);
router.get('/getCurrencies/:lang',getCurrenciesByLanguage);
router.get('/getCurrencyById/:id',getCurrencyById);
router.put('/updateCurrency/:id', updateCurrency);
router.delete('/deleteCurrency/:id',deleteCurrency);

export default router;
