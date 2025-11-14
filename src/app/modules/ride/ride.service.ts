/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {JwtPayload} from 'jsonwebtoken';
import {IRide, RideStatus} from './ride.interface';
import {User} from '../user/user.model';
import {Ride} from './ride.model';
import AppError from '../../errorHelpers/AppError';

const requestRide = async (
    decodedToken: JwtPayload,
    payload: Partial<IRide>,
) => {
    const rider = await User.findById(decodedToken.userId);
    if (!rider) {
        throw new AppError(400, 'Rider is missing');
    }

    if (
        !payload.dropoffLocation ||
        !payload.dropoffLocation.coordinates ||
        !payload.pickupLocation ||
        !payload.pickupLocation.coordinates
    ) {
        throw new AppError(400, 'Dropoff or Pickup location is required');
    }

    const ride: IRide = {
        riderId: rider._id,
        pickupLocation: payload.pickupLocation,
        dropoffLocation: payload.dropoffLocation,
        fare: payload.fare,
    };

    const requestedRide = await Ride.create(ride);
    return requestedRide;
};

const findRides = async (decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId);

    if (!user || !user.currentLocation?.coordinates) {
        throw new Error('User not found or location not set');
    }

    const rides = await Ride.find({
        rideStatus: 'REQUESTED',
        pickupLocation: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: user.currentLocation.coordinates,
                },
                $maxDistance: 2000000,
            },
        },
    })
        .sort({createdAt: -1})
        .populate('riderId', 'name phone rating') // Populate rider details
        .limit(50); // Limit results

    return rides;
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
