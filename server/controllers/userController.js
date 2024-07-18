import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import Admin from '../models/adminModel.js';
import Investor from '../models/investorModel.js';

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '3d'});
};


// @desc Login user (Authenticate)
// @route POST /api/users/login
// @access Public
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await Admin.findOne({ email }) || await Investor.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        if (!user) {
            res.status(403);
            throw new Error('User account is unavailable.');
        }
        res.json({
            _id: user.id,
            fullname_en: user.fullname_en,
            fullname_ar: user.fullname_ar,
            email: user.email,
            phoneNumber: user.phoneNumber,
            dateOfBirth: user.dateOfBirth,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

// @desc Get user data
// @route GET /api/users/me
// @access Private
export const myProfile = asyncHandler(async (req, res) => {
    const {_id, fullname_en,fullname_ar, email} = await Admin.findById(req.user.id) || await Investor.findById(req.user.id)
    res.status(200).json({
        id: _id,
        fullname_en,
        fullname_ar,
        email
    })
});

const user = {loginUser, myProfile};

export default user;
