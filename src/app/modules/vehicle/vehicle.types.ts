import {Types} from 'mongoose';

export enum VehicleType {
    CAR = 'CAR',
    BIKE = 'BIKE',
    CNG = 'CNG',
    MICROBUS = 'MICROBUS',
}

export interface IVehicle {
    _id?: Types.ObjectId;
    ownerId: Types.ObjectId;
    registrationNo: string;
    vehicleType: VehicleType;
    brand: string;
    model: string;
    color: string;
    manufacturingYear: number;
    capacity: number;
    registrationCard: string;
    insurance: {
        provider: string;
        policyNo: string;
        expiryDate: Date;
        document: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}
