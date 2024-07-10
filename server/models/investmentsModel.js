import mongoose from "mongoose";
import Contract from './contractModel.js'

const investmentSchema = new mongoose.Schema({
    titleInv: {
        type: String,
        required: [true, "Please add the Title of investment"]
    },
    titleInv_ar: {
        type: String,
        // required: [true, "Please add the Arabic Title of investment"]
    },
    amount: {
        type: Number,
        required: [true, "Please add the amount of investment"]
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Types'
    },
    profit: {
        type: Number
    },
    contract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract'
    },
    investmentStatus: {
        type: Boolean,
        default: true
    },
    payment: {
        type: Number
    }
}, {
    timestamps: true
});

// Pre-save middleware to calculate payment based on amount and contractPercentage
investmentSchema.pre('save', async function (next) {
    if (this.isModified('amount') || this.isModified('contract') || this.isNew) {
        if (this.contract) {
            const contract = await Contract.findById(this.contract);
            if (contract) {
                this.profit = this.amount * (contract.contractPercentage / 100);
                this.payment = this.amount + this.profit;
            }
        }
    }
    next();
});
investmentSchema.statics.aggregateInvestmentsPerType = async function () {
    const aggregateResult = await this.aggregate([
        {
            $group: {
                _id: '$type',
                totalAmount: { $sum: '$amount' }
            }
        },
        {
            $lookup: {
                from: 'types',
                localField: '_id',
                foreignField: '_id',
                as: 'type'
            }
        },
        { $unwind: '$type' },
        {
            $project: {
                title: '$type.type_en',
                title_ar: '$type.type_ar',
                totalAmount: 1
            }
        }
    ]);
    return aggregateResult;
};

const Investment = mongoose.model('Investment', investmentSchema, 'Investments');

export default Investment;