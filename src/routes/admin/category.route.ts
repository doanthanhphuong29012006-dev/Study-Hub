import { Router } from "express";
import * as categoryController from '../../controllers/admin/category.controller';
import * as categoryValidation from '../../validations/admin/category.validate';

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

router.patch(
    '/:id',
    categoryController.updateCategory
)

export default router;