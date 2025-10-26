import {Request, Response} from 'express';
import {catchAsync} from '../../utils/catchAsync';
import {sendResponse} from '../../utils/sendResponse';
// import {TripService} from './trip.service';

const requestTrip = catchAsync(async (req: Request, res: Response) => {
    // const decodedToken = req.user;
    // const payload = req.body;

    // const trip = await TripService.requestTrip(decodedToken, payload);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'Trip requested successfully',
        data: {},
    });
});

export const TripController = {requestTrip};
