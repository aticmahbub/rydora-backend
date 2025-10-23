import {NextFunction, Request, Response} from 'express';
import AppError from '../errorHelpers/AppError';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {envVars} from '../config/env.config';

export const checkAuth =
    (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.headers.authorization;
            if (!accessToken) {
                throw new AppError(401, 'No access token received');
            }

            const verifiedToken = jwt.verify(
                accessToken,
                envVars.JWT_ACCESS_SECRET,
            ) as JwtPayload;
            if (!verifiedToken) {
                throw new AppError(401, 'Invalid access token');
            }

            if (!authRoles.includes(verifiedToken.role)) {
                throw new AppError(401, 'Unauthorized access token');
            }

            req.user = verifiedToken;
            next();
        } catch (error) {
            console.log('jwt error');
            next(error);
        }
    };
