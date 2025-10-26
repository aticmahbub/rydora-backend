/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {JwtPayload} from 'jsonwebtoken';
import {ITrip} from './trip.interface';
import {User} from '../user/user.model';
import {IGeoPoint} from '../user/user.interface';
import {Trip} from './trip.model';
import AppError from '../../errorHelpers/AppError';
// import {Driver} from '../driver/driver.model';

const requestTrip = async (
    decodedToken: JwtPayload,
    payload: Partial<ITrip>,
) => {
    const rider = await User.findById(decodedToken.userId);
    if (!rider || !rider.currentLocation) {
        throw new AppError(400, 'Rider current location is missing');
    }

    if (!payload.dropoffLocation || !payload.dropoffLocation.coordinates) {
        throw new AppError(400, 'Dropoff location is required');
    }

    const trip: ITrip = {
        riderId: rider._id,
        pickupLocation: rider.currentLocation as IGeoPoint,
        dropoffLocation: payload.dropoffLocation,
        fare: payload.fare,
    };

    const requestedTrip = await Trip.create(trip);
    return requestedTrip;
};

export const TripService = {requestTrip};
