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

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getAllUsers();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Users retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
});

const getUserInfo = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const result = await UserService.getUserInfo(decodedToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'User retrieved successfully',
        data: result.data,
    });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;

    const updatedUser = await UserService.updateUser(
        userId,
        payload,
        verifiedToken,
    );

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'User updated successfully',
        data: updatedUser,
    });
});
export const UserController = {
    createUser,
    getAllUsers,
    updateUser,
    getUserInfo,
};
