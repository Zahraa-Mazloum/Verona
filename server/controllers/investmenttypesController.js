import asyncHandler from "express-async-handler";
import InvestmentTypes from '../models/invesmentTypes.js'

export const addInvestmentType = asyncHandler(async(req,res)=>{
const {title , description} = req.body;

if (!title || !description){
    res.status(400).json({message: "Please fill all the fields"})
}
try{
    const investmentType = new InvestmentTypes({title , description})
    await investmentType.save();
    res.status(201).json({message: "Investment type created successfully"})
}
catch(err){
    res.status(400).json({message: err.message})
}


})