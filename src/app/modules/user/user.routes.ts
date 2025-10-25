import {UserController} from './user.controller';
import {createUserZodSchema} from './user.validation';
import {validateRequest} from '../../middlewares/validateRequest';
import {Router} from 'express';
import {checkAuth} from '../../middlewares/checkAuth';
import {Role} from './user.interface';

const router = Router();

router.post(
    '/register',
    validateRequest(createUserZodSchema),
    UserController.createUser,
);

router.get(
    '/users',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    UserController.getAllUsers,
);
// router.get('/:id', UserController.getSingleUser);

router.patch(
    '/:id',
    checkAuth(...Object.values(Role)),
    UserController.updateUser,
);
export const UserRoutes = router;
