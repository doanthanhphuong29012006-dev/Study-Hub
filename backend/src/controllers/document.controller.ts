import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import * as documentService from '../services/document.service';

export const getAllDocument = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

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

export const createDocument = async (req: Request, res: Response) => {
    let cloudUploadResult: any = null;

    try {
        if (!req.file) {
            return res.status(400).json({ message: "Vui lòng đính kèm tệp tin!" });
        }

        const userId = req.user.id;
        const { title, description, categoryId } = req.body;

        const isImage = req.file.mimetype.startsWith('image/');
        const ext = req.file.originalname.split('.').pop();
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const publicId = isImage ? uniqueName : `${uniqueName}.${ext}`;

        //Thực hiện tải file từ vùng tạm lên cloudinary
        cloudUploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'studyhub_documents',
            resource_type: isImage ? 'auto' : 'raw',
            public_id: publicId
        });

        const fileUrl = cloudUploadResult.secure_url;
        const fileSize = req.file.size;
        const fileType = req.file.mimetype;

        await documentService.createDocument(fileUrl, fileSize, fileType, title, description, categoryId, userId);

        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path)
        };

        res.status(201).json({
            message: "Tải tài liệu lên thành công!",
            data: { fileUrl }
        });
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình tải tài liệu:', error);

        if (cloudUploadResult) {
            try {
                const isRaw = cloudUploadResult.resource_type === 'raw';
                await cloudinary.uploader.destroy(cloudUploadResult.public_id, {
                    resource_type: isRaw ? 'raw' : 'image'
                });
            } catch (cloudErr) {
                console.error("Lỗi xóa file rollback Cloudinary:", cloudErr);
            }
        }

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
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

        const userId = req.user.id;
        const userRole = req.user.role;

        const document = await documentService.getDetailDocument(documentId as string, userId, userRole);

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

        if (error.message === "Document_Not_Allow") {
            return res.status(403).json({
                message: 'Bạn không có quyền truy cập tài liệu này!'
            });
        }

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}

export const updateDocument = async (req: Request, res: Response) => {
    try {
        const documentId = req.params.id;

        const userId = req.user.id as string;
        const userRole = req.user.role;

        const { title, description, categoryId } = req.body;

        await documentService.updateDocument(documentId as string, userId, userRole, title, description, categoryId);

        res.status(200).json({
            message: "Cập nhật tài liệu thành công!"
        });
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình cập nhật tài liệu:', error);

        if (error.message === "Document_Not_Found") {
            return res.status(404).json({
                message: 'Tài liệu không tồn tại hoặc đã bị xóa.'
            });
        }

        if (error.message === "Permission_Denied") {
            return res.status(403).json({
                message: 'Bạn không có quyền thực hiện thao tác này!'
            });
        }

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}

export const deleteDocument = async (req: Request, res: Response) => {
    try {
        const documentId = req.params.id;

        const userId = req.user.id;
        const userRole = req.user.role;

        const fileUrl = await documentService.deleteDocument(documentId as string, userId, userRole);
        if (fileUrl) {
            try {
                const urlPart = fileUrl.split('/');
                const fileNameWithExtension = urlPart[urlPart.length - 1];
                
                const isRaw = fileUrl.includes('/raw/upload/');
                
                const publicId = isRaw 
                    ? `studyhub_documents/${fileNameWithExtension}` 
                    : `studyhub_documents/${fileNameWithExtension.split('.')[0]}`;

                await cloudinary.uploader.destroy(publicId, {
                    resource_type: isRaw ? 'raw' : 'image'
                });
                console.log(`Đã dọn file trên cloudinary: ${publicId}`)
            } catch (cloudErr) {
                console.error("Lỗi khi xóa file trên Cloudinary:", cloudErr);
            }
        }

        res.status(200).json({
            message: "Xóa tài liệu thành công!"
        });
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình xóa tài liệu:', error);

        if (error.message === "Document_Not_Found") {
            return res.status(404).json({
                message: 'Tài liệu không tồn tại hoặc đã bị xóa.'
            });
        }

        if (error.message === "Permission_Denied") {
            return res.status(403).json({
                message: 'Bạn không có quyền thực hiện thao tác này!'
            });
        }

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}