import { Router } from "express";
import authRoutes from './auth.route';
import categoryRoutes from './category.route';

const router = Router();

router.use('/auth', authRoutes);

router.use('/category', categoryRoutes);

export default router;

