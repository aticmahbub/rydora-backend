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
    '/info',
    checkAuth(...Object.values(Role)),
    UserController.getUserInfo,
);

router.get(
    '/:id',
    checkAuth(...Object.values(Role)),
    UserController.getUserById,
);

router.patch(
    '/:id',
    checkAuth(...Object.values(Role)),
    // validateRequest(updateUserZodSchema),
    UserController.updateUser,
);

router.get(
    '/',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    // validateRequest(getUsersZodSchema),
    UserController.getUsers,
);

router.delete(
    '/:id',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    UserController.deleteUser,
);

router.patch(
    '/bulk-update',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    UserController.bulkUpdateUsers,
);

export const UserRoutes = router;
