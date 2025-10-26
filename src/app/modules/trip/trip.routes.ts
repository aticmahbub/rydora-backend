import {Router} from 'express';
import {TripController} from './trip.controller';
import {checkAuth} from '../../middlewares/checkAuth';
import {Role} from '../user/user.interface';

const router = Router();

router.post(
    '/request',
    checkAuth(...Object.values(Role)),
    TripController.requestTrip,
);
export const TripRoutes = router;
