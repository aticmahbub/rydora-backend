import {JwtPayload} from 'jsonwebtoken';
import {User} from '../user/user.model';
import {IDriver} from './driver.interface';
import {Role} from '../user/user.interface';
import AppError from '../../errorHelpers/AppError';
import {Driver} from './driver.model';

const registerDriver = async (decodedToken: JwtPayload, payload: IDriver) => {
    const user = await User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError(404, 'User does not exist');
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user!.role = Role.DRIVER;
    await user.save();

    const driver = new Driver({
        userId: user._id,
        drivingLicenseNo: payload.drivingLicenseNo,
        currentLocation: payload.currentLocation,
    });

    await driver.save();
};
export const DriverService = {registerDriver};
