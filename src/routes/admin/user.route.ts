import { Router } from "express";
import * as userController from '../../controllers/admin/user.controller';

const router = Router();

router.get(
    '/', 
    userController.getAllUser
);

export default router;