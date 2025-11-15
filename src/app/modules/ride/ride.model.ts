// ride.model.ts
import {model, Schema} from 'mongoose';
import {
    IRide,
    RideStatus,
    PaymentMethod,
    PaymentStatus,
} from './ride.interface';

const rideSchema = new Schema<IRide>(
    {
        riderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        driverId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        pickupLocation: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
            address: {
                type: String,
                required: true,
            },
        },
        dropoffLocation: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
            address: {
                type: String,
                required: true,
            },
        },
        fare: {
            type: Number,
            required: true,
            min: 0,
        },
        distance: {
            type: Number,
            min: 0,
        },
        paymentMethod: {
            type: String,
            enum: Object.values(PaymentMethod),
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.PENDING,
        },
        rideStatus: {
            type: String,
            enum: Object.values(RideStatus),
            default: RideStatus.REQUESTED,
        },

        startedAt: Date,
        completedAt: Date,
        cancelledAt: Date,
        cancellationReason: String,

        ratingByRider: {
            type: Number,
            min: 1,
            max: 5,
        },
        ratingByDriver: {
            type: Number,
            min: 1,
            max: 5,
        },
        riderNote: String,
    },
    {
        timestamps: true,
    },
);

// Geospatial indexes
rideSchema.index({pickupLocation: '2dsphere'});
rideSchema.index({dropoffLocation: '2dsphere'});
rideSchema.index({riderId: 1, createdAt: -1});
rideSchema.index({driverId: 1, createdAt: -1});
rideSchema.index({rideStatus: 1});

// Auto-update timeline and timestamps
rideSchema.pre('save', function (next) {
    if (this.isModified('rideStatus')) {
        this.timeline.push({
            status: this.rideStatus,
            timestamp: new Date(),
            location:
                this.rideStatus === RideStatus.REQUESTED
                    ? this.pickupLocation
                    : undefined,
        });

        // Update timestamps
        if (this.rideStatus === RideStatus.IN_PROGRESS && !this.startedAt) {
            this.startedAt = new Date();
        } else if (
            this.rideStatus === RideStatus.COMPLETED &&
            !this.completedAt
        ) {
            this.completedAt = new Date();
            this.paymentStatus = PaymentStatus.PAID;
        } else if (
            this.rideStatus === RideStatus.CANCELLED &&
            !this.cancelledAt
        ) {
            this.cancelledAt = new Date();
        }
    }
    next();
});

export const Ride = model<IRide>('Ride', rideSchema);
