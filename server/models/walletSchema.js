import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  investorInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investor',
  },
  amount: {
    type: Number,
  },  

});

const Wallet = mongoose.model('Wallet', walletSchema, 'Wallet');
export default Wallet;
