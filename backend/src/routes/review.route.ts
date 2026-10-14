import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.middleware';
import * as reviewController from '../controllers/review.controller';
import * as reviewValidation from '../validations/review.validate'

const router = Router();

router.patch(
    '/:id',
    authMiddleware.requireAuth,
    reviewValidation.createReviewValidation,
    reviewController.updateReview
);

router.delete(
    '/:id',
    authMiddleware.requireAuth,
    reviewController.deleteReview
);

export default router;