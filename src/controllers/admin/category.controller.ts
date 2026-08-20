import { Request, Response } from "express";
import * as categoryService from '../../services/admin/category.service';

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, slug, description } = req.body;

        await categoryService.createNewCategory(name, slug, description);

        res.status(201).json({
            message: "Tạo mới danh mục thành công!"
        });
    } catch (error: any) {
        if (error.message === "Error_Category_Name") {
            return res.status(409).json({ message: "Tên danh mục đã tồn tại trong hệ thống!" });
        }
        if (error.message === "Error_Category_Slug") {
            return res.status(409).json({ message: "Đường dẫn (slug) đã tồn tại trong hệ thống!" });
        }

        console.error('Lỗi hệ thống trong quá trình tạo mới danh mục:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.id;

        await categoryService.deleteCategory(categoryId as string);

        res.status(200).json({
            message: "Xóa danh mục thành công!"
        });
    } catch (error: any) {
        if (error.message === "Category_In_Use") {
            return res.status(409).json({ 
                message: "Không thể xóa! Danh mục này đang chứa tài liệu!" 
            });
        }
        
        if (error.message === "Category_Not_Found") {
            return res.status(404).json({ 
                message: "Danh mục không tồn tại!" 
            });
        }

        console.error('Lỗi hệ thống trong quá trình xóa danh mục:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.id;

        const { name, slug, description } = req.body;

        await categoryService.updateCategory(categoryId as string, name, slug, description);

        res.status(200).json({
            message: "Cập nhật danh mục thành công!"
        });
    } catch (error: any) {
        if (error.message === "Category_Not_Found") {
            return res.status(404).json({ 
                message: "Danh mục không tồn tại!" 
            });
        }

        console.error('Lỗi hệ thống trong quá trình cập nhật danh mục:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
        });
    }
}