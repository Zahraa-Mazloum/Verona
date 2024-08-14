import express from 'express';
import {sendMessage, getInvestorNotification} from '../controllers/investorController.js';

const router = express.Router();

router.post('/newmessage/:id', sendMessage);
router.get('/notifications/:id' , getInvestorNotification)

export default router;