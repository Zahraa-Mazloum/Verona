import express from 'express';
import { createInvestment,getInvestmentsByLanguage,updateInvStatus,getInvestmentById, updateInvestment, deleteInvestment,getInvestmentsPerType} from '../controllers/investmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/createInvestment', createInvestment);
router.get('/investmentsPerType/:lang', getInvestmentsPerType);
router.get('/getInvestments/:lang',getInvestmentsByLanguage);
router.get('/getInvestmentById/:id',getInvestmentById);
router.put('/updateInvestment/:id', updateInvestment);
router.put('/updateInvStatus/:id', updateInvStatus);
router.delete('/deleteInvestment/:id',deleteInvestment);

export default router;
