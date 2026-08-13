import { Router } from "express";
import * as categoryController from '../controllers/category.controller';
import * as authMiddleware from '../middlewares/auth.middleware';
import * as categoryValidation from '../validations/category.validate';

const router = Router();

router.get('/', categoryController.getAllCategories);

router.get('/:slug', categoryController.detailCategory);

router.post(
    '/', 
    authMiddleware.requireAuth, 
    categoryValidation.createCategoryValidation,
    categoryController.createCategory);

export default router;