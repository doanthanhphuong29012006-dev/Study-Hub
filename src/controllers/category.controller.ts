import { Request, Response } from "express";
import * as categoryService from '../services/category.service';

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const data = await categoryService.getAllCategories();

        res.status(200).json({
            message: "Lấy danh mục tài liệu thành công!",
            data: data
        })
    } catch (error) {
        console.error('Lỗi hệ thống trong quá trình lấy danh mục:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}

export const detailCategory = async (req: Request, res: Response) => {
    try {
        const slug = req.params.slug;

        const category = await categoryService.getDetailCategory(slug as string);

        res.status(200).json({
            message: "Lấy chi tiết danh mục thành công!",
            category: category
        })
    } catch (error) {
        console.error('Lỗi hệ thống trong quá trình lấy chi tiết danh mục:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}