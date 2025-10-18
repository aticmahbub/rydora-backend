import {UserController} from './user.controller';
import {createUserZodSchema} from './user.validation';
import {validateRequest} from '../../middlewares/validateRequest';
import {Router} from 'express';

const router = Router();

router.post(
    '/register',
    validateRequest(createUserZodSchema),
    UserController.createUser,
);
router.get('/users', UserController.getAllUsers);
export const UserRoutes = router;
