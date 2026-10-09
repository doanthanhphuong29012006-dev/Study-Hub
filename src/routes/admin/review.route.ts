import { Router } from "express";
import * as reviewController from '../../controllers/review.controller';
import * as adminReviewController from '../../controllers/admin/review.controller';
import { validatePagination } from "../../validations/pagination.validate";

const router = Router();

router.delete('/:id', reviewController.deleteReview);

router.get(
    '/', 
    validatePagination,
    adminReviewController.getAllReviewsGlobal
);

export default router;