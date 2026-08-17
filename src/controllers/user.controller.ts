import { Request, Response } from "express";
import * as userService from '../services/user.service';

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

        const avatar = req.file ? req.file.path : undefined;

        await userService.updateInfoUser(userId, fullName, avatar);

        res.status(200).json({
            message: "Cập nhật thông tin người dùng thành công!"
        });
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình cập nhật thông tin người dùng:', error);

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