import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Tạo cấu hình lưu trữ trên Cloudinary
export const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req: any, file: Express.Multer.File) => {
        const isImage = file.mimetype.startsWith('image/');
        
        const ext = file.originalname.split('.').pop();
        
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

        if (isImage) {
            return {
                folder: 'studyhub_documents',
                resource_type: 'auto',
                public_id: uniqueName
            };
        } else {
            return {
                folder: 'studyhub_documents',
                resource_type: 'raw',
                public_id: `${uniqueName}.${ext}` 
            };
        }
    }
});