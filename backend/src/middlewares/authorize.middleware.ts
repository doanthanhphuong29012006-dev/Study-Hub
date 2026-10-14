import { Request, Response, NextFunction } from "express";

export const requirePermission = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Lỗi phân quyền! Tính năng này chỉ dành cho quản trị viên." });
        }

        next();
    } catch (error) {
        console.error("Lỗi hệ thống tại middleware phân quyền:", error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi máy chủ nội bộ trong quá trình kiểm tra quyền."
        });
    }
}