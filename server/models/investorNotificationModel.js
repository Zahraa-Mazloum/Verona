import mongoose from 'mongoose';

const investorNotificationSchema = new mongoose.Schema(
  {
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
    },
    wallet:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
    },
    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const InvestorNotification = mongoose.model('InvestorNotification', investorNotificationSchema);

export default InvestorNotification;
