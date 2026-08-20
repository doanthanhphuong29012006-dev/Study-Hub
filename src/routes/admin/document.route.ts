import { Router } from "express";
import * as adminDocumentController from '../../controllers/admin/document.controller';
import * as documentValidation from '../../validations/admin/document.validate';
import * as documentController from '../../controllers/document.controller';

const router = Router();

router.get(
    '/',
    adminDocumentController.getAllDocument
)

router.patch(
    '/:id/status',
    documentValidation.validateChangeStatus,
    adminDocumentController.changeDocumentStatus
);

router.delete(
    '/:id',
    documentController.deleteDocument
);

export default router;