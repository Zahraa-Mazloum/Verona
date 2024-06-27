import mongoose from "mongoose";

const currencySchema = new mongoose.Schema({

    name:{
        type:String,
        required: [true, 'please add the name of the currency'],
    },
    symbol:{
        type:String,
        required: [true, 'please add the symbol of the currency'],
        },
    description:{
        type:String,
        
    },
},
{
    timestamps:true,
    collection : 'currencies',
});

const Currency = mongoose.model('Currency' , currencySchema);

export default Currency;