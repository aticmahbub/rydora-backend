import {model, Schema} from 'mongoose';
import {IAuthProvider, IsActive, IUser, Role} from './user.interface';

const authProviderSchema = new Schema<IAuthProvider>(
    {
        provider: {type: String, required: true},
        providerId: {type: String, required: true},
    },
    {
        versionKey: false,
        _id: false,
    },
);

const userSchema = new Schema<IUser>(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String},
        role: {
            type: String,
            enum: Object.values(Role),
            default: Role.RIDER,
        },
        age: {type: Number},
        NID: {type: String, required: true, unique: true},

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

        phone: {type: String},
        picture: {type: String},
        isDeleted: {type: Boolean, default: false},
        isActive: {
            type: String,
            enum: Object.values(IsActive),
            default: IsActive.ACTIVE,
        },
        isVerified: {type: Boolean, default: false},
        auths: [authProviderSchema],
    },
    {timestamps: true, versionKey: false},
);
// GeoJSON index for location-based queries
userSchema.index({currentLocation: '2dsphere'});
export const User = model<IUser>('User', userSchema);
