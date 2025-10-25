import AppError from '../../errorHelpers/AppError';
import {
    createAccessTokenWithRefreshToken,
    createUserTokens,
} from '../../utils/userTokens';
import {IUser} from '../user/user.interface';
import {User} from '../user/user.model';
import bcryptjs from 'bcryptjs';

const credentialsLogin = async (payload: Partial<IUser>) => {
    const {email, password} = payload;

    const isUserExist = await User.findOne({email});
    if (!isUserExist) {
        throw new AppError(404, 'User does not exist');
    }

    const isPasswordMatched = bcryptjs.compare(
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

export const AuthService = {credentialsLogin, getNewAccessToken};
