import {Request, Response} from 'express';
import {UserService} from './user.service';
import {catchAsync} from '../../utils/catchAsync';

const createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.createUser(req.body);

    res.status(201).json({
        message: 'User created successfully',
        user,
        success: true,
    });
});

export const UserController = {createUser};
