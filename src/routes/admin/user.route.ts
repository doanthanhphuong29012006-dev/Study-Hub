import { Router } from "express";
import * as userController from '../../controllers/admin/user.controller';
import * as userValidation from '../../validations/admin/user.validate';

const router = Router();

router.get('/', userController.getAllUser);

router.patch(
    '/:id/status',
    userValidation.validateChangeStatus,
    userController.changeUserStatus
);

router.patch(
    '/:id/role', 
    userValidation.validateChangeRole,
    userController.changeUserRole
);

export default router;