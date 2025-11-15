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

// Ride details
const getRideDetails = catchAsync(async (req: Request, res: Response) => {
    const {rideId} = req.params;
    const decodedToken = req.user;

    const ride = await RideService.getRideDetails(rideId, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Ride details fetched successfully',
        data: ride,
    });
});

//  paginated ride history with filters
const getRideHistory = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;
    const filters = req.query;

    const result = await RideService.getRideHistory(decodedToken, filters);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Ride history fetched successfully',
        data: result,
    });
});

// ride statistics

const getRideStats = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;

    const stats = await RideService.getRideStats(decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Ride statistics fetched successfully',
        data: stats,
    });
});

const acceptRide = catchAsync(async (req: Request, res: Response) => {
    const rideId = req.params.rideId;
    const decodedToken = req.user; // Add this line
    const acceptedRide = await RideService.acceptRide(rideId, decodedToken); // Pass both arguments
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Ride accepted successfully',
        data: acceptedRide,
    });
});

const cancelRide = catchAsync(async (req: Request, res: Response) => {
    const rideId = req.params.rideId;
    const decodedToken = req.user; // Add this line
    const cancelledRide = await RideService.cancelRide(rideId, decodedToken); // Pass both arguments
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Ride cancelled successfully',
        data: cancelledRide,
    });
});

export const RideController = {
    requestRide,
    getRideDetails,
    findRides,
    acceptRide,
    cancelRide,
    getRideStats,
    getRideHistory,
};
