import { Router } from "express";
import * as authorizeMiddleware from '../../middlewares/authorize.middleware';
import * as authMiddleware from '../../middlewares/auth.middleware';
import categoryRoutes from './category.route';

const router = Router();

router.use(authMiddleware.requireAuth);

router.use(authorizeMiddleware.requirePermission);

router.use('/category', categoryRoutes);

export default router;

