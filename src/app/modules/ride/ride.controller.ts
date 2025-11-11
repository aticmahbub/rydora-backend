import {Request, Response} from 'express';
import {catchAsync} from '../../utils/catchAsync';
import {sendResponse} from '../../utils/sendResponse';
import {RideService} from './ride.service';

const requestRide = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;
    const payload = req.body;

    const ride = await RideService.requestRide(decodedToken, payload);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'Ride requested successfully',
        data: ride,
    });
});

const findRides = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;

    const ride = await RideService.findRides(decodedToken);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'Rides fetched successfully',
        data: ride,
    });
});

const acceptRide = catchAsync(async (req: Request, res: Response) => {
    const rideId = req.params.rideId;

    const acceptedRide = await RideService.acceptRide(rideId);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'Ride accepted successfully',
        data: acceptedRide,
    });
});

const cancelRide = catchAsync(async (req: Request, res: Response) => {
    const rideId = req.params.rideId;

    const acceptedRide = await RideService.cancelRide(rideId);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'Ride cancelled successfully',
        data: acceptedRide,
    });
});

export const RideController = {requestRide, findRides, acceptRide, cancelRide};
