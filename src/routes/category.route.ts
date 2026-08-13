import { Router } from "express";
import * as categoryController from '../controllers/category.controller';
import * as authMiddleware from '../middlewares/auth.middleware';

const router = Router();

router.get('/', categoryController.getAllCategories);

export default router;