import {Types} from 'mongoose';
import {IGeoPoint} from '../user/user.interface';

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
export interface IDriver {
    userId: Types.ObjectId;
    vehicle: Types.ObjectId;

    currentLocation: IGeoPoint;

    driverApproval: DriverApproval;
    driverStatus: DriverStatus;
    drivingLicenseNo: string;

    rating?: number;
    earnings?: number;
}
