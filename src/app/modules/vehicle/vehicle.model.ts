import {model, Schema} from 'mongoose';
import {IVehicle, VehicleType} from './vehicle.types';

const vehicleSchema = new Schema<IVehicle>(
    {
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        registrationNo: {
            type: String,
            required: true,
        },
        vehicleType: {
            type: String,
            enum: Object.values(VehicleType),
            required: true,
        },
        brand: {
            type: String,
            required: true,
            trim: true,
        },
        model: {
            type: String,
            required: true,
            trim: true,
        },
        color: {
            type: String,
            required: true,
            trim: true,
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
            max: 20,
        },
        // registrationCard: {
        //     type: String,
        //     required: true, // URL to uploaded document
        // },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

vehicleSchema.index({ownerId: 1});
vehicleSchema.index({status: 1});

export const Vehicle = model<IVehicle>('Vehicle', vehicleSchema);
