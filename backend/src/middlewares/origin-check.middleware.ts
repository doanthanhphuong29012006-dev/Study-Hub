import { Request, Response, NextFunction } from "express";

export const requireValidOrigin = (req: Request, res: Response, next: NextFunction) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const defaultOrigins = [
        "http://localhost:5173", 
        "https://study-hub-zeta-inky.vercel.app",
        "https://payt-chia-se-tai-lieu.vercel.app", 
        "https://payt-chia-se-tai-lieu-f0zzshy7b.vercel.app",
        "http://localhost:8080"
    ];

    const envOrigins = (process.env.CLIENT_ORIGIN || process.env.FRONTEND_URL || "")
        .split(",")
        .map(o => o.trim())
        .filter(Boolean);

    const allowedOrigins = [...defaultOrigins, ...envOrigins];

    const origin = req.headers.origin;
    if (!origin || (!allowedOrigins.includes(origin) && !origin.endsWith(".vercel.app"))) {
        return res.status(403).json({ message: "Bị từ chối: Nguồn gốc không hợp lệ (Bảo vệ CSRF)" });
    }

    next();
}
