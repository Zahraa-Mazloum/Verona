import mongoose from 'mongoose';

const adminNotificationSchema = new mongoose.Schema(
  {
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
    },
    wallet:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
    },
    type: {
      type: String,
      enum: ['cashout', 'transfer'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    amount:{
        type:Number,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    status:{
      type: String,
      default : 'declined'
    },
    paymentScreenshot: {
      data: Buffer,
      contentType: String,
    }
  },
  {
    timestamps: true,
  }
);

const AdminNotification = mongoose.model('AdminNotification', adminNotificationSchema);

export default AdminNotification;
