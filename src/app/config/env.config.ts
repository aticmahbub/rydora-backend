import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
    PORT: string;
    MONGO_URI: string;
    NODE_ENV: 'development' | 'production';
    JWT_ACCESS_SECRET: string;
    JWT_EXPIRES_IN: string;
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = [
        'PORT',
        'MONGO_URI',
        'NODE_ENV',
        'JWT_ACCESS_SECRET',
        'JWT_EXPIRES_IN',
    ];

    requiredEnvVariables.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing required env variables: ${key}`);
        }
    });
    return {
        PORT: process.env.PORT as string,
        MONGO_URI: process.env.MONGO_URI as string,
        NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
    };
};

export const envVars = loadEnvVariables();
