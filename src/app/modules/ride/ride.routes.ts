// ride.routes.ts
import {Router} from 'express';
import {RideController} from './ride.controller';
import {checkAuth} from '../../middlewares/checkAuth';
import {Role} from '../user/user.interface';

const router = Router();

router.post('/request', checkAuth(Role.RIDER), RideController.requestRide);
router.get('/history', checkAuth(Role.RIDER), RideController.getRideHistory);
router.get('/stats', checkAuth(Role.RIDER), RideController.getRideStats);
// router.get('/recent', checkAuth(Role.RIDER), RideController.getRecentRides);
// router.get(
//     '/monthly-stats',
//     checkAuth(Role.RIDER),
//     RideController.getMonthlyStats,
// );
router.post(
    '/cancel/:rideId',
    checkAuth(Role.RIDER),
    RideController.cancelRide,
);

// Driver routes
router.get('/find', checkAuth(Role.DRIVER), RideController.findRides);
router.post(
    '/accept/:rideId',
    checkAuth(Role.DRIVER),
    RideController.acceptRide,
);

// Shared routes (both rider and driver)
router.get(
    '/:rideId',
    checkAuth(Role.RIDER, Role.DRIVER),
    RideController.getRideDetails,
);

export const RideRoutes = router;
