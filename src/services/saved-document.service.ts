import * as savedDocumentRepository from '../repositories/saved-document.repository';

export const saveDocument = async (documentId: string, userId: string) => {
    await savedDocumentRepository.saveDocument(documentId, userId);
}