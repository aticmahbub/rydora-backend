import {Router} from 'express';
import {UserRoutes} from '../modules/user/user.routes';
import {AuthRoutes} from '../modules/auth/auth.routes';
import {DriverRoutes} from '../modules/driver/driver.routes';
import {TripRoutes} from '../modules/trip/trip.routes';

export const router = Router();

const moduleRoutes = [
    {path: '/user', route: UserRoutes},
    {path: '/auth', route: AuthRoutes},
    {path: '/driver', route: DriverRoutes},
    {path: '/trip', route: TripRoutes},
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
