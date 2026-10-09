import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10)
    }).unknown(true);

    const { error, value } = schema.validate(req.query);

    if (error) {
        return res.status(400).json({ 
            message: "Tham số phân trang không hợp lệ!" 
        });
    }

    req.query.page = value.page;
    req.query.limit = value.limit;

    next();
}