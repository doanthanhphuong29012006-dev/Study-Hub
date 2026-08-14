import { Request, Response } from "express";
import * as documentService from '../services/document.service';

export const getAllDocument = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const categoryId = req.query.categoryId;
        const sortedBy = req.query.sortedBy;
        const order = req.query.order;


        const data = await documentService.getAllDocument(page, limit, categoryId, sortedBy, order);

        res.status(200).json({
            message: "Lấy tất cả tài liệu thành công!",
            documents: data.documents,
            pagination: data.pagination
        })
    } catch (error) {
        console.error('Lỗi hệ thống trong quá trình lấy tài liệu:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}