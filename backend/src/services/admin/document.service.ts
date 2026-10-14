import * as documentRepository from '../../repositories/admin/document.repository';
import * as helper from '../../helpers/pagination.helper';

export const changeDocumentStatus = async (documentId: string, status: string) => {
    await documentRepository.changeDocumentStatusById(documentId, status);
}

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