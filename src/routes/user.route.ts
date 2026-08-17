import { Router } from "express";
import * as authMiddleware from '../middlewares/auth.middleware';
import * as userController from '../controllers/user.controller';
import * as savedDocumentController from '../controllers/saved-document.controller';

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



export default router;