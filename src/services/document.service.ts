import * as helper from "../helpers/pagination.helper";
import { createNewDocument, findAllDocument, findDocumentById } from "../repositories/document.repository";

export const getAllDocument = async (page: number, limit: number, categoryId?: any, sortedBy?: any, order?: any) => {
    const skip = limit * (page - 1);

    const { documents, totalCount } = await findAllDocument(limit, skip, categoryId, sortedBy, order)

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
    await createNewDocument(fileUrl, fileSize, fileType, title, description, categoryId, userId);
}

export const getDetailDocument = async (documentId: string) => {
    const document = await findDocumentById(documentId);
    return document;
}