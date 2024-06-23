import mongoose from 'mongoose';
import User from './userModel'



const employeeSchema = new mongoose.Schema({
});

const Employee = User.discriminator('employee', employeeSchema);

module.exports = Employee;
