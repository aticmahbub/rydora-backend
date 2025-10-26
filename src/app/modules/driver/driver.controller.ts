import {Request, Response} from 'express';
import {catchAsync} from '../../utils/catchAsync';
import {sendResponse} from '../../utils/sendResponse';
import {DriverService} from './driver.service';

const registerDriver = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;
    const payload = req.body;

    const driver = await DriverService.registerDriver(decodedToken, payload);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'Driver account created successfully',
        data: driver,
    });
});

export const DriverController = {registerDriver};
