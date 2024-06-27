import express from 'express';
import { registerUser , getAllAdmins } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/registration',protect,admin, registerUser);
router.get('/Alladmins',getAllAdmins)

export default router;
