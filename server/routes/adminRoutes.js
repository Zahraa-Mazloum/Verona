import express from 'express';
import { registerUser , getAllAdmins, getUserById ,getAllInvestors,getAllEmployees,updateUser, deleteUser, } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/registration',protect,admin, registerUser);
router.get('/allAdmin',protect,admin,getAllAdmins)
router.get('/allInvestors',protect,admin,getAllInvestors)
router.get('/allEmployees',protect,admin,getAllEmployees)
router.get('/userProfile/:id',protect,admin,getUserById)
router.put('/updateUser/:id',protect,admin,updateUser)
router.delete('/deleteUser/:id',protect,admin,deleteUser)

export default router;
    