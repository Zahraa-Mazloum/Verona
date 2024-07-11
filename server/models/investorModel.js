import mongoose from 'mongoose';

const investorSchema = new mongoose.Schema({
  fullname_en: {
    type: String,
    required: [true, 'Please add the full name in English'],
  },
  email: {
    type: String,
    required: [true, 'Please add the email'],
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please add the phone number'],
    unique: true,
  },
  dateOfBirth: {
    type: Date,
  },
  password: {
    type: String,
    required: [true, 'Please set the password'],
  },
  role: {
    type: String,
    required: true,
    default: 'investor',
  },
  status: {
    type: String,
    required: true,
  },
  passportNumber: {
    type: String,
    required: [true, 'Please add the passport number'],
  },
  passportExpiryDate: {
    type: Date,
    required: true,
    
  },
  passportPhoto: {
    data: Buffer,
    contentType: String
  },
  fullname_ar: {
    type: String,
    required: [true, 'Please add the full name in Arabic'],
  },

}, {
  timestamps: true,
});

const Investor = mongoose.model('Investor', investorSchema, 'Investors');

export default Investor;
