import express from express;
const router = express.Router();
import {registerUser , loginUser , getMe } from '../controllers/userController';


router.post('/registration', registerUser)
router.post('/login', loginUser)
router.get('/me', getMe)

export default router;