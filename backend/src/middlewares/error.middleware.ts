import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("[Lỗi Hệ Thống Không Xác Định]:", err);

    if (err.code === '23505') {
        return res.status(409).json({ 
            message: "Dữ liệu này đã tồn tại trong hệ thống. Vui lòng kiểm tra lại (Trùng email, slug, hoặc bản ghi)!" 
        });
    }

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