import mongoose from 'mongoose';

const currencySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add the name of the currency'],
    },
    symbol: {
        type: String,
        enum: ['USD', 'AED', 'OMR'],
        required: [true, 'Please add the symbol of the currency'],
    },
    description: {
        type: String,
    },
    name_ar: {
        type: String,
        required: [true, 'يرجى إضافة اسم العملة'],
    },
    symbol_ar: {
        type: String,
        enum: ['د.إ', 'ريال عماني', '$'],
        required: [true, 'يرجى إضافة رمز العملة'],
    },
    description_ar: {
        type: String,
    },
}, {
    timestamps: true,
});

const Currency = mongoose.model('Currency', currencySchema, 'Currency');

export default Currency;
