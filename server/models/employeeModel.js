import mongoose, { Collection } from 'mongoose';
import User from './userModel';

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
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
    type: Schema.Types.ObjectId,
    ref: 'Currency',
  },
},
{Collection: 'Employees'}

);

const Employee = User.discriminator('employee', employeeSchema);

module.exports = Employee;