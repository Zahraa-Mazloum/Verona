import mongoose from "mongoose";
import Contract from './contractModel.js';

const investmentSchema = new mongoose.Schema({
    titleInv: {
        type: String,
        required: [true, "Please add the Title of investment"]
    },
    titleInv_ar: {
        type: String,
    },
    amount: {
        type: Number,
        required: [true, "Please add the amount of investment"]
    },
    currency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Currency',
        required: true
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Types'
    },
    dateInv: {
        type: Date,
        required: [true, "Please enter the start date"]
    },
    description: {
        type: String
    },
    investmentStatus: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});


const Investment = mongoose.model('Investment', investmentSchema, 'Investments');

export default Investment;
