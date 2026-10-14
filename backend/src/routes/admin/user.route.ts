import { Router } from "express";
import * as userController from '../../controllers/admin/user.controller';
import * as userValidation from '../../validations/admin/user.validate';
import { validatePagination } from "../../validations/pagination.validate";

const router = Router();

router.get(
    '/',
    validatePagination,
    userController.getAllUser
);

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