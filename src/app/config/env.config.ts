import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
    PORT: string;
    MONGO_URI: string;
    NODE_ENV: 'development' | 'production';
    JWT_ACCESS_SECRET: string;
    JWT_EXPIRES_IN: string;
    BCRYPTJS_SALT_ROUND: string;
    SUPER_ADMIN_EMAIL: string;
    SUPER_ADMIN_PASSWORD: string;
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = [
        'PORT',
        'MONGO_URI',
        'NODE_ENV',
        'JWT_ACCESS_SECRET',
        'JWT_EXPIRES_IN',
        'BCRYPTJS_SALT_ROUND',
        'SUPER_ADMIN_EMAIL',
        'SUPER_ADMIN_PASSWORD',
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
        BCRYPTJS_SALT_ROUND: process.env.BCRYPTJS_SALT_ROUND as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_EMAIL as string,
    };
};

export const envVars = loadEnvVariables();
