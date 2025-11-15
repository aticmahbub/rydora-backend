import {Types} from 'mongoose';

export enum RideStatus {
    ALL = 'ALL',
    REQUESTED = 'REQUESTED',
    ACCEPTED = 'ACCEPTED',
    DRIVER_ARRIVED = 'DRIVER_ARRIVED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
    CASH = 'CASH',
    CARD = 'CARD',
    MOBILE_WALLET = 'MOBILE_WALLET',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export interface IGeoPoint {
    type: 'Point';
    coordinates: [number, number];
    address: string;
}

export interface IRideTimeline {
    status: RideStatus;
    timestamp: Date;
    location?: IGeoPoint;
}

export interface IRide {
    _id?: Types.ObjectId;
    riderId: Types.ObjectId;
    driverId?: Types.ObjectId;
    pickupLocation: IGeoPoint;
    dropoffLocation: IGeoPoint;
    fare: number;
    distance?: number;
    estimatedDuration?: number;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    rideStatus: RideStatus;
    timeline: IRideTimeline[];
    startedAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    cancellationReason?: string;
    ratingByRider?: number;
    ratingByDriver?: number;
    riderNote?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Request DTOs
export interface IRequestRidePayload {
    pickupLocation: IGeoPoint;
    dropoffLocation: IGeoPoint;
    paymentMethod: PaymentMethod;
    riderNote?: string;
    fare: number;
}

export interface IRideHistoryFilters {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    minFare?: number;
    maxFare?: number;
    status?: RideStatus;
    search?: string;
}

// Response DTOs
export interface IRideHistoryResponse {
    rides: IRide[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface IRideStats {
    totalRides: number;
    completedRides: number;
    cancelledRides: number;
    totalSpent: number;
    averageFare: number;
    monthlyStats: {
        month: string;
        rideCount: number;
        totalFare: number;
    }[];
}
