import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Admin from '../models/adminModel.js';
import Investor from '../models/investorModel.js';

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await Admin.findById(decoded.id).select('-password') || await Investor.findById(decoded.id).select('-password') // not include the password

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized');
        }
    } else {
        if (!token) {
            res.status(401);
            throw new Error('Not authorized, no token');
        }
    }
});

export const admin = asyncHandler(async (req, res, next) => {
    if (req.user) {
      const admin = await Admin.findById(req.user.id);
      if (admin) {
        next();
      } else {
        res.status(403);
        throw new Error('Not authorized as an admin');
      }
    } else {
      res.status(401);
      throw new Error('Not authorized');
    }
  });
const auth = { protect, admin };
export default auth;
