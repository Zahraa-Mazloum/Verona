import mongoose from 'mongoose';
import User from './userModel'



const adminSchema = new mongoose.Schema({
});

const Admin = User.discriminator('admin', adminSchema);

module.exports = Admin;
