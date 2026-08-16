import * as savedDocumentRepository from '../repositories/saved-document.repository';

export const saveDocument = async (documentId: string, userId: string) => {
    await savedDocumentRepository.saveDocument(documentId, userId);
}

export const unsaveDocument = async (documentId: string, userId: string) => {
    await savedDocumentRepository.unsaveDocument(documentId, userId);
}

export const getDocumentUserSaved = async (userId: string, page: number, limit: number) => {
    const { savedDocuments, pagination } = await savedDocumentRepository.getDocumentUserSaved(userId, page, limit);

    return { savedDocuments, pagination };
}