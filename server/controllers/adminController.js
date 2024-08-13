import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import Admin from '../models/adminModel.js';
import Employee from '../models/employeeModel.js';
import Investor from '../models/investorModel.js';
import AdminNotification from '../models/adminNotificationModel.js';

// Generate JWT
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// Password strength validation function
export const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// Email validation function
// export const isValidEmail = (email) => {
//   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return regex.test(email);
// };

// @desc Register new user (Admin only)
// @route POST /api/admin/registration
// @access Private (Admin only)
export const registerUser = asyncHandler(async (req, res) => {
  const {
    fullname_en,
    fullname_ar,
    email,
    phoneNumber,
    dateOfBirth,
    password,
    role,
    passportNumber,
    passportExpiryDate
  } = req.body;

  if (
    !fullname_en ||
    !fullname_ar ||
    !email ||
    !phoneNumber ||
    !dateOfBirth ||
    !password 
  ) {
    res.status(400);
    throw new Error('Please add all fieldsss');
  }

  // if (!isValidEmail(email)) {
  //   res.status(400);
  //   throw new Error('Invalid email format');
  // }

  if (!isStrongPassword(password)) {
    res.status(400);
    throw new Error('Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a digit, and a special character.');
  }

  // Check if user exists
  const userExist = await Admin.findOne({ email }) || await Employee.findOne({ email }) || await Investor.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Determine the user type and create the appropriate user
  let newUser;
  if (role === 'admin') {
    newUser = await Admin.create({
      fullname_en,
      fullname_ar,
      email,
      phoneNumber,
      dateOfBirth,
      password: hashedPassword,
      role,
    });
  } else if (role === 'employee') {
    newUser = await Employee.create({
      fullname_en,
      fullname_ar,
      email,
      phoneNumber,
      dateOfBirth,
      password: hashedPassword,
      role,
      onboarding: req.body.onboarding,
      offboarding: req.body.offboarding,
      salary: req.body.salary,
      salaryCurrency: req.body.salaryCurrency,
    });
  } else if (role === 'investor') {
    let passportPhoto = null;
    if (req.files && req.files.passportPhoto && req.files.passportPhoto[0]) {
      passportPhoto = {
        data: req.files.passportPhoto[0].buffer,
        contentType: req.files.passportPhoto[0].mimetype,
      };
    }
    newUser = await Investor.create({
      fullname_en,
      fullname_ar,
      email,
      phoneNumber,
      dateOfBirth,
      password: hashedPassword,
      role,
      passportNumber,
      passportExpiryDate,
      passportPhoto,
    });
  } else {
    res.status(400);
    throw new Error('Invalid role');
  }

  if (newUser) {
    res.status(201).json({
      _id: newUser.id,
      fullname_en: newUser.fullname_en,
      fullname_ar: newUser.fullname_ar,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      dateOfBirth: newUser.dateOfBirth,
      role: newUser.role,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc Get all admins , investors , employees
// @route GET /api/admin/all
// @access Private (Admin only)
export const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find({});
  res.json(admins);
});

export const getInvestorByLanguage = asyncHandler(async (req, res) => {
  const { lang } = req.params;
  let investors;

  if (lang === 'en') {
    investors = await Investor.find({}, 'fullname_en fullname_ar email phoneNumber dateOfBirth role  passportNumber passportExpiryDate passportPhoto');
  } else if (lang === 'ar') {
    investors = await Investor.find({}, 'fullname_ar fullname_en email phoneNumber dateOfBirth role  passportNumber passportExpiryDate passportPhoto');
  } else {
    return res.status(400).json({ message: 'Invalid language parameter' });
  }
  console.log(investors); 
  res.status(200).json(investors);
});

export const getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({});
  res.json(employees);
});

// @desc Get user by ID
// @route GET /api/admin/users/:id
// @access Private (Admin only)
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let user = await Admin.findById(id) || await Employee.findById(id) || await Investor.findById(id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

// @desc Update user
// @route Put /api/admin/users/:id
// @access Private (Admin only)
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    fullname_en,
    fullname_ar,
    email,
    phoneNumber,
    dateOfBirth,
    password,
    role,
  } = req.body;

  let user;
  if (role === 'admin') {
    user = await Admin.findByIdAndUpdate(id, {
      fullname_en,
      fullname_ar,
      email,
      phoneNumber,
      dateOfBirth,
      password: password ? await bcrypt.hash(password, 10) : undefined,
      role,
    }, { new: true });
  } else if (role === 'employee') {
    user = await Employee.findByIdAndUpdate(id, {
      fullname_en,
      fullname_ar,
      email,
      phoneNumber,
      dateOfBirth,
      password: password ? await bcrypt.hash(password, 10) : undefined,
      role,
      onboarding: req.body.onboarding,
      offboarding: req.body.offboarding,
      salary: req.body.salary,
      salaryCurrency: req.body.salaryCurrency,
    }, { new: true });
  } else if (role === 'investor') {
    let passportPhoto = null;
    if (req.files && req.files.passportPhoto && req.files.passportPhoto[0]) {
      passportPhoto = {
        data: req.files.passportPhoto[0].buffer,
        contentType: req.files.passportPhoto[0].mimetype,
      };
    }
    user = await Investor.findByIdAndUpdate(id, {
      fullname_en,
      fullname_ar,
      email,
      phoneNumber,
      dateOfBirth,
      password: password ? await bcrypt.hash(password, 10) : undefined,
      role,
      passportNumber: req.body.passportNumber,
      passportExpiryDate: req.body.passportExpiryDate,
      passportPhoto,
    }, { new: true });
  } else {
    res.status(400);
    throw new Error('Invalid role');
  }

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

// @desc Delete user
// @route DELETE /api/admin/users/:idac
// @access Private (Admin only)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await Admin.findById(req.params.id) || await Investor.findById(req.params.id) || await Employee.findById(req.params.id);  

  if (user) {
    await user.deleteOne();
    res.status(200).json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'Currency not found' });
  }
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({ message: 'User deleted successfully' });
});
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await AdminNotification.find({ isRead: false }).populate('contract').sort({ createdAt: -1 });
  res.json(notifications);
});

export const readandAcceptNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await AdminNotification.findByIdAndUpdate(id, { isRead: true,status: 'accepted' 
  }, { new: true });

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  res.json(notification);
});

export const readandRejectNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the notification and populate the contract details
  const notification = await AdminNotification.findById(id).populate('contract');

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  // Mark the notification as read
  notification.isRead = true;
  await notification.save();

  // Add the notification amount to the contract's withdraw
  if (notification.contract && notification.contract.withdraw !== undefined) {
    notification.contract.withdraw += notification.amount;
    await notification.contract.save();
  } else {
    res.status(400);
    throw new Error('Contract or withdraw not found');
  }

  res.json(notification);
});



const adminController = {
  registerUser,
  getAllAdmins,
  getUserById,
  getInvestorByLanguage,
  getAllEmployees,
  updateUser,
  deleteUser,
  getNotifications,
  readandAcceptNotification,
  readandRejectNotification
};

export default adminController;
