import { Router } from "express";
import * as authController from '../controllers/auth.controller';
import * as authValidate from '../validations/auth.validate';

const router = Router();

router.post(
    '/register',
    authValidate.registerValidation,
    authController.register
);

router.post(
    '/login',
    authValidate.loginValidation,
    authController.login
);

export default router;