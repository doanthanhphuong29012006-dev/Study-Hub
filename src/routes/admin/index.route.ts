import { Router } from "express";
import * as authorizeMiddleware from '../../middlewares/authorize.middleware';
import * as authMiddleware from '../../middlewares/auth.middleware';
import categoryRoutes from './category.route';
import userRoutes from './user.route';

const router = Router();

router.use(authMiddleware.requireAuth);

router.use(authorizeMiddleware.requirePermission);

router.use('/category', categoryRoutes);

router.use('/user', userRoutes);

export default router;

