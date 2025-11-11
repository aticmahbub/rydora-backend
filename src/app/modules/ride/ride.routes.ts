import {Router} from 'express';
import {RideController} from './ride.controller';
import {checkAuth} from '../../middlewares/checkAuth';
import {Role} from '../user/user.interface';

const router = Router();

router.post('/request', checkAuth(Role.RIDER), RideController.requestRide);
router.get('/find', checkAuth(Role.DRIVER), RideController.findRides);
router.post(
    '/accept/:rideId',
    checkAuth(Role.DRIVER),
    RideController.acceptRide,
);
router.post(
    '/cancel/:rideId',
    checkAuth(Role.RIDER),
    RideController.cancelRide,
);
export const RideRoutes = router;
