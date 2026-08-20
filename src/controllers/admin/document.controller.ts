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