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

    capacity: number;
    // registrationCard: string;
    createdAt?: Date;
    updatedAt?: Date;
}
