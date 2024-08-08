// import express from 'express';
// import {
//   getInvestorContracts,
//   getMaturedContracts,
//   getContractStats,
// } from '../controllers/invDashController.js';

// const router = express.Router();

// router.get('/investorContracts/:investorId', getInvestorContracts);
// router.get('/maturedContracts/:investorId', getMaturedContracts);
// router.get('/contractStats/:investorId', getContractStats);

// export default router;
import express from 'express';
import investorDashboardController from '../controllers/investorDashboardController.js';
import { protectInvestor } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET Investor Dashboard Stats
router.get('/investor-dashboard', investorDashboardController.investorDashboardStates);

export default router;
