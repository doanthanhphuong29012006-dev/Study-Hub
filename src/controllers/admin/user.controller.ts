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