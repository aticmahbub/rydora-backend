import {Request, Response} from 'express';
import {catchAsync} from '../../utils/catchAsync';
import {sendResponse} from '../../utils/sendResponse';
import {AuthService} from './auth.service';

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
    const userInfo = await AuthService.credentialsLogin(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User logged in successfully',
        data: userInfo,
    });
});

// const updateUser = catchAsync(async (req: Request, res: Response) => {
//     const userId = req.params;
//     const updatedDoc = req.body;
//     const userInfo = await AuthService.updateUser(userId, updatedDoc);

//     sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: 'User logged in successfully',
//         data: userInfo,
//     });
// });

export const AuthController = {credentialsLogin};
