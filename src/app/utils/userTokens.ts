import {JwtPayload} from 'jsonwebtoken';
import {envVars} from '../config/env.config';
import {IUser} from '../modules/user/user.interface';
import {generateToken, verifyToken} from './jwt';

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

    const jwtPayload = {
        userId: verifiedRefreshToken._id,
        email: verifiedRefreshToken.email,
        role: verifiedRefreshToken.role,
    };

    const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_ACCESS_SECRET,
        envVars.JWT_ACCESS_EXPIRES,
    );
    return accessToken;
};
