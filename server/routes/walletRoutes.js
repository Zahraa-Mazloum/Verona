    import express from 'express';
    import { createWallet, getWallets, getWalletById,getInvestorWallet, updateWallet, deleteWallet ,handleBankTransfer,handleWalletTransfer} from '../controllers/walletController.js';
    import { protect, admin } from '../middleware/authMiddleware.js';
    import multerUpload from '../config/multer.js';

    const router = express.Router();

    const uploadMiddleware = multerUpload.fields([
        { name: 'paymentScreenshot', maxCount: 1 },
      ]);
    router.post('/createWallet', createWallet);
    router.post('/cashout/:id', handleWalletTransfer);
    router.get('/getWallets/:lang',  getWallets);
    router.get('/getWallet/:id',getWalletById);
    router.get('/getInvWallet/:id',getInvestorWallet);
    router.put('/updateWallet/:id', updateWallet);
    router.delete('/deleteWallet/:id',deleteWallet);
    router.post('/bankTransfer/:id', uploadMiddleware, handleBankTransfer);

    export default router;