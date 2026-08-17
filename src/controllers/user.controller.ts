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
    } catch (error) {
        console.error('Lỗi hệ thống trong quá trình lấy thông tin người dùng:', error);

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}