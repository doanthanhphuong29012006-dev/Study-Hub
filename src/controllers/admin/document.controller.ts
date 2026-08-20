import { Request, Response } from "express";
import * as documentService from '../../services/admin/document.service';

export const changeDocumentStatus = async (req: Request, res: Response) => {
    try {
        const documentId = req.params.id as string;

        const { status } = req.body;

        await documentService.changeDocumentStatus(documentId, status);

        res.status(200).json({
            message: "Cập nhật trạng thái tài liệu thành công!"
        })
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình Cập nhật trạng thái:', error);

        if (error.message == "Document_Not_Found") {
            return res.status(404).json({
                message: "Tài liệu không tồn tại!"
            });
        }

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}

export const getAllDocument = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const categoryId = req.query.categoryId;
        const sortedBy = req.query.sortedBy;
        const order = req.query.order;
        const keyword = req.query.keyword as string || undefined;

        const data = await documentService.getAllDocument(page, limit, categoryId, keyword, sortedBy, order);

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