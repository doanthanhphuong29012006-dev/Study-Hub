import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateChangeStatus = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        status: Joi.string()
                .valid('active', 'locked')
                .required()
                .messages({
            'any.only': 'Trạng thái không hợp lệ! Chỉ chấp nhận "active" hoặc "locked".',
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

export const validateChangeRole = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        role: Joi.string()
                .valid('admin', 'student')
                .required()
                .messages({
            'any.only': 'Vai trò không hợp lệ! Chỉ chấp nhận "admin" hoặc "student".',
            'any.required': 'Vai trò không được để trống!',
            'string.base': 'Vai trò phải là một chuỗi văn bản.'
        })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    
    next();
};