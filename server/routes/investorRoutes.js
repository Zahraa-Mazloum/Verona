import express from 'express';
import {sendMessage} from '../controllers/investorController.js';

const router = express.Router();

router.post('/newmessage/:id', sendMessage);

export default router;