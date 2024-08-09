import express from 'express';
import { getInvestorDashboard } from '../controllers/investorDashboardController.js';

const router = express.Router();

// Define the route for fetching investor dashboard stats
router.get('/investordashboard/:investorId', getInvestorDashboard);

export default router;
