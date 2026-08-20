import { Router } from "express";
import * as categoryController from '../controllers/category.controller';
import * as authMiddleware from '../middlewares/auth.middleware';
import * as categoryValidation from '../validations/admin/category.validate';

const router = Router();

router.get('/', categoryController.getAllCategories);

router.get('/:slug', categoryController.detailCategory);

export default router;