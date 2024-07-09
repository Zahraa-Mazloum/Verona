import mongoose from "mongoose";

const invesmentTypeSchema = new mongoose.SchemaType({
    title:{
        type:String,
        required: [true, "Please add the title"]
    },
    description:{
        type:String
    }

},
{
    timestamps: true,
});

const Types= mongoose.model('Types' , invesmentTypeSchema , 'Types' )

export default Types;