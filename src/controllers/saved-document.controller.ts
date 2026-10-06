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

        if (error.message === "Document_Not_Found") {
            return res.status(404).json({
                message: 'Tài liệu không tồn tại hoặc đã bị xóa.'
            });
        }

        if (error.message === 'Document_Not_Allow') {
            return res.status(403).json({
                message: 'Bạn không có quyền truy cập tài liệu này!'
            });
        }

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

export const getDocumentUserSaved = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        const page = (parseInt(req.query.page as string) > 0 ? parseInt(req.query.page as string) : 1) || 1;
        let safeLimit = (parseInt(req.query.limit as string) > 0 ? parseInt(req.query.limit as string) : 10) || 10;

        if (safeLimit > 100) {
            safeLimit = 100;
        }

        const { savedDocuments, pagination } = await savedDocumentService.getDocumentUserSaved(userId, page, safeLimit);

        res.status(200).json({
            message: "Lấy tài liệu đã lưu thành công!",
            savedDocuments: savedDocuments,
            pagination: pagination
        });
    } catch (error) {
        console.error('Lỗi hệ thống trong quá trình lấy tài liệu đã lưu:', error);

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}

export const checkSaveStatus = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        const documentId = req.params.id;

        const isSaved = await savedDocumentService.checkSaveStatus(userId, documentId as string);

        res.status(200).json({
            message: "Lấy trạng thái tài liệu thành công!",
            isSaved: isSaved
        });
    } catch (error) {
        console.error('Lỗi hệ thống trong quá trình lấy trạng thái tài liệu:', error);

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}