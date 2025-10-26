import {Router} from 'express';
import {TripController} from './trip.controller';
import {checkAuth} from '../../middlewares/checkAuth';
import {Role} from '../user/user.interface';

const router = Router();

router.post('/request', checkAuth(Role.RIDER), TripController.requestTrip);
router.get('/find', checkAuth(Role.DRIVER), TripController.findTrips);
router.post(
    '/accept/:tripId',
    checkAuth(Role.DRIVER),
    TripController.acceptTrip,
);
export const TripRoutes = router;
