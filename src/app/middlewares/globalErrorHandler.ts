import {Request, Response, NextFunction} from 'express';
import {envVars} from '../config/env.config';
import AppError from '../errorHelpers/AppError';

export const globalErrorHandler = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    err: any,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
) => {
    let statusCode = 500;
    let message = `Something went wrong... ${err.message}`;

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        err,
        stack: envVars.NODE_ENV === 'development' ? err.stack : null,
    });
};
