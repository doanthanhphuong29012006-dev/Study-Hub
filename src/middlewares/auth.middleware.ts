import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import * as userRepository from '../repositories/user.repository';

declare global {
    namespace Express {
        interface Request {
            user?: any
        }
    }
}

interface DecodedToken extends JwtPayload {
    userId: string,
    email: string,
    role: string
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({
                message: "Không tìm thấy token xác thực! Vui lòng đăng nhập!"
            });
            
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

        if (!decoded.userId) {
            res.status(403).json({
                message: "Bạn không có quyền truy cập vào tài nguyên này!"
            });
            return;
        }

        if (decoded.role !== 'student' && decoded.role !== 'admin') {
            res.status(403).json({ message: "Lỗi phân quyền! Vai trò của tài khoản không hợp lệ." });
            return;
        }

        const id = decoded.userId;

        const existUser = await userRepository.getUserById(id);

        if (existUser.rowCount === 0) {
            res.status(401).json({
                message: "Tài khoản không tồn tại hoặc đã bị khóa!"
            });

            return;
        }

        const user = existUser.rows[0];

        if (user.status === 'locked') {
            return res.status(403).json({
                message: "Tài khoản của bạn đã bị khóa!"
            });
        }

        delete user.password_hash;

        req.user = user

        next();
    } catch (error) {
        console.error("Lỗi xác thực JWT:", error);
        
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({
                message: "Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại."
            });
        }

        if (error instanceof JsonWebTokenError) {
            return res.status(401).json({
                message: "Token xác thực không hợp lệ!"
            });
        }

        return res.status(500).json({
            message: "Đã xảy ra sự cố hệ thống. Vui lòng thử lại sau!"
        });
    }
}