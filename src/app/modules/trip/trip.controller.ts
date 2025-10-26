import {Request, Response} from 'express';
import {catchAsync} from '../../utils/catchAsync';
import {sendResponse} from '../../utils/sendResponse';
import {TripService} from './trip.service';

const requestTrip = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;
    const payload = req.body;
    console.log('Decoded Token:', decodedToken);
    console.log('Payload received:', payload);
    const trip = await TripService.requestTrip(decodedToken, payload);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'Trip requested successfully',
        data: trip,
    });
});

export const TripController = {requestTrip};
