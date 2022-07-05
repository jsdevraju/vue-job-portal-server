import express from 'express'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors'
import { config } from 'dotenv';
import errorHandler from './middleware/error.js'

config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Route
import auth from './routes/authRoute.js';
import user from './routes/userRoute.js';
import job from './routes/jobRoute.js'

app.use('/api/v1/auth', auth);
app.use('/api/v1/user', user);
app.use(`/api/v1/job`, job)

// Error Middleware
app.use(errorHandler);


export default app;
