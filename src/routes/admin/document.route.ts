import { Router } from "express";
import * as documentController from '../../controllers/admin/document.controller';
import * as documentValidation from '../../validations/admin/document.validate';

const router = Router();

router.patch(
    '/:id/status',
    documentValidation.validateChangeStatus,
    documentController.changeDocumentStatus
);

export default router;