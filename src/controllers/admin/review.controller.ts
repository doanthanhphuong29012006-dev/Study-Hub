import { Request, Response } from "express";
import * as reviewService from '../../services/admin/review.service';

export const getAllReviewsGlobal = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10; 

        const keyword = req.query.keyword;

        const { reviews, pagination } = await reviewService.getAllReviewsGlobal(page, limit, keyword as string);

        res.status(200).json({
            message: "Lấy tất cả đánh giá thành công!",
            reviews: reviews,
            pagination: pagination
        })
    } catch (error) {
        console.error('Lỗi hệ thống trong quá trình lấy tất cả đánh giá:', error);

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}