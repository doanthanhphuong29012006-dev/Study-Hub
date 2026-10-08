import multer from "multer";
import os from 'os';
import path from 'path';
import { Request, Response, NextFunction } from "express";

const tempStorage =  multer.diskStorage({
    destination: os.tmpdir(),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const documentUpload = multer({
    storage: tempStorage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'application/pdf', 
            'application/msword', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
            'application/vnd.ms-powerpoint', 
            'application/vnd.openxmlformats-officedocument.presentationml.presentation', 
            'application/zip',
            'application/x-zip-compressed'
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("File_Type_Not_Allowed"));
        }
    }
});

export const uploadDocumentMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const upload = documentUpload.single("file");
    
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: "Kích thước tệp tin vượt quá 10MB!" });
            }
            return res.status(400).json({ message: "Lỗi tải tệp: " + err.message });
        } else if (err) {
            if (err.message === "File_Type_Not_Allowed") {
                return res.status(400).json({ message: "Định dạng tệp tin không được hỗ trợ!" });
            }
            return res.status(500).json({ message: "Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau." });
        }
        
        next();
    });
};

const avatarUpload = multer({
    storage: tempStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error("File_Type_Not_Allowed"));
        }
    }
});

export const uploadAvatarMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const upload = avatarUpload.single("avatar"); 
    
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: "Kích thước ảnh đại diện không được vượt quá 5MB!" });
            }
            return res.status(400).json({ message: "Lỗi tải ảnh: " + err.message });
        } else if (err) {
            if (err.message === "File_Type_Not_Allowed") {
                return res.status(400).json({ message: "Định dạng ảnh không hợp lệ! Vui lòng chọn ảnh JPG, PNG..." });
            }
            return res.status(500).json({ message: "Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau." });
        }
        
        next();
    });
}