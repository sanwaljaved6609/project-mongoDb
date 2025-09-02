import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT;

app.use('/v1',authRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log("Mongo DB is Connected")})
.catch((err)=>{console.log(err)})

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})