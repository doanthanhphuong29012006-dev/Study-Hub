import { Request, Response } from "express";
import * as userService from '../services/user.service';
import { v2 as cloudinary } from "cloudinary";

export const getInfoUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        const data = await userService.getInfoUser(userId);

        res.status(200).json({
            message: "Lấy thông tin người dùng thành công!",
            data: data

        })
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
    try {
        const userId = req.user.id;

        const { fullName } = req.body;

        const newAvatarUrl = req.file ? req.file.path : undefined;

        if (newAvatarUrl) {
            try {
                const oldUser = await userService.getInfoUser(userId);

                if (oldUser.avatar && oldUser.avatar.includes('cloudinary.com')) {
                    const urlParts = oldUser.avatar.split('/');
                    const fileNameWithExtension = urlParts[urlParts.length - 1];
                    const publicId = fileNameWithExtension.split('.')[0];

                    await cloudinary.uploader.destroy(publicId);
                    console.log(`Đã dọn dẹp avatar cũ trên Cloudinary: ${publicId}`);
                }
            } catch (err) {
                console.error("Lỗi trong quá trình dọn dẹp ảnh cũ:", err);
            }
        }

        await userService.updateInfoUser(userId, fullName, newAvatarUrl);

        res.status(200).json({
            message: "Cập nhật thông tin người dùng thành công!"
        });
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình cập nhật thông tin người dùng:', error);

        if (req.file && req.file.filename) {
            cloudinary.uploader.destroy(req.file.filename).catch(err => 
                console.error("Lỗi xóa ảnh rác (do db lỗi):", err)
            );
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