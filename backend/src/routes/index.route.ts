import { Router } from "express";
import authRoutes from './auth.route';
import categoryRoutes from './category.route';
import documentRoutes from './document.route';
import reviewRoutes from './review.route';
import userRoutes from './user.route';

const router = Router();

router.use('/auth', authRoutes);

router.use('/category', categoryRoutes);

router.use('/documents', documentRoutes);

router.use('/reviews', reviewRoutes);

router.use('/users', userRoutes);

export default router;

