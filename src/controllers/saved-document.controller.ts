import { Request, Response } from "express";
import * as savedDocumentService from '../services/saved-document.service';

export const saveDocument = async (req: Request, res: Response) => {
    try {
        const documentId = req.params.id;
        
        const userId = req.user.id;

        await savedDocumentService.saveDocument(documentId as string, userId);

        res.status(200).json({
            message: "Lưu tài liệu thành công!"
        });
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình lưu tài liệu:', error);

        if (error.code === '23503') {
            return res.status(404).json({ 
                message: "Tài liệu hoặc người dùng không tồn tại trong hệ thống!" 
            });
        }

        if (error.code === '23505') { 
            return res.status(409).json({ 
                message: "Bạn đã lưu tài liệu này rồi!" 
            });
        }

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}

export const unsaveDocument = async (req: Request, res: Response) => {
    try {
        const documentId = req.params.id;
        
        const userId = req.user.id;

        await savedDocumentService.unsaveDocument(documentId as string, userId);

        res.status(200).json({
            message: "Bỏ lưu tài liệu thành công!"
        });
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình bỏ lưu tài liệu:', error);

        if (error.message === "Saved_Document_Error") {
            return res.status(404).json({ 
                message: "Tài liệu hoặc người dùng không tồn tại trong hệ thống!" 
            });
        }

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}