import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.middleware';
import * as savedDocumentController from '../controllers/saved-document.controller';

const router = Router();

router.get(
    '/saved-document', 
    authMiddleware.requireAuth,
    savedDocumentController.getDocumentUserSaved
);

export default router;