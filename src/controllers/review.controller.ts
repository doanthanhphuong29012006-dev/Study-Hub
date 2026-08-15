import { Request, Response } from "express";
import * as reviewService from '../services/review.service';

export const createReview = async (req: Request, res: Response) => {
    try {
        const { rating, comment } = req.body;

        const userId = req.user.id;

        const documentId = req.params.id;

        await reviewService.createReview(rating, comment, userId, documentId as string);

        res.status(200).json({
            message: "Tạo đánh giá thành công!"
        })
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình tạo đánh giá:', error);

        if (error.code === '23503') {
            return res.status(404).json({ 
                message: "Tài liệu hoặc người dùng không tồn tại trong hệ thống!" 
            });
        }

        if (error.code === '23505') { 
            return res.status(409).json({ 
                message: "Bạn đã đánh giá tài liệu này rồi!" 
            });
        }

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}