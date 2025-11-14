import {Types} from 'mongoose';
import {IGeoPoint} from '../ride/ride.interface';

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

export interface DriverRegistrationPayload {
    drivingLicenseNo: string;
    vehicle?: {
        registrationNo: string;
        vehicleType: string;
        brand: string;
        model: string;
        color: string;
        manufacturingYear: number;
        capacity: number;
        registrationCard: string;
        insurance: {
            provider: string;
            policyNo: string;
            expiryDate: string;
            document: string;
        };
    };
}
