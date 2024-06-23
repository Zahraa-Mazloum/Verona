import express from 'express';
const router = express.Router();
import {loginUser , myProfile, logoutUser} from '../controllers/userController.js';
import { protect , admin} from '../middleware/authMiddleware.js';


router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/me',protect,admin, myProfile)

export default router;