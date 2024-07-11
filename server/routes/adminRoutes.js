import express from 'express';
import { registerUser, getAllAdmins, getUserById, getInvestorByLanguage, getAllEmployees, updateUser, deleteUser } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import multerUpload from '../config/multer.js';

const router = express.Router();

const uploadMiddleware = multerUpload.fields([
  { name: 'passportPhoto', maxCount: 1 },
]);

router.post('/registration', uploadMiddleware, registerUser);
router.get('/allAdmin', getAllAdmins);
router.get('/allInvestors/:lang', getInvestorByLanguage);
router.get('/allEmployees', getAllEmployees);
router.get('/userProfile/:id', getUserById);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);

export default router;
