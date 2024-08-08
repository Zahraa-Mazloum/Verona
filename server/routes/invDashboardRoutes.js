import express from 'express';
import { investorDashboardStates } from '../controllers/investorDashboardController.js';

const router = express.Router();

// GET Investor Dashboard Stats
router.get('/investordashboard', investorDashboardStates);

export default router;