import {NextFunction, Request, Response} from 'express';
import AppError from '../errorHelpers/AppError';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {envVars} from '../config/env.config';
import {User} from '../modules/user/user.model';
import {IsActive} from '../modules/user/user.interface';

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

            const isUserExist = await User.findOne({
                email: verifiedToken.email,
            });

            if (!isUserExist) {
                throw new AppError(404, 'User does not exist');
            }

            if (isUserExist.isDeleted) {
                throw new AppError(410, 'User is deleted');
            }
            if (
                isUserExist.isActive === IsActive.BLOCKED ||
                isUserExist.isActive === IsActive.INACTIVE
            ) {
                throw new AppError(403, `User is ${isUserExist.isActive}`);
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
