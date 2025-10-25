import {Router} from 'express';
import {AuthController} from './auth.controller';
import {checkAuth} from '../../middlewares/checkAuth';
import {Role} from '../user/user.interface';

const router = Router();

router.post('/login', AuthController.credentialsLogin);
router.post('/logout', AuthController.logout);
router.post(
    '/reset-password',
    checkAuth(...Object.values(Role)),
    AuthController.resetPassword,
);
router.post('/refresh-token', AuthController.getNewAccessToken);

export const AuthRoutes = router;
