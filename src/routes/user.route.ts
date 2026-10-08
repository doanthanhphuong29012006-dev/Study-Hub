import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.middleware';
import * as userController from '../controllers/user.controller';
import * as savedDocumentController from '../controllers/saved-document.controller';
import { uploadAvatarMiddleware } from "../middlewares/upload.middleware";

const router = Router();

router.get(
    '/saved-document', 
    authMiddleware.requireAuth,
    savedDocumentController.getDocumentUserSaved
);

router.get(
    '/profile', 
    authMiddleware.requireAuth,
    userController.getInfoUser
);

router.patch(
    '/profile', 
    authMiddleware.requireAuth,
    uploadAvatarMiddleware,
    userController.updateInfoUser
);

router.get(
    '/my-documents', 
    authMiddleware.requireAuth,
    userController.getMyDocument
);

export default router;