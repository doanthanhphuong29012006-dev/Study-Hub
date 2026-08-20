import { Router } from "express";
import * as reviewController from '../../controllers/review.controller';
import * as adminReviewController from '../../controllers/admin/review.controller';

const router = Router();

router.delete('/:id', reviewController.deleteReview);

router.get('/', adminReviewController.getAllReviewsGlobal);

export default router;