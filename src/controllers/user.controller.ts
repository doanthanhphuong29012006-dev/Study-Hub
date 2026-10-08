import { Request, Response } from "express";
import fs from "fs";
import * as userService from '../services/user.service';
import { v2 as cloudinary } from "cloudinary";

export const getInfoUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        const data = await userService.getInfoUser(userId);

        const role = req.user.role;

        res.status(200).json({
            message: "Lấy thông tin người dùng thành công!",
            data: data,
            role: role
        });
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình lấy thông tin người dùng:', error);

        if (error.message === "User_Not_Found") {
            return res.status(404).json({ 
                message: "Không tìm thấy thông tin người dùng!" 
            });
        }

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}

export const updateInfoUser = async (req: Request, res: Response) => {
    let cloudUploadResult: any = null;

    try {
        const userId = req.user.id;
        const { fullName } = req.body;

        if (req.file) {
            cloudUploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'studyhub_avatars',
                resource_type: 'image'
            });
        }

        const newAvatarUrl = cloudUploadResult ? cloudUploadResult.secure_url : undefined;

        const oldUser = await userService.getInfoUser(userId);
        const oldAvatarUrl = oldUser.avatar;

        await userService.updateInfoUser(userId, fullName, newAvatarUrl);

        if (newAvatarUrl && oldAvatarUrl && oldAvatarUrl.includes("cloudinary.com")) {
            try {
                const urlParts = oldAvatarUrl.split('/');
                const fileNameWithExtension = urlParts[urlParts.length - 1];
                const fileName = fileNameWithExtension.split('.')[0];
                
                const publicId = `studyhub_avatars/${fileName}`;

                await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
                console.log(`Đã dọn dẹp avatar cũ trên Cloudinary: ${publicId}`);
            } catch (err) {
                console.error("Lỗi trong quá trình dọn dẹp ảnh cũ:", err);
            }
        }

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(200).json({
            message: "Cập nhật thông tin người dùng thành công!"
        });
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình cập nhật thông tin người dùng:', error);

        if (cloudUploadResult) {
            cloudinary.uploader.destroy(cloudUploadResult.public_id, { resource_type: 'image' }).catch(err => 
                console.error("Lỗi xóa ảnh rollback (do db lỗi):", err)
            );
        }
        
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        if (error.message === "User_Not_Found") {
            return res.status(404).json({ 
                message: "Không tìm thấy thông tin người dùng!" 
            });
        }

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}

export const getMyDocument = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const { documents, pagination } = await userService.getMyDocument(userId, page, limit);

        res.status(200).json({
            message: "Lấy tài liệu đã đăng thành công!",
            documents: documents,
            pagination: pagination
        });
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình lấy tài liệu đã đăng:', error);

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}