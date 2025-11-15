import {envVars} from '../config/env.config';
import {IAuthProvider, IUser, Role} from '../modules/user/user.interface';
import {User} from '../modules/user/user.model';
import bcryptjs from 'bcryptjs';

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({
            email: envVars.SUPER_ADMIN_EMAIL,
        });

        if (isSuperAdminExist) {
            console.log('super admin already exists');
            return;
        }
        console.log('Trying to create super admin...');

        const hashedPassword = await bcryptjs.hash(
            envVars.SUPER_ADMIN_PASSWORD.trim(),
            Number(envVars.BCRYPTJS_SALT_ROUND),
        );

        const authProvider: IAuthProvider = {
            provider: 'credentials',
            providerId: envVars.SUPER_ADMIN_EMAIL,
        };

        const payload: IUser = {
            currentLocation: {type: 'Point', coordinates: [0, 0], address: ''},
            name: 'Super Admin',
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
            auths: [authProvider],
            NID: 1234567890,
            isVerified: true,
        };
        const superAdmin = await User.create(payload);
        console.log('Super admin created \n');
        console.log(superAdmin);
    } catch (error) {
        console.log(error);
    }
};
