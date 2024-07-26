import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import adminRoutes from './routes/adminRoutes.js';
import investorRoutes from './routes/investorRoutes.js';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import currencyRoutes from './routes/currencyRoutes.js';
import contractRoutes from './routes/contractRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import investmentTypesRoutes from './routes/investmentTypesRoutes.js';
import investmentRoutes from './routes/investmentRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import http from 'http';
import { Server } from 'socket.io';
import InvestorDashboard from './routes/invDashboardRoutes.js';

// Configuration
config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 10000 }));
app.use(cors());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/contract', contractRoutes);
app.use('/api/dash', dashboardRoutes);
app.use('/api/types', investmentTypesRoutes);
app.use('/api/inv', investmentRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/invDash', InvestorDashboard);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

export { io };

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
