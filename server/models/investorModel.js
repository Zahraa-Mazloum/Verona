import mongoose from 'mongoose';
import User from './userModel.js';

const investorSchema = new mongoose.Schema({
  passportNumber: {
    type: String,
    required: [true, 'Please add the passport number'],
  },
  passportExpiryDate: {
    type: Date,
    required: true,
  },
  passportPhoto: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Investor = User.discriminator('Investor', investorSchema);

export default Investor;
