import { Router } from "express";
import * as categoryController from '../../controllers/category.controller';
import * as categoryValidation from '../../validations/category.validate';

const router = Router();

router.post(
    '/',
    categoryValidation.createCategoryValidation,
    categoryController.createCategory
);

router.delete(
    '/:id',
    categoryController.deleteCategory
)

export default router;