import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    title_ar:{
        type:String,
    },
    investorInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Investor',
        required: true
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



    next();
});

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;
