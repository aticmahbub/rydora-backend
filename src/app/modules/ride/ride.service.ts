/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {JwtPayload} from 'jsonwebtoken';
import {IRide, RideStatus} from './ride.interface';
import {User} from '../user/user.model';
import {IGeoPoint} from '../user/user.interface';
import {Ride} from './ride.model';
import AppError from '../../errorHelpers/AppError';

const requestRide = async (
    decodedToken: JwtPayload,
    payload: Partial<IRide>,
) => {
    const rider = await User.findById(decodedToken.userId);
    if (!rider || !rider.currentLocation) {
        throw new AppError(400, 'Rider current location is missing');
    }

    if (!payload.dropoffLocation || !payload.dropoffLocation.coordinates) {
        throw new AppError(400, 'Dropoff location is required');
    }

    const ride: IRide = {
        riderId: rider._id,
        pickupLocation: rider.currentLocation as IGeoPoint,
        dropoffLocation: payload.dropoffLocation,
        fare: payload.fare,
    };

    const requestedRide = await Ride.create(ride);
    return requestedRide;
};

const findRides = async (decodedToken: JwtPayload) => {
    const driver = await User.findById(decodedToken.userId);

    const ride = await Ride.find({
        rideStatus: RideStatus.REQUESTED,
        pickupLocation: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: driver!.currentLocation.coordinates,
                },
                $maxDistance: 30000,
            },
        },
    });
    return ride;
};

const acceptRide = async (rideId: string) => {
    const updatedDoc = {$set: {rideStatus: RideStatus.ACCEPTED}};
    const ride = await Ride.findByIdAndUpdate(rideId, updatedDoc, {
        new: true,
        runValidators: true,
    });
    return ride;
};

const cancelRide = async (rideId: string) => {
    const ride = await Ride.findById(rideId);
    if (
        ride?.rideStatus === RideStatus.ACCEPTED ||
        ride?.rideStatus === RideStatus.COMPLETED ||
        ride?.rideStatus === RideStatus.ONGOING
    ) {
        throw new AppError(401, 'This ride can not be cancelled');
    }
    const updatedDoc = {$set: {rideStatus: RideStatus.CANCELLED}};
    const updatedRide = await Ride.findByIdAndUpdate(rideId, updatedDoc, {
        new: true,
        runValidators: true,
    });
    return updatedRide;
};

export const RideService = {requestRide, findRides, acceptRide, cancelRide};
