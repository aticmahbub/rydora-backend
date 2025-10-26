import {JwtPayload} from 'jsonwebtoken';
import AppError from '../../errorHelpers/AppError';
import {IAuthProvider, IsActive, IUser, Role} from './user.interface';
import {User} from './user.model';
import bcryptjs from 'bcryptjs';
import {envVars} from '../../config/env.config';

const createUser = async (payload: Partial<IUser>) => {
    const {email, password, ...rest} = payload;

    if (!email || !password) {
        throw new AppError(400, 'Email and password are required');
    }

    const isUserExist = await User.findOne({email});
    if (isUserExist) {
        throw new AppError(409, 'User already exist');
    }

    const authProvider: IAuthProvider = {
        provider: 'credentials',
        providerId: email as string,
    };

    const hashedPassword = await bcryptjs.hash(password as string, 10);

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest,
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return userWithoutPassword;
};

const getAllUsers = async () => {
    const users = await User.find({});
    const totalUsers = await User.countDocuments();

    return {data: users, meta: {total: totalUsers}};
};

const updateUser = async (
    userId: string,
    payload: IUser,
    decodedToken: JwtPayload,
) => {
    const isUserExist = await User.findById(userId);
    if (!isUserExist) {
        throw new AppError(404, 'User not found');
    }

    if (isUserExist.isDeleted || isUserExist.isActive === IsActive.BLOCKED) {
        throw new AppError(403, 'Forbidden. Forbidden. User is not allowed.');
    }
    if (payload.role === Role.DRIVER || payload.role === Role.RIDER) {
        throw new AppError(403, 'Forbidden. User is not allowed.');
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
        throw new AppError(
            403,
            'Forbidden. User is not allowed to perform this action',
        );
    }

    if (
        payload.isActive ||
        payload.isDeleted ||
        payload.isNIDVerified ||
        payload.isVerified
    ) {
        if (
            decodedToken.role === Role.DRIVER ||
            decodedToken.role === Role.SUPER_ADMIN
        ) {
            throw new AppError(
                403,
                'You are not allowed to perform this action',
            );
        }
    }

    if (payload.password) {
        payload.password = await bcryptjs.hash(
            payload.password,
            envVars.BCRYPTJS_SALT_ROUND,
        );
    }
    const updatedUser = await User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });

    return updatedUser;
};

export const UserService = {createUser, getAllUsers, updateUser};
