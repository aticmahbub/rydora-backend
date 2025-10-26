import {Types} from 'mongoose';
import {IGeoPoint} from '../user/user.interface';
export enum TripStatus {
    REQUESTED = 'REQUESTED',
    ACCEPTED = 'ACCEPTED',
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export interface ITrip {
    _id?: Types.ObjectId;

    riderId: Types.ObjectId;
    driverId?: Types.ObjectId;
    // vehicleId?: Types.ObjectId; // useful for analytics later

    // Instead of plain strings, use GeoJSON to support nearby driver queries
    pickupLocation: IGeoPoint;

    dropoffLocation?: IGeoPoint;

    fare?: number;
    distance?: number;

    tripStatus?: TripStatus;

    startedAt?: Date;
    completedAt?: Date;

    ratingByRider?: number;
    ratingByDriver?: number;

    createdAt?: Date;
    updatedAt?: Date;
}
