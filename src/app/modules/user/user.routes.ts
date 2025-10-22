import {UserController} from './user.controller';
import {createUserZodSchema} from './user.validation';
import {validateRequest} from '../../middlewares/validateRequest';
import {Router} from 'express';
import {checkAuth} from '../../middlewares/checkAuth';

const router = Router();

router.post(
    '/register',
    validateRequest(createUserZodSchema),
    UserController.createUser,
);
router.get('/users', checkAuth('ADMIN'), UserController.getAllUsers);
export const UserRoutes = router;
