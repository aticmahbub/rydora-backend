import {JwtPayload} from 'jsonwebtoken';
import AppError from '../../errorHelpers/AppError';
import {
    createAccessTokenWithRefreshToken,
    createUserTokens,
} from '../../utils/userTokens';
import {IUser} from '../user/user.interface';
import {User} from '../user/user.model';
import bcryptjs from 'bcryptjs';
import {envVars} from '../../config/env.config';

const credentialsLogin = async (payload: Partial<IUser>) => {
    const {email, password} = payload;

    const isUserExist = await User.findOne({email});
    if (!isUserExist) {
        throw new AppError(404, 'User does not exist');
    }

    const isPasswordMatched = await bcryptjs.compare(
        password as string,
        isUserExist.password as string,
    );
    if (!isPasswordMatched) {
        throw new AppError(401, 'Password is not matched');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password: pass, ...rest} = isUserExist.toObject();

    const userTokens = createUserTokens(isUserExist);

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest,
    };
};

const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createAccessTokenWithRefreshToken(
        refreshToken,
    );
    return {accessToken: newAccessToken};
};

const resetPassword = async (
    oldPassword: string,
    newPassword: string,
    decodedToken: JwtPayload,
) => {
    const user = await User.findById(decodedToken.userId);

    const isOldPasswordMatched = await bcryptjs.compare(
        oldPassword,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        user!.password as string,
    );

    if (!isOldPasswordMatched) {
        throw new AppError(401, 'Old password is not matched');
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user!.password = await bcryptjs.hash(
        newPassword,
        Number(envVars.BCRYPTJS_SALT_ROUND),
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user!.save();
};

export const AuthService = {credentialsLogin, getNewAccessToken, resetPassword};
