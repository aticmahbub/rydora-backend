import {Types} from 'mongoose';

export enum Role {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    RIDER = 'RIDER',
    DRIVER = 'DRIVER',
}

export enum IsActive {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BLOCKED = 'BLOCKED',
}

export interface IAuthProvider {
    provider: 'google' | 'credentials';
    providerId: string;
}

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    role: Role;
    phone?: number;

    picture?: string;
    address?: string;
    age?: number;
    NID: number;

    currentLocation?: string;

    isDeleted?: boolean;
    isActive?: IsActive;
    isVerified?: boolean;
    isNIDVerified?: boolean;

    auths: IAuthProvider[];
}
