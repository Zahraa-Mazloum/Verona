import express from 'express';
import { addInvestmentType, getTypesByLanguage, getTypeById, updateType, deleteType } from '../controllers/investmenttypesController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/addInvestmentType', addInvestmentType);
router.get('/getTypesByLanguage/:lang',getTypesByLanguage);
router.get('/getTypeById/:id',getTypeById);
router.put('/updateType/:id', updateType);
router.delete('/deleteType/:id',deleteType);

export default router;
