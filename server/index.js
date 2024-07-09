import express from 'express';
import bodyParser from 'body-parser';
import mongoose, { Mongoose } from 'mongoose';
import cors from 'cors';
import {config} from "dotenv";
import helmet from 'helmet';
import morgan from 'morgan';
import adminRoutes from './routes/adminRoutes.js';
import investorRoutes from './routes/investorRoutes.js';
import connectDB from "./config/db.js"
import userRoutes from './routes/userRoutes.js';
import currencyRoutes from './routes/currencyRoutes.js';
import contractRoutes from './routes/contractRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js'
// import { notFound, errorHandler } from './middleware/errorMiddleware.js';


// Configuration 

config()
connectDB()
const app =express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common")); 
app.use(bodyParser.json());
app.use (bodyParser.urlencoded({extended:true}));
app.use(cors());

// Routes 
app.use('/api/user' ,userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/currency',currencyRoutes)
app.use('/api/contract',contractRoutes)
app.use('/api/dash',dashboardRoutes)



const Port = process.env.PORT || 9000;

app.listen(Port,(req,res)=>
    {console.log(`server listen on port ${Port}`)
    })