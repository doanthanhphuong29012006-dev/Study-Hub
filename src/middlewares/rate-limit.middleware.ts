import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {
        message: "Hệ thống đang tiếp nhận quá nhiều yêu cầu từ bạn. Vui lòng thử lại sau 15 phút!"
    },
    standardHeaders: 'draft-8',
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        message: "Bạn đã đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút để bảo mật tài khoản!"
    },
    standardHeaders: 'draft-8',
    legacyHeaders: false,
});

export const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        message: "Bạn đã tạo quá nhiều tài khoản. Vui lòng quay lại sau!"
    },
    standardHeaders: 'draft-8',
    legacyHeaders: false,
});