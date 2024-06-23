import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    fullname_en: {
        type: String,
        required: [true, 'Please add a full name in English']
    },
    fullname_ar: {
        type: String,
        required: [true, 'Please add a full name in Arabic']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please add a phone number'],
        unique: true,
    },
    dateOfBirth: {
        type: Date,
    },
    password: {
        type: String,
        required: [true, 'Please set a password']
    },
    role: {
        type: String,
        enum: ['admin', 'investor', 'employee'],
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
},
{
timestamps: true
},

{ collection: 'users' });

const User = model('User', userSchema);

export default User;
