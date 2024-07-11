import express from 'express';
import { createWallet, getWallets, getWalletById, updateWallet, deleteWallet } from '../controllers/walletController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/createWallet', createWallet);
router.get('/getWallets/:lang',  getWallets);
router.get('/getWalletById/:id',getWalletById);
router.put('/updateWallet/:id', updateWallet);
router.delete('/deleteWallet/:id',deleteWallet);

export default router;

