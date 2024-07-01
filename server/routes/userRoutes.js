import express from 'express';
const router = express.Router();
import {loginUser , myProfile} from '../controllers/userController.js';
import { protect , admin} from '../middleware/authMiddleware.js';


router.post('/login', loginUser)
router.get('/me',protect, myProfile)

export default router;