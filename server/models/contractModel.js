import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
    investorInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Investor',
        required: true
    },
    amount: {
        type: Number,
        required: [true, "Please add the amount"],
    },
    currency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Currency',
        required: true
    },
    contractTime: {
        type: String,
        enum: ['month', 'year'],
        required: [true, "Please enter the duration"]
    },
    startDate: {
        type: Date,
        required: [true, "Please enter the start date"]
    },
    endDate: {
        type: Date,
    },
    contractPercentage: {
        type: Number,
    },
    payment: {
        type: Number
    },
    investmentStatus: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

contractSchema.pre('save', function(next) {
    if (this.isModified('startDate') || this.isNew) {
        const startDate = this.startDate;
        let endDate = new Date(startDate);

        if (this.contractTime === 'month') {
            endDate.setMonth(startDate.getMonth() + 1);
            this.contractPercentage = 2; 
        } else if (this.contractTime === 'year') {
            endDate.setFullYear(startDate.getFullYear() + 1);
            this.contractPercentage = 36; 
        }

        this.endDate = endDate;
    }

    // Calculate payment based on amount and contractPercentage
    if (this.isModified('amount') || this.isModified('contractPercentage') || this.isNew) {
        this.payment = this.amount * (this.contractPercentage / 100);
    }

    next();
});

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;
