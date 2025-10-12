import {Request, Response, NextFunction} from 'express';
import {envVars} from '../config/env.config';

export const globalErrorHandler = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    err: any,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
) => {
    const statusCode = 500;
    const message = `Something went wrong... ${err.message}`;
    res.status(statusCode).json({
        success: false,
        message,
        err,
        stack: envVars.NODE_ENV === 'development' ? err.stack : null,
    });
};
