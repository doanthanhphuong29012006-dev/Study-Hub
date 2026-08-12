import { Request, Response } from "express";
import { createAccount, verifyLogin } from "../services/auth.service";

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

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const { user, token } = await verifyLogin(email, password);

        res.cookie("token", token, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: 'lax'
        });

        res.status(200).json({
            message: "Đăng nhập tài khoản thành công!",
            user: user

        });
    } catch (error: any) {
        if (error.message === "Login_Error") {
            return res.status(401).json({
                message: "Email hoặc mật khẩu không chính xác."
            });
        }

        console.error('Lỗi hệ thống trong quá trình xử lý đăng nhập:', error);
        res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token");
        
        return res.status(200).json({
            message: "Đăng xuất thành công!"
        });
    } catch (error) {
        console.error('Lỗi hệ thống trong quá trình xử lý đăng xuất:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}