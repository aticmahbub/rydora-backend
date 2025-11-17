import {Request, Response} from 'express';
import {UserService} from './user.service';
import {catchAsync} from '../../utils/catchAsync';
import {sendResponse} from '../../utils/sendResponse';
import {JwtPayload} from 'jsonwebtoken';

const createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createUser(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'User created successfully',
        data: result,
    });
});

const getUsers = catchAsync(async (req: Request, res: Response) => {
    const {page, limit, search, role, isActive} = req.query;
    const result = await UserService.getUsers({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string,
        role: role as string,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Users retrieved successfully',
        data: result.users,
        meta: {
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
        },
    });
});

const getUserInfo = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const result = await UserService.getUserById(decodedToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'User retrieved successfully',
        data: result,
    });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const decodedToken = req.user as JwtPayload;
    const result = await UserService.getUserById(userId, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'User retrieved successfully',
        data: result,
    });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const verifiedToken = req.user as JwtPayload;
    const payload = req.body;

    const updatedUser = await UserService.updateUser(
        userId,
        payload,
        verifiedToken,
    );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'User updated successfully',
        data: updatedUser,
    });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const verifiedToken = req.user as JwtPayload;

    await UserService.deleteUser(userId, verifiedToken);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'User deleted successfully',
        data: null,
    });
});

const bulkUpdateUsers = catchAsync(async (req: Request, res: Response) => {
    const {userIds, payload} = req.body;
    const verifiedToken = req.user as JwtPayload;

    const result = await UserService.bulkUpdateUsers(
        userIds,
        payload,
        verifiedToken,
    );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Users updated successfully',
        data: result,
    });
});
export const UserController = {
    createUser,

    updateUser,
    getUserInfo,

    getUsers,

    getUserById,

    deleteUser,
    bulkUpdateUsers,
};
