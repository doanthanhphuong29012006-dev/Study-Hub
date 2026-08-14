import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
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

export const createDocument = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Vui lòng đính kèm tệp tin!" });
        }

        const userId = req.user.id;

        const fileUrl = req.file.path;
        const fileSize = req.file.size;
        const fileType = req.file.mimetype;

        const { title, description, categoryId } = req.body;

        await documentService.createDocument(fileUrl, fileSize, fileType, title, description, categoryId, userId);

        res.status(201).json({
            message: "Tải tài liệu lên thành công!",
            data: { fileUrl }
        });
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình tải tài liệu:', error);

        if (req.file && req.file.filename) {
            try {
                await cloudinary.uploader.destroy(req.file.filename);
                console.log(`Đã xóa tệp tin rác trên Cloudinary: ${req.file.filename}`);
            } catch (cloudinaryError) {
                console.error('Lỗi hệ thống khi tiến hành xóa tệp tin Cloudinary:', cloudinaryError);
            }
        }

        if (error.message === "Does_Not_Exist_User") {
            return res.status(404).json({ message: 'Người dùng không tồn tại trong hệ thống.' });
        }

        if (error.message === "Does_Not_Exist_Category") {
            return res.status(404).json({ message: 'Danh mục không tồn tại.' });
        }

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}

export const getDetailDocument = async (req: Request, res: Response) => {
    try {
        const documentId = req.params.id;
        const document = await documentService.getDetailDocument(documentId as string);

        res.status(200).json({
            message: "Lấy chi tiết tài liệu thành công",
            document: document
        })
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình lấy chi tiết tài liệu:', error);

        if (error.message === "Document_Not_Found") {
            return res.status(404).json({
                message: 'Tài liệu không tồn tại hoặc đã bị xóa.'
            });
        }

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}

export const downloadDocument = async (req: Request, res: Response) => {
    try {
        const documentId = req.params.id;
        const fileUrl = await documentService.downloadDocument(documentId as string);

        res.status(200).json({
            message: "Tải tài liệu về thành công!",
            data: {
                fileUrl: fileUrl
            }
        });
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình tải tài liệu:', error);

        if (error.message === "Document_Not_Found") {
            return res.status(404).json({
                message: 'Tài liệu không tồn tại hoặc đã bị xóa.'
            });
        }

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}