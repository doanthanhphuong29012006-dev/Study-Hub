import * as documentRepository from '../../repositories/admin/document.repository';

export const changeDocumentStatus = async (documentId: string, status: string) => {
    await documentRepository.changeDocumentStatusById(documentId, status);
}