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

export const getAllReview = async (req: Request, res: Response) => {
    try {
        const documentId = req.params.id;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10; 

        const { reviews, pagination } = await reviewService.getAllReview(documentId as string, page, limit);

        res.status(200).json({
            message: "Lấy tất cả đánh giá thành công!",
            reviews: reviews,
            pagination: pagination
        })
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình lấy tất cả đánh giá:', error);

        if (error.message == "Document_Not_Found") {
            return res.status(404).json({
                message: "Tài liệu không tồn tại hoặc đã bị xóa!"
            });
        }

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}

export const updateReview = async (req: Request, res: Response) => {
    try {
        const reviewId = req.params.id;

        const userId = req.user.id;

        const { rating, comment } = req.body;

        await reviewService.updateReview(reviewId as string, userId, rating, comment);

        res.status(200).json({
            message: "Cập nhật đánh giá thành công!"
        })
    } catch (error: any) {
        console.error('Lỗi hệ thống trong quá trình cập nhật đánh giá:', error);

        if (error.message == "Update_Review_Error") {
            return res.status(404).json({
                message: "Đánh giá không tồn tại hoặc bạn không có quyền chỉnh sửa đánh giá này!"
            });
        }

        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}