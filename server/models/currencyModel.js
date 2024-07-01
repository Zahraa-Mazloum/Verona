import mongoose from "mongoose";

const currencySchema = new mongoose.Schema({

    name:{
        type:String,
        required: [true, 'please add the name of the currency'],
    },
    symbol:{
        type:String,
        enum: ['USD', 'AED', 'OMR'],
        required: [true, 'please add the symbol of the currency'],
        },
    description:{
        type:String,
        
    },
},
{
    timestamps:true,
});

const Currency = mongoose.model('Currency' , currencySchema, 'Currency');

export default Currency;