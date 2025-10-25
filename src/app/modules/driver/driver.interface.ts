import {Document, Types} from 'mongoose';

export enum DriverApproval {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    SUSPENDED = 'SUSPENDED',
}

export enum DriverStatus {
    AVAILABLE = 'AVAILABLE',
    UNAVAILABLE = 'UNAVAILABLE',
    ON_RIDE = 'ON_RIDE',
}
export interface IDriver extends Document {
    userId: Types.ObjectId;
    vehicle: Types.ObjectId;

    driverApproval: DriverApproval;
    driverStatus: DriverStatus;
    drivingLicenseNo: string;

    currentLocation?: {
        type: 'Point';
        coordinates: [number, number];
        updatedAt?: Date;
    };

    rating?: number;
    earnings?: number;
}
