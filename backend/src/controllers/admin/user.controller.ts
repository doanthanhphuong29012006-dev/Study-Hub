import { Request, Response } from "express";
import * as userService from '../../services/admin/user.service';

export const getAllUser = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

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
        const targetUserId = (req.params.id as string).toLowerCase();
        const actorId = (req.user.id as string).toLowerCase();

        const { status } = req.body;

        if (targetUserId === actorId) {
            return res.status(403).json({ 
                message: "Hệ thống từ chối thao tác tự thay đổi trạng thái tài khoản cá nhân!" 
            });
        }

        await userService.changeUserStatus(targetUserId, status, actorId);

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

        if (error.message === "Self_Modification_Denied") {
            return res.status(403).json({ 
                message: "Hệ thống từ chối thao tác do vi phạm quyền (Tự thay đổi quyền/trạng thái)." 
            });
        }

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}

export const changeUserRole = async (req: Request, res: Response) => {
    try {
        const targetUserId = (req.params.id as string).toLowerCase();
        const actorId = (req.user.id as string).toLowerCase();

        const { role } = req.body;

        if (targetUserId === actorId) {
            return res.status(403).json({ 
                message: "Hệ thống từ chối thao tác tự thay đổi quyền tài khoản cá nhân!" 
            });
        }

        await userService.changeUserRole(targetUserId, role, actorId);

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

        if (error.message === "Self_Modification_Denied") {
            return res.status(403).json({ 
                message: "Hệ thống từ chối thao tác do vi phạm quyền (Tự thay đổi quyền/trạng thái)." 
            });
        }

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}