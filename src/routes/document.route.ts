import { Router } from "express";
import * as documentController from '../controllers/document.controller';
import * as authMiddleware from '../middlewares/auth.middleware';
import * as documentValidation from '../validations/document.validate';

const router = Router();

router.get('/', documentController.getAllDocument);

export default router;