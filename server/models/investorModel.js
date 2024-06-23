import mongoose from 'mongoose';
import User from './userModel'



const investorSchema = new mongoose.Schema({
    passportNumber: {
        type: String,
        required: [true, 'Please add the passport number']
    },
    passportExpiryDate: {
        type: Date,
        required: true
    },
    passportPhoto:{
        type:String,
        required: true
    },
});

const Investor = User.discriminator('investor', investorSchema);

module.exports = Investor;
