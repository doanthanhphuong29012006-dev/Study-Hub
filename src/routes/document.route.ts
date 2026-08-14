import { Router } from "express";
import * as documentController from '../controllers/document.controller';
import * as authMiddleware from '../middlewares/auth.middleware';
import * as documentValidation from '../validations/document.validate';
import { uploadMiddleware } from "../middlewares/upload.middleware";

const router = Router();

router.get('/', documentController.getAllDocument);

router.post(
    '/', 
    authMiddleware.requireAuth,
    uploadMiddleware.single("file"),
    documentValidation.createDocumentValidation,
    documentController.createDocument
);

export default router;