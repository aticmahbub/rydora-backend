import {JwtPayload} from 'jsonwebtoken';
import {IDriver} from './driver.interface';
import mongoose from 'mongoose';
import {User} from '../user/user.model';
import AppError from '../../errorHelpers/AppError';
import {Driver} from './driver.model';
import {Role} from '../user/user.interface';

const registerDriver = async (decodedToken: JwtPayload, payload: IDriver) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(decodedToken.userId).session(session);
        if (!user) {
            throw new AppError(404, 'User does not exist');
        }

        const existingDriver = await Driver.findOne({userId: user._id}).session(
            session,
        );
        if (existingDriver) {
            throw new AppError(
                400,
                'Driver profile already exists for this user',
            );
        }

        const driverInfo = {
            userId: user._id,
            drivingLicenseNo: payload.drivingLicenseNo,
            currentLocation: user.currentLocation,
        };

        const driver = new Driver(driverInfo);

        await driver.save({session});

        user.role = Role.DRIVER;
        await user.save({session});

        await session.commitTransaction();
        session.endSession();

        // return driver;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const DriverService = {registerDriver};
