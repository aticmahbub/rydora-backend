import {model, Schema} from 'mongoose';
import {ITrip, TripStatus} from './trip.interface';

const tripSchema = new Schema<ITrip>(
    {
        riderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            //   required: true,
        },
        driverId: {
            type: Schema.Types.ObjectId,
            ref: 'Driver',
            default: null,
        },
        vehicleId: {
            type: Schema.Types.ObjectId,
            ref: 'Vehicle',
            default: null,
        },
        pickupLocation: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
            },
            address: {type: String},
        },
        dropoffLocation: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number],
                required: true,
            },
            address: {type: String},
        },
        fare: {
            type: Number,
            required: true,
            min: 0,
        },
        distance: {
            type: Number,
            required: true,
            min: 0,
        },
        tripStatus: {
            type: String,
            enum: Object.values(TripStatus),
            default: TripStatus.REQUESTED,
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
tripSchema.index({pickupLocation: '2dsphere'});
tripSchema.index({dropoffLocation: '2dsphere'});

// Optional: hook to auto-update status timestamps
tripSchema.pre('save', function (next) {
    if (this.isModified('tripStatus')) {
        if (this.tripStatus === TripStatus.ONGOING) {
            this.startedAt = new Date();
        }
        if (this.tripStatus === TripStatus.COMPLETED) {
            this.completedAt = new Date();
        }
    }
    next();
});

export const Trip = model<ITrip>('Trip', tripSchema);
