import express from 'express';
import { dashboardStates } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/dashboard', dashboardStates);

export default router;
