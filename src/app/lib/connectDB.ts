import mongoose from 'mongoose';
import {envVars} from '../config/env.config';

export const connectDB = async () => {
    try {
        await mongoose.connect(envVars.MONGO_URI);
        console.log('connected to db with mongoose');
    } catch (err) {
        console.error('Database connection failed', err);
        process.exit(1);
    }
};
