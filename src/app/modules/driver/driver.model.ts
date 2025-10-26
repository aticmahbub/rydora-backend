import {model, Schema} from 'mongoose';
import {DriverApproval, DriverStatus, IDriver} from './driver.interface';

const driverSchema = new Schema<IDriver>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            // required: true,
        },
        // vehicle: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'Vehicle',
        //     // required: true,
        // },
        currentLocation: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
                required: true,
            },
            coordinates: {
                type: [Number],
                default: [0, 0],
            },
            address: {type: String},
            updatedAt: {type: Date, default: Date.now},
        },
        driverApproval: {
            type: String,
            enum: Object.values(DriverApproval),
            default: DriverApproval.PENDING,
            required: true,
        },
        driverStatus: {
            type: String,
            enum: Object.values(DriverStatus),
            default: DriverStatus.AVAILABLE,
            required: true,
        },
        drivingLicenseNo: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        earnings: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const Driver = model<IDriver>('Driver', driverSchema);
