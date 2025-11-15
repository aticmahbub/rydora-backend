import {JwtPayload} from 'jsonwebtoken';
import {
    DriverApproval,
    DriverRegistrationPayload,
    DriverStatus,
    IDriver,
} from './driver.interface';
import mongoose from 'mongoose';
import {User} from '../user/user.model';
import AppError from '../../errorHelpers/AppError';
import {Driver} from './driver.model';
import {Vehicle} from '../vehicle/vehicle.model';
import {IVehicle, VehicleType} from '../vehicle/vehicle.types';
import {Role} from '../user/user.interface';

const registerDriver = async (
    decodedToken: JwtPayload,
    payload: DriverRegistrationPayload,
) => {
    // Validate required fields
    if (!payload.drivingLicenseNo) {
        throw new AppError(400, 'Driving license number is required');
    }

    if (!payload.vehicle) {
        throw new AppError(400, 'Vehicle information is required');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(decodedToken.userId).session(session);
        if (!user) {
            throw new AppError(404, 'User not found');
        }

        // Check if driver already exists
        const existingDriver = await Driver.findOne({userId: user._id}).session(
            session,
        );
        if (existingDriver) {
            throw new AppError(
                400,
                'Driver profile already exists for this user',
            );
        }

        // Validate vehicle data
        const {vehicle} = payload;
        if (
            !vehicle.registrationNo ||
            !vehicle.vehicleType ||
            !vehicle.brand ||
            !vehicle.model
        ) {
            throw new AppError(400, 'Missing required vehicle information');
        }

        // Check if vehicle registration number already exists
        const existingVehicle = await Vehicle.findOne({
            registrationNo: vehicle.registrationNo,
        }).session(session);

        if (existingVehicle) {
            throw new AppError(
                400,
                'Vehicle registration number already exists',
            );
        }

        // Create vehicle
        const vehicleInfo: IVehicle = {
            ownerId: user._id,
            registrationNo: vehicle.registrationNo,
            vehicleType: vehicle.vehicleType as VehicleType,
            brand: vehicle.brand,
            model: vehicle.model,
            color: vehicle.color,
            capacity: vehicle.capacity,
            // registrationCard: vehicle.registrationCard || '',
        };

        const newVehicle = new Vehicle(vehicleInfo);
        await newVehicle.save({session});

        // Create driver
        const driverInfo: IDriver = {
            userId: user._id,
            vehicle: newVehicle._id as mongoose.Types.ObjectId,
            drivingLicenseNo: payload.drivingLicenseNo,
            currentLocation: user.currentLocation || {
                type: 'Point',
                coordinates: [0, 0],
                address: 'Unknown location',
            },
            driverApproval: DriverApproval.PENDING,
            driverStatus: DriverStatus.UNAVAILABLE,
        };

        const driver = new Driver(driverInfo);
        await driver.save({session});

        // Update user role
        user.role = Role.DRIVER;
        await user.save({session});

        await session.commitTransaction();
        session.endSession();

        return {
            driver: {
                _id: driver._id,
                drivingLicenseNo: driver.drivingLicenseNo,
                status: driver.driverStatus,
                approval: driver.driverApproval,
            },
            vehicle: {
                _id: newVehicle._id,
                registrationNo: newVehicle.registrationNo,
                type: newVehicle.vehicleType,
                brand: newVehicle.brand,
                model: newVehicle.model,
            },
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const driverService = {
    registerDriver,
};

export const DriverService = {registerDriver};
