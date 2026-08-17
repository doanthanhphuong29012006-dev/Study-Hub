import * as helper from "../helpers/pagination.helper";
import * as documentRepository from "../repositories/document.repository";

export const getAllDocument = async (
    page: number, 
    limit: number, 
    categoryId?: any, 
    keyword?: string, 
    sortedBy?: any, 
    order?: any
) => {
    const skip = limit * (page - 1);

    const { documents, totalCount } = await documentRepository.findAllDocument(limit, skip, categoryId, keyword, sortedBy, order)

    const pagination = helper.pagination(page, limit, totalCount);

    return { documents, pagination };
}

export const createDocument = async (
    fileUrl: string, 
    fileSize: number,
    fileType: string, 
    title: string,
    description: string,
    categoryId: string,
    userId: string
) => {
    await documentRepository.createNewDocument(fileUrl, fileSize, fileType, title, description, categoryId, userId);
}

export const getDetailDocument = async (documentId: string) => {
    const document = await documentRepository.findDocumentById(documentId);
    return document;
}

export const downloadDocument = async (documentId: string) => {
    const fileUrl = await documentRepository.increaseDocumentDownloadCount(documentId);
    return fileUrl;
}

export const updateDocument = async (
    documentId: string, 
    title: string, 
    description: string, 
    categoryId: string
) => {
    await documentRepository.updateDocumentById(documentId, title, description, categoryId);
}

export const deleteDocument = async (documentId: string) => {
    const fileUrl = await documentRepository.deleteDocumentById(documentId);
    return fileUrl;
}