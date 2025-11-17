/* eslint-disable @typescript-eslint/no-explicit-any */
import {JwtPayload} from 'jsonwebtoken';
import AppError from '../../errorHelpers/AppError';
import {IAuthProvider, IsActive, IUser, Role} from './user.interface';
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

const getUsers = async (filters: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
}) => {
    const {page = 1, limit = 10, search, role, isActive} = filters;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    // Search in name, email, phone
    if (search) {
        query.$or = [
            {name: {$regex: search, $options: 'i'}},
            {email: {$regex: search, $options: 'i'}},
            {phone: {$regex: search, $options: 'i'}},
        ];
    }

    // Filter by role
    if (role) {
        query.role = role;
    }

    // Filter by active status
    if (isActive !== undefined) {
        query.isActive = isActive;
    }

    // Exclude deleted users
    query.isDeleted = false;

    const [users, total] = await Promise.all([
        User.find(query)
            .select('-password')
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit),
        User.countDocuments(query),
    ]);

    return {
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};

const getUserById = async (
    userId: string,
    decodedToken?: JwtPayload,
): Promise<IUser> => {
    const user = await User.findById(userId).select('-password');

    if (!user) {
        throw new AppError(404, 'User not found');
    }

    // Permission checks for non-public access
    if (decodedToken) {
        if (
            decodedToken.role === Role.DRIVER ||
            decodedToken.role === Role.RIDER
        ) {
            if (userId !== decodedToken.userId) {
                throw new AppError(
                    403,
                    'You are not authorized to view this user',
                );
            }
        }

        if (
            decodedToken.role === Role.ADMIN &&
            user.role === Role.SUPER_ADMIN
        ) {
            throw new AppError(
                403,
                'You are unauthorized to view super admin users',
            );
        }
    }

    return user;
};

const updateUser = async (
    userId: string,
    payload: Partial<IUser>,
    decodedToken: JwtPayload,
): Promise<IUser> => {
    // Check if user is trying to update another user as driver/rider
    if (decodedToken.role === Role.DRIVER || decodedToken.role === Role.RIDER) {
        if (userId !== decodedToken.userId) {
            throw new AppError(
                403,
                'You are not authorized to update other users',
            );
        }
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
        throw new AppError(404, 'User not found');
    }

    // Check if admin is trying to update super admin
    if (
        decodedToken.role === Role.ADMIN &&
        existingUser.role === Role.SUPER_ADMIN
    ) {
        throw new AppError(
            403,
            'You are unauthorized to update super admin users',
        );
    }

    // Role assignment permissions
    if (payload.role) {
        if (
            decodedToken.role === Role.RIDER ||
            decodedToken.role === Role.DRIVER
        ) {
            throw new AppError(403, 'You are not authorized to change roles');
        }

        if (
            payload.role === Role.SUPER_ADMIN &&
            decodedToken.role === Role.ADMIN
        ) {
            throw new AppError(403, 'You cannot assign SUPER_ADMIN role');
        }
    }

    // Status field permissions
    const sensitiveFields = ['isActive', 'isDeleted', 'isVerified'];
    for (const field of sensitiveFields) {
        if (field in payload) {
            if (
                decodedToken.role === Role.DRIVER ||
                decodedToken.role === Role.RIDER
            ) {
                throw new AppError(
                    403,
                    `You are not authorized to update ${field}`,
                );
            }
        }
    }

    // Prevent self-demotion or self-deactivation
    if (userId === decodedToken.userId) {
        if (payload.role && payload.role !== existingUser.role) {
            throw new AppError(403, 'You cannot change your own role');
        }

        if (payload.isActive === IsActive.BLOCKED || IsActive.INACTIVE) {
            throw new AppError(403, 'You cannot deactivate your own account');
        }

        if (payload.isDeleted === true) {
            throw new AppError(403, 'You cannot delete your own account');
        }
    }

    // Hash password if provided
    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    }).select('-password');

    if (!updatedUser) {
        throw new AppError(500, 'Failed to update user');
    }

    return updatedUser;
};

const deleteUser = async (
    userId: string,
    decodedToken: JwtPayload,
): Promise<void> => {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
        throw new AppError(404, 'User not found');
    }

    // Permission checks
    if (
        decodedToken.role === Role.ADMIN &&
        existingUser.role === Role.SUPER_ADMIN
    ) {
        throw new AppError(
            403,
            'You are unauthorized to delete super admin users',
        );
    }

    if (decodedToken.role === Role.DRIVER || decodedToken.role === Role.RIDER) {
        if (userId !== decodedToken.userId) {
            throw new AppError(
                403,
                'You are not authorized to delete other users',
            );
        }
    }

    // Prevent self-deletion
    if (userId === decodedToken.userId) {
        throw new AppError(403, 'You cannot delete your own account');
    }

    await User.findByIdAndUpdate(userId, {
        isDeleted: true,
        isActive: false,
        deletedAt: new Date(),
    });
};

const bulkUpdateUsers = async (
    userIds: string[],
    payload: Partial<IUser>,
    decodedToken: JwtPayload,
): Promise<{updatedCount: number}> => {
    if (decodedToken.role === Role.DRIVER || decodedToken.role === Role.RIDER) {
        throw new AppError(403, 'You are not authorized for bulk operations');
    }

    // Check if any user is super admin when updating as admin
    if (decodedToken.role === Role.ADMIN) {
        const superAdminUsers = await User.find({
            _id: {$in: userIds},
            role: Role.SUPER_ADMIN,
        });

        if (superAdminUsers.length > 0) {
            throw new AppError(403, 'Cannot update super admin users');
        }
    }

    // Remove sensitive fields for non-super-admins
    const filteredPayload = {...payload};
    if (decodedToken.role !== Role.SUPER_ADMIN) {
        delete filteredPayload.role;
        delete filteredPayload.isDeleted;
    }

    const result = await User.updateMany(
        {_id: {$in: userIds}},
        filteredPayload,
    );

    return {updatedCount: result.modifiedCount};
};
export const UserService = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    bulkUpdateUsers,
};
