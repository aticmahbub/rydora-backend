import {JwtPayload} from 'jsonwebtoken';
import {envVars} from '../config/env.config';
import {IsActive, IUser} from '../modules/user/user.interface';
import {generateToken, verifyToken} from './jwt';
import {User} from '../modules/user/user.model';
import AppError from '../errorHelpers/AppError';

export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };

    const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_ACCESS_SECRET,
        envVars.JWT_ACCESS_EXPIRES,
    );

    const refreshToken = generateToken(
        jwtPayload,
        envVars.JWT_REFRESH_SECRET,
        envVars.JWT_REFRESH_EXPIRES,
    );
    return {accessToken, refreshToken};
};

export const createAccessTokenWithRefreshToken = async (
    refreshToken: string,
) => {
    const verifiedRefreshToken = verifyToken(
        refreshToken,
        envVars.JWT_REFRESH_SECRET,
    ) as JwtPayload;

    const isUserExist = await User.findOne({email: verifiedRefreshToken.email});

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
        throw new AppError(403, `User is blocked${isUserExist.isActive}`);
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };

    const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_ACCESS_SECRET,
        envVars.JWT_ACCESS_EXPIRES,
    );
    return accessToken;
};
