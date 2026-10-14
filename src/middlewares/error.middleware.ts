import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("[Lỗi Hệ Thống Không Xác Định]:", err);

    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({ 
            message: "Dữ liệu JSON gửi lên không hợp lệ!" 
        });
    }

    if (err.name === 'MulterError') {
        return res.status(400).json({ 
            message: `Lỗi tải file: ${err.message}` 
        });
    }

    const statusCode = err.status || err.statusCode || 500;
    const message = statusCode === 500 
        ? "Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau." 
        : err.message;

    return res.status(statusCode).json({ message });
};