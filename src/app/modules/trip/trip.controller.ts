import {Request, Response} from 'express';
import {catchAsync} from '../../utils/catchAsync';
import {sendResponse} from '../../utils/sendResponse';
import {TripService} from './trip.service';

const requestTrip = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;
    const payload = req.body;

    const trip = await TripService.requestTrip(decodedToken, payload);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'Trip requested successfully',
        data: trip,
    });
});

const findTrips = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;

    const trip = await TripService.findTrips(decodedToken);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'Trips fetched successfully',
        data: trip,
    });
});
const acceptTrip = catchAsync(async (req: Request, res: Response) => {
    const tripId = req.params.tripId;

    const acceptedTrip = await TripService.acceptTrip(tripId);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'Trips fetched successfully',
        data: acceptedTrip,
    });
});

export const TripController = {requestTrip, findTrips, acceptTrip};
