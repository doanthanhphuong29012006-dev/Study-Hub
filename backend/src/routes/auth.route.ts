import { Router } from "express";
import * as authController from '../controllers/auth.controller';
import * as authValidate from '../validations/auth.validate';
import { authLimiter, registerLimiter } from "../middlewares/rate-limit.middleware";

const router = Router();

router.post(
    '/register',
    registerLimiter,
    authValidate.registerValidation,
    authController.register
);

router.post(
    '/login',
    authLimiter,
    authValidate.loginValidation,
    authController.login
);

router.post('/logout', authController.logout);

export default router;