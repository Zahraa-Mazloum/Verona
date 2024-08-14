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
// Static method to aggregate investments by type and currency
investmentSchema.statics.aggregateInvestmentsByTypeAndCurrency = async function () {
    const aggregateResult = await this.aggregate([
        {
            $group: {
                _id: { type: '$type', currency: '$currency' },
                totalAmount: { $sum: '$amount' }
            }
        },
        {
            $lookup: {
                from: 'types',
                localField: '_id.type',
                foreignField: '_id',
                as: 'type'
            }
        },
        { $unwind: '$type' },
        {
            $lookup: {
                from: 'Currency',
                localField: '_id.currency',
                foreignField: '_id',
                as: 'currency'
            }
        },
        { $unwind: '$currency' },
        {
            $project: {
                title: '$type.type_en',
                title_ar: '$type.type_ar',
                currency: '$currency.name',
                currency_ar: '$currency.name_ar',
                totalAmount: 1
            }
        }
    ]);
    return aggregateResult;
};



const Investment = mongoose.model('Investment', investmentSchema, 'Investments');

export default Investment;
