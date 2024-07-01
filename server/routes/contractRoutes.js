import express from 'express';
import {createContract , getContracts , getContractById, updateContract , deleteContract} from '../controllers/contractController.js';
import {admin , protect} from '../middleware/authMiddleware.js'

const router = express.Router();

router.post('/newContract',protect,admin, createContract);
router.get('/allContracts',getContracts)
router.get('/investrContract/:id',getContractById) 
router.put('/editContract/:id',updateContract) 
router.delete('/deleteContract/:id',deleteContract) 

export default router;
