import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const createReviewValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        rating: Joi.number()
            .integer()
            .required()
            .max(5)
            .min(1)
            .messages({
                "any.required": "Vui lòng cung cấp điểm đánh giá!",
                "number.base": "Điểm đánh giá phải là một số!",
                "number.max": "Số điểm không được vượt quá 5!",
                "number.min": "Số điểm không được nhỏ hơn 1!"
            }),
        comment: Joi.string()
            .allow('', null)
            .max(500)
            .messages({
                "string.max": "Đánh giá không được vượt quá 500 kí tự"
            })
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        res.status(400).json({
            message: error.details[0].message
        });

        return;
    }

    req.body = value;

    next();
}