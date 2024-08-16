import express from 'express';
import {sendMessage, getInvestorNotification,readNotification} from '../controllers/investorController.js';

const router = express.Router();

router.post('/newmessage/:id', sendMessage);
router.get('/notifications/:id' , getInvestorNotification)
router.put('/readnotifications/:id' ,readNotification );

export default router;