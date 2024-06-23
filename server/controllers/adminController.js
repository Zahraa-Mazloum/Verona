import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import validator from 'validator';
import User from '../models/userModel.js';

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
  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    fullname_en,
    fullname_ar,
    email,
    phoneNumber,
    dateOfBirth,
    password: hashedPassword,
    role,
    status,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      fullname_en: user.fullname_en,
      fullname_ar: user.fullname_ar,
      email: user.email,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      role: user.role,
      status: user.status,
      token: generateToken(user._id),
    });
    // res.status(201).json('User createsd successfully')
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const adminController = { registerUser };

export default adminController;
