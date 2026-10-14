import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateChangeStatus = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        status: Joi.string()
                .valid('pending', 'approved', 'rejected')
                .required()
                .messages({
            'any.only': 'Trạng thái không hợp lệ! Chỉ chấp nhận "approved", "rejected" hoặc "pending".',
            'any.required': 'Trạng thái không được để trống!',
            'string.base': 'Trạng thái phải là một chuỗi văn bản.'
        })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    
    next();
};