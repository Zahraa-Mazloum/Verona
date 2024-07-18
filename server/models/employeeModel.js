import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
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
    default: 'employee',
  },
  onboarding: {
    type: Date,
  },
  offboarding: {
    type: Date,
  },
  salary: {
    type: Number,
  },
  salaryCurrency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Currency',
  },
}, {
  timestamps: true,
});

const Employee = mongoose.model('Employee', employeeSchema, 'Employees');

export default Employee;
