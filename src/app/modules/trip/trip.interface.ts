import {Types} from 'mongoose';
export enum TripStatus {
    REQUESTED = 'REQUESTED',
    ACCEPTED = 'ACCEPTED',
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export interface ITrip {
    _id?: Types.ObjectId;

    riderId: Types.ObjectId; // ref → User
    driverId?: Types.ObjectId; // optional until a driver accepts
    vehicleId?: Types.ObjectId; // useful for analytics later

    // Instead of plain strings, use GeoJSON to support nearby driver queries
    pickupLocation: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
        address?: string;
    };

    dropoffLocation: {
        type: 'Point';
        coordinates: [number, number];
        address?: string;
    };

    fare: number;
    distance: number;

    tripStatus: TripStatus;

    startedAt?: Date;
    completedAt?: Date;

    ratingByRider?: number;
    ratingByDriver?: number;

    createdAt?: Date;
    updatedAt?: Date;
}
