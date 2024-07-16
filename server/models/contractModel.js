import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
    investorInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Investor',
        required: true
    },
    amount:{
          type: Number,
          required : true
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
      contractTime_ar: {
        type: String,
        enum: ['شهر' , 'سنة'],
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
    profit:{
type:Number,
    },
  payment:{
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

        if (this.contractTime === 'month' || this.contractTime === 'شهر') {
            endDate.setMonth(startDate.getMonth() + 1);
            this.contractPercentage = 2; 
        } else if (this.contractTime === 'year' || this.contractTime ==='سنة') {
            endDate.setFullYear(startDate.getFullYear() + 1);
            this.contractPercentage = 36; 
        }

        this.endDate = endDate;
    }

    if (this.isModified('amount') || this.isNew)
    this.profit=this.amount * (this.contractPercentage / 100)
    this.payment = this.amount + this.profit;


    next();
});

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;
