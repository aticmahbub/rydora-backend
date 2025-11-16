import {JwtPayload} from 'jsonwebtoken';
import AppError from '../../errorHelpers/AppError';
import {IAuthProvider, IUser, Role} from './user.interface';
import {User} from './user.model';
import bcryptjs from 'bcryptjs';

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
    if (decodedToken.role === Role.DRIVER || decodedToken.role === Role.RIDER) {
        if (userId !== decodedToken.userId) {
            throw new AppError(400, 'You are not authorized');
        }
    }
    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
        throw new AppError(404, 'User Not Found');
    }
    if (
        decodedToken.role === Role.ADMIN &&
        isUserExist.role === Role.SUPER_ADMIN
    ) {
        throw new AppError(401, 'You are unauthorized');
    }
    if (payload.role) {
        if (
            decodedToken.role === Role.RIDER ||
            decodedToken.role === Role.DRIVER
        ) {
            throw new AppError(403, 'You are not authorized');
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (
            decodedToken.role === Role.RIDER ||
            decodedToken.role === Role.DRIVER
        ) {
            throw new AppError(403, 'You are not authorized');
        }
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });

    return newUpdatedUser;
};

const getUserInfo = async (userId: string) => {
    const user = await User.findById(userId).select('-password');
    return {data: user};
};
export const UserService = {createUser, getAllUsers, updateUser, getUserInfo};
