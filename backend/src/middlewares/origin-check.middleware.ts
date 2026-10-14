import { Request, Response, NextFunction } from "express";

export const requireValidOrigin = (req: Request, res: Response, next: NextFunction) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const allowedOrigins = [
        "http://localhost:5173", 
        "https://payt-chia-se-tai-lieu.vercel.app", 
        "https://payt-chia-se-tai-lieu-f0zzshy7b.vercel.app"
    ];

    const origin = req.headers.origin;
    if (!origin || !allowedOrigins.includes(origin)) {
        return res.status(403).json({ message: "Bị từ chối: Nguồn gốc không hợp lệ (Bảo vệ CSRF)" });
    }

    next();
}