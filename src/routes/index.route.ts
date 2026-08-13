import { Router } from "express";
import authRoutes from './auth.route';
import categoryRoutes from './category.route';
import documentRoutes from './document.route';

const router = Router();

router.use('/auth', authRoutes);

router.use('/category', categoryRoutes);

router.use('/documents', documentRoutes);

export default router;

