import mongoose from "mongoose";

const investmentTypeSchema = new mongoose.Schema({
    title_en:{
        type:String,
        required: [true, "Please add the title"]
    },
    title_ar:{
        type:String,
        required: [true, "Please add the title"]
    },
    description_en:{
        type:String
    },
    description_ar:{
        type:String
    }
},
{
    timestamps: true,
});

const Types = mongoose.model('Types', investmentTypeSchema);

export default Types;