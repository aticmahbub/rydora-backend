import {Types} from 'mongoose';
import {IGeoPoint} from '../user/user.interface';
export enum RideStatus {
    REQUESTED = 'REQUESTED',
    ACCEPTED = 'ACCEPTED',
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export interface IRide {
    _id?: Types.ObjectId;

    riderId: Types.ObjectId;
    driverId?: Types.ObjectId;
    // vehicleId?: Types.ObjectId;

    // Instead of plain strings, use GeoJSON to support nearby driver queries
    pickupLocation: IGeoPoint;

    dropoffLocation: IGeoPoint;

    fare?: number;
    distance?: number;

    rideStatus?: RideStatus;

    startedAt?: Date;
    completedAt?: Date;

    ratingByRider?: number;
    ratingByDriver?: number;

    createdAt?: Date;
    updatedAt?: Date;
}
