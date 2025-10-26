// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// import {JwtPayload} from 'jsonwebtoken';
// import {ITrip} from './trip.interface';
// import {User} from '../user/user.model';
// import {IGeoPoint} from '../user/user.interface';
// import {Trip} from './trip.model';

const requestTrip = async () =>
    // decodedToken: JwtPayload,
    // payload: Partial<ITrip>,
    {
        // const rider = await User.findById(decodedToken.userId);
        // const trip: ITrip = {
        //     riderId: rider!._id,
        //     pickupLocation: rider?.currentLocation as IGeoPoint,
        //     ...payload,
        // };
        // const requestedTrip = await Trip.create(trip);
        // return requestedTrip;
    };

export const TripService = {requestTrip};
