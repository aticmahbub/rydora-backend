import {Router} from 'express';
import {DriverController} from './driver.controller';
import {checkAuth} from '../../middlewares/checkAuth';
import {Role} from '../user/user.interface';

const router = Router();

router.post(
    '/register',
    checkAuth(...Object.values(Role)),
    DriverController.registerDriver,
);

export const DriverRoutes = router;
