import express from 'express';
import { registerUser , getAllAdmins, getUserById ,getAllInvestors,getAllEmployees } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/registration',protect,admin, registerUser);
router.get('/allAdmin',getAllAdmins)
router.get('/allInvestors',getAllInvestors)
router.get('/allEmployees',getAllEmployees)
router.get('/userProfile/:id',getUserById)

export default router;
