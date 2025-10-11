/* eslint-disable no-console */
import {Server} from 'http';
import mongoose from 'mongoose';
import app from './app';
import {envVars} from './app/config/env.config';

let server: Server;

process.on('uncaughtException', (err) => {
    console.log('Uncaught exception detected. Server shutting down...');
    console.log(err.name, err.message);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
});

const connectDB = async () => {
    try {
        await mongoose.connect(envVars.MONGO_URI);
        console.log('connected to db with mongoose');
    } catch (err) {
        console.error('Database connection failed', err);
        process.exit(1);
    }
};

const startServer = async () => {
    try {
        await connectDB();
        const port = envVars.PORT || 4000;
        server = app.listen(port, () => {
            console.log(`server is listening on port: ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};

startServer();

process.on('unhandledRejection', (reason) => {
    console.log(
        'Unhandled rejection detected. Server shutting down...',
        reason,
    );
    if (server) {
        server.close(() => {
            console.log('Server closed due to unhandled rejection');
            process.exit(1);
        });
    }
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    if (server) {
        server.close(() => {
            console.log('Process terminated.');
            process.exit(1);
        });
    }
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received. Server shutting down...');
    if (server) {
        server.close(() => process.exit(1));
    }
});
