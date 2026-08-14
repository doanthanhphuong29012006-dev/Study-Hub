import * as helper from "../helpers/pagination.helper";
import { findAllDocument } from "../repositories/document.repository";

export const getAllDocument = async (page: number, limit: number, categoryId?: any, sortedBy?: any, order?: any) => {
    const skip = limit * (page - 1);

    const { documents, totalCount } = await findAllDocument(limit, skip, categoryId, sortedBy, order)

    const pagination = helper.pagination(page, limit, totalCount);

    return { documents, pagination };
}