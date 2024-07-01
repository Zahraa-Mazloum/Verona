import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import validator from 'validator';
import Admin from '../models/adminModel.js';
import Employee from '../models/employeeModel.js';
import Investor from '../models/investorModel.js';

// Generate JWT
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// Password strength validation function
export const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

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
    status,
  } = req.body;

  if (
    !fullname_en ||
    !fullname_ar ||
    !email ||
    !phoneNumber ||
    !dateOfBirth ||
    !password ||
    !role ||
    typeof status !== 'boolean'
  ) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error('Invalid email format');
  }

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
      status,
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
      status,
      onboarding: req.body.onboarding,
      offboarding: req.body.offboarding,
      salary: req.body.salary,
      salaryCurrency: req.body.salaryCurrency,
    });
  } else if (role === 'investor') {
    newUser = await Investor.create({
      fullname_en,
      fullname_ar,
      email,
      phoneNumber,
      dateOfBirth,
      password: hashedPassword,
      role,
      status,
      passportNumber: req.body.passportNumber,
      passportExpiryDate: req.body.passportExpiryDate,
      passportPhoto: req.body.passportPhoto,
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
      status: newUser.status,
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
export const getAllInvestors = asyncHandler(async (req, res) => {
  const investors = await Investor.find({});
  res.json(investors);
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

const adminController = { registerUser, getAllAdmins, getUserById,getAllInvestors,getAllEmployees };

export default adminController;
