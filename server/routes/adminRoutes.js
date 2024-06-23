import express from 'express';
import { registerUser } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/registration',protect,admin, registerUser);

export default router;
