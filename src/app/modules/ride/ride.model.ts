import {model, Schema} from 'mongoose';
import {IRide, RideStatus} from './ride.interface';

const rideSchema = new Schema<IRide>(
    {
        riderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        driverId: {
            type: Schema.Types.ObjectId,
            ref: 'Driver',
            default: null,
        },
        // vehicleId: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'Vehicle',
        //     default: null,
        // },
        pickupLocation: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
            address: {type: String},
        },
        dropoffLocation: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
            address: {type: String},
        },
        fare: {
            type: Number,
            // required: true,
            min: 0,
        },
        distance: {
            type: Number,
            // required: true,
            min: 0,
        },
        rideStatus: {
            type: String,
            enum: Object.values(RideStatus),
            required: true,
            default: RideStatus.REQUESTED,
        },
        startedAt: {type: Date},
        completedAt: {type: Date},
        ratingByRider: {
            type: Number,
            min: 0,
            max: 5,
        },
        ratingByDriver: {
            type: Number,
            min: 0,
            max: 5,
        },
    },
    {
        timestamps: true,
    },
);

// ✅ Geospatial index for proximity queries
rideSchema.index({pickupLocation: '2dsphere'});
rideSchema.index({dropoffLocation: '2dsphere'});

// Optional: hook to auto-update status timestamps
rideSchema.pre('save', function (next) {
    if (this.isModified('rideStatus')) {
        if (this.rideStatus === RideStatus.ONGOING) {
            this.startedAt = new Date();
        }
        if (this.rideStatus === RideStatus.COMPLETED) {
            this.completedAt = new Date();
        }
    }
    next();
});

export const Ride = model<IRide>('Ride', rideSchema);
