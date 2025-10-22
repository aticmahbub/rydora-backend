import {envVars} from '../../config/env.config';
import AppError from '../../errorHelpers/AppError';
import {generateToken} from '../../utils/jwt';
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

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };

    const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_ACCESS_SECRET,
        envVars.JWT_EXPIRES_IN,
    );
    return {accessToken};
};
// const updateUser = async (payload: Partial<IUser>) => {};

export const AuthService = {credentialsLogin};
