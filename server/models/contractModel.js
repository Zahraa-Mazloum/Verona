    import mongoose from 'mongoose';

    const contractSchema = new mongoose.Schema({
      investorInfo: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Investor', 
        required: true },
      amount: { 
        type: Number, 
        required: true },
      // currency: { 
      //   type: mongoose.Schema.Types.ObjectId, 
      //   ref: 'Currency', 
      //   required: true },
      contractTime: {
        type: String,
          enum: ['month', 'year', 'day'], 
        required: true },
      contractTime_ar: { 
        type: String, enum: ['شهر', 'سنة', 'يوم'],
        required: true },
      startDate: { 
        type: Date, 
        equired: true },
      endDate: { type: Date },
      contractPercentage: { type: Number },
      profit: { type: Number },
      payment: { type: Number },
      investmentStatus: { type: Boolean, default: true },
      withdraw: { type: Number},
    }, { timestamps: true });

    contractSchema.pre('save', function(next) {
      if (this.isModified('startDate') || this.isNew) {
        const startDate = this.startDate;
        let endDate = new Date(startDate);

        if (this.contractTime === 'month' || this.contractTime === 'شهر') {
          endDate.setMonth(startDate.getMonth() + 1);
          this.contractPercentage = 2; 
        } else if (this.contractTime === 'year' || this.contractTime === 'سنة') {
          endDate.setFullYear(startDate.getFullYear() + 1);
          this.contractPercentage = 36; 
        } else if (this.contractTime === 'day' || this.contractTime === 'يوم') {
          endDate.setDate(startDate.getDate() + 1);
          this.contractPercentage = 2; 
        }
        this.endDate = endDate;
      }

      if (this.isModified('amount') || this.isNew) {
        this.profit = this.amount * (this.contractPercentage / 100);
        this.payment = this.amount + this.profit;
        this.withdraw = this.amount+ this.currentProfit;
      }

      next();
    });

    contractSchema.virtual('isMatured').get(function() {
      return new Date() >= this.endDate;
    });

    contractSchema.virtual('currentProfit').get(function() {
      const now = new Date();
      if (now >= this.endDate) {
        return this.profit;
      }
      
      const duration = {
        day: 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        year: 365 * 24 * 60 * 60 * 1000
      }[this.contractTime];

      const elapsedTime = now - this.startDate;
      const elapsedPercentage = elapsedTime / duration;
      return this.amount * (this.contractPercentage / 100) * elapsedPercentage;
    });

    contractSchema.set('toJSON', { virtuals: true });
    contractSchema.set('toObject', { virtuals: true });

    const Contract = mongoose.model('Contract', contractSchema);

    export default Contract;
