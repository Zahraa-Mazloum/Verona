import express from 'express';
import {createContract , getContracts , getContractById, updateContract , deleteContract ,updateInvestmentStatus,getInvestorContracts, handleCashout , handleTransfer} from '../controllers/contractController.js';
import {admin , protect} from '../middleware/authMiddleware.js'

const router = express.Router();

router.post('/newContract', createContract);
router.post('/cashout/:id', handleCashout);
router.post('/transfer', handleTransfer);
router.get('/allContracts/:lang',getContracts)
router.get('/investorContracts/:id',getInvestorContracts)
router.get('/investrContract/:id',getContractById) 
router.put('/editContract/:id',updateContract) 
router.delete('/deleteContract/:id',deleteContract) 
router.put('/updateStatus/:id' , updateInvestmentStatus);


export default router;
