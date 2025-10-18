import {Router} from 'express';
import {AuthController} from './auth.controller';

const router = Router();

router.post('/login', AuthController.credentialsLogin);
// router.post('/update-user', AuthController.updateUser);
export const AuthRoutes = router;
