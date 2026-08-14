import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const createDocumentValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        title: Joi.string()
            .required()
            .max(255)
            .messages({
                "string.empty": "Tiêu đề tài liệu không được để trống!",
                "string.max": "Tiêu đề không được vượt quá 255 ký tự!",
                "any.required": "Trường tiêu đề là bắt buộc!"
            }),
        description: Joi.string()
            .allow('', null)
            .optional(),
        categoryId: Joi.string()
            .guid({ version: ['uuidv4'] })
            .required()
            .messages({
                "string.empty": "ID danh mục không được để trống!",
                "string.guid": "ID danh mục phải là chuẩn UUID (vd: 123e4567-e89b-12d3-a456-426614174000)!",
                "any.required": "Trường categoryId là bắt buộc!"
            })
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