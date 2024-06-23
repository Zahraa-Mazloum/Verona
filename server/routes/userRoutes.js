import express from 'express';
const router = express.Router();
import {loginUser , myProfile} from '../controllers/userController.js';


router.post('/login', loginUser)
router.get('/me', myProfile)

export default router;