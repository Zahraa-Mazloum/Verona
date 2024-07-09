import asyncHandler from "express-async-handler";
import InvestmentTypes from '../models/invesmentTypesModel.js'

export const addInvestmentType = asyncHandler(async(req,res)=>{
const {title_en , description_en , title_ar , description_ar} = req.body;

if (!title_en , !title_ar){
    res.status(400).json({message: "Please fill all the fields"})
}
const investmentType = new InvestmentTypes({title_en , title_ar , description_en , description_ar})

try{
    await investmentType.save();
    res.status(201).json({message: "Investment type created successfully"})
}
catch(err){
    res.status(400).json({message: err.message})
}


})

export const getTypesByLanguage = asyncHandler(async (req, res) => {
    const { lang } = req.params;
    let types;


    if (lang === 'en') {
        types = await InvestmentTypes.find({}, 'title_en  description_en');
    } else if (lang === 'ar') {
        types = await InvestmentTypes.find({}, 'title_ar  description_ar');
    } else {
        return res.status(400).json({ message: 'Invalid language parameter' });
    }

    console.log(types); 
    res.status(200).json(types);
});


export const getTypeById = asyncHandler(async (req, res) => {
    const type = await InvestmentTypes.findById(req.params.id);

    if (type) {
        res.status(200).json(type);
    } else {
        res.status(404).json({ message: 'type not found' });
    }
});

export const updateType = asyncHandler(async (req, res) => {
    const { title_en, description_en, title_ar, description_ar } = req.body;
    const type = await InvestmentTypes.findById(req.params.id);

    if (type) {
        type.title_en = title_en || type.title_en;
        type.description_en = description_en || type.description_en;
        type.title_ar = title_ar || type.title_ar;
        type.description_ar = description_ar || type.description_ar;

        const updatedtype = await type.save();
        res.status(200).json(updatedtype);
    } else {
        res.status(404).json({ message: 'type not found' });
    }
});

export const deleteType = asyncHandler(async (req, res) => {
    const type = await InvestmentTypes.findById(req.params.id);

    if (type) {
        await type.deleteOne();
        res.status(200).json({ message: 'type removed' });
    } else {
        res.status(404).json({ message: 'type not found' });
    }
});

const typeController = { addInvestmentType, getTypesByLanguage, getTypeById, updateType, deleteType };

export default typeController;
