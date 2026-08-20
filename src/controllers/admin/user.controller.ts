import { Request, Response } from "express";
import * as userService from '../../services/admin/user.service';

export const getAllUser = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const email = req.query.email;

        const { users, pagination } = await userService.getAllUser(page, limit, email as string);

        res.status(200).json({
            message: "Lấy tất cả người dùng thành công!",
            users: users,
            pagination: pagination
        });
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình lấy tất cả người dùng:', error);

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}

export const changeUserStatus = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id as string;

        const { status } = req.body;

        if (req.user.id === userId) {
            return res.status(403).json({ 
                message: "Hệ thống từ chối thao tác tự thay đổi trạng thái tài khoản cá nhân!" 
            });
        }

        await userService.changeUserStatus(userId, status);

        res.status(200).json({
            message: "Thay đổi trạng thái người dùng thành công!"
        });
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình thay đổi trạng thái người dùng:', error);

        if (error.message === "User_Not_Found") {
            return res.status(404).json({ 
                message: "Người dùng không tồn tại!" 
            });
        }

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}

export const changeUserRole = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id as string;

        const { role } = req.body;

        if (req.user.id === userId) {
            return res.status(403).json({ 
                message: "Hệ thống từ chối thao tác tự thay đổi quyền tài khoản cá nhân!" 
            });
        }

        await userService.changeUserRole(userId, role);

        res.status(200).json({
            message: "Thay đổi quyền người dùng thành công!"
        });
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình thay đổi quyền người dùng:', error);

        if (error.message === "User_Not_Found") {
            return res.status(404).json({ 
                message: "Người dùng không tồn tại!" 
            });
        }

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}