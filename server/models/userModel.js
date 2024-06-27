import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
    enum: ['admin', 'investor', 'employee'],
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
}, {
  timestamps: true,
  discriminatorKey: 'userrole',
  collection: 'users',
});

const User = mongoose.model('User', userSchema);

export default User;
