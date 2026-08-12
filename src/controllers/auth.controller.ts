import { Request, Response } from "express";
import { createAccount } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, fullName, password } = req.body;

        await createAccount(email, fullName, password);

        res.status(201).json({
            message: "Đăng ký tài khoản thành công!"
        });
    } catch (error: any) {
        if (error.message === "Email_Exist") {
            return res.status(409).json({
                message: "Email này đã được đăng ký trong hệ thống."
            });
        }

        console.error('Lỗi hệ thống trong quá trình xử lý đăng ký:', error);
        res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}