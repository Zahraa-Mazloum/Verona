import express from 'express';
import {
  getInvestorContracts,
  getMaturedContracts,
  getContractStats,
} from '../controllers/invDashController.js';

const router = express.Router();

router.get('/investorContracts/:investorId', getInvestorContracts);
router.get('/maturedContracts/:investorId', getMaturedContracts);
router.get('/contractStats/:investorId', getContractStats);

export default router;
