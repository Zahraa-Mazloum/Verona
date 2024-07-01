import mongoose from "mongoose";

const invesmentSchma = new mongoose.Schema({
title:{
    type: String,
    required: [true , "Please add the Title of invesment"]
},
amount:{
    type:Number,
    required:[true , "Please add the amount of invesment"]
},
Currency:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Currency'
},
type:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'types'
},
profit:{
    type:Number,
},
contract:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'contract'
},
invesmentStatus:{
    type:Boolean,
    default:true
},


})