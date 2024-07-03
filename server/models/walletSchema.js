import mongoose from "mongoose";
import Investor from "./investorModel";

const walletSchema = new mongoose.Schema({
Investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Investor",
},
amount: {
    type: Number,
    required:[true, "Please add the amount"]
},
})