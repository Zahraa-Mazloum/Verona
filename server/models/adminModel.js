import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  fullname_en: {
    type: String,
    required: [true, 'Please add the full name in English'],
  },
  fullname_ar: {
    type: String,
    required: [true, 'Please add the full name in Arabic'],
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
    default: 'admin',
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
}, {
  timestamps: true,
  
});

const Admin = mongoose.model('Admin', adminSchema, 'Admin');

export default Admin;
