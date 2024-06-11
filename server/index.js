import express from 'express';
import bodyParser from 'body-parser';
import mongoose, { Mongoose } from 'mongoose';
import cors from 'cors';
import {config} from "dotenv";
import helmet from 'helmet';
import morgan from 'morgan';
import adminRoutes from './routes/admin.js';
import investorRoutes from './routes/investor.js';
import connectDB from "./config/db.js"



// Configuration 

config()
connectDB()
const app =express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common")); 
app.use(bodyParser.json());
app.use (bodyParser.urlencoded({extended:false}));
app.use(cors());

// Routes 
 
app.use("/admim", adminRoutes);
app.use("/investor",investorRoutes);



const Port = process.env.PORT || 9000;

app.listen(Port,(req,res)=>
    {console.log(`server listen on port ${Port}`)
    })