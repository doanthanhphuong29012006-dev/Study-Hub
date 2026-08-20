import { Router } from "express";
import * as userController from '../../controllers/admin/user.controller';

const router = Router();

router.get('/', userController.getAllUser);

router.patch('/:id/status', userController.changeUserStatus);

export default router;