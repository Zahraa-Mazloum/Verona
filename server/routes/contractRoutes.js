import express from 'express';
import {createContract , getContracts , getContractById, updateContract , deleteContract ,updateInvestmentStatus,getInvestorContracts, handleCashout , handleTransfer} from '../controllers/contractController.js';
import {admin , protect} from '../middleware/authMiddleware.js'
import multerUpload from '../config/multer.js';

const router = express.Router();

router.post('/newContract', createContract);
router.post('/cashout/:id', handleCashout);
router.post('/transfer/:id', handleTransfer);
router.get('/allContracts/:lang',getContracts)
router.get('/investorContracts/:id',getInvestorContracts)
router.get('/investrContract/:id',getContractById) 
router.put('/editContract/:id',updateContract) 
router.delete('/deleteContract/:id',deleteContract) 
router.put('/updateStatus/:id' , updateInvestmentStatus);


export default router;
