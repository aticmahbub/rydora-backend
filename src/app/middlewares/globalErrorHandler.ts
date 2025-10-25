import {NextFunction} from 'express';
import {envVars} from '../config/env.config';
import {TErrorSources} from '../interfaces/error.types';
import {handleCastError} from '../errorHelpers/otherErrorHelpers/handleCastError';
import AppError from '../errorHelpers/AppError';

export const globalErrorHandler = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    err: any,
    req: Request,
    res: Response,
) => {
    if (envVars.NODE_ENV === 'development') {
        console.log(err);
    }

    let errorSources: TErrorSources[] = [];
    let statusCode = 500;
    let message = 'Something Went Wrong!!';

    //Duplicate error
    if (err.code === 11000) {
        const simplifiedError = handlerDuplicateError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Object ID error / Cast Error
    else if (err.name === 'CastError') {
        const simplifiedError = handleCastError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    } else if (err.name === 'ZodError') {
        const simplifiedError = handlerZodError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as TErrorSources[];
    }
    //Mongoose Validation Error
    else if (err.name === 'ValidationError') {
        const simplifiedError = handlerValidationError(err);
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[];
        message = simplifiedError.message;
    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: envVars.NODE_ENV === 'development' ? err : null,
        stack: envVars.NODE_ENV === 'development' ? err.stack : null,
    });
};
