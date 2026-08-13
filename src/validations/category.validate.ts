import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const createCategoryValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string()
            .required()
            .messages({
                "string.empty": "Tên danh mục không được để trống!"
            }),
        slug: Joi.string()
            .required()
            .messages({
                "string.empty": "Đường dẫn (slug) không được để trống!"
            }),
        description: Joi.string()
            .allow('', null) 
            .optional()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).json({
            message: error.details[0].message
        });

        return;
    }

    next();
}