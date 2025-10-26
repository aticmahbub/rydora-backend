import {Request, Response} from 'express';
import {UserService} from './user.service';
import {catchAsync} from '../../utils/catchAsync';
import {sendResponse} from '../../utils/sendResponse';

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
// const getAllUsers = catchAsync(async (req: Request, res: Response) => {
//     const result = await UserService.getAllUsers();

//     sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: 'Users retrieved successfully',
//         data: result.data,
//         meta: result.meta,
//     });
// });

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
        statusCode: 200,
        message: 'User is updated successfully',
        data: updatedUser,
    });
});
export const UserController = {createUser, getAllUsers, updateUser};
